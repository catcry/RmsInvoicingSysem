package com.supptel.invoicingsystem.service;

import com.supptel.invoicingsystem.Utils;
import com.supptel.invoicingsystem.entity.*;
import com.supptel.invoicingsystem.enumeration.ExcludeIncludeType;
import com.supptel.invoicingsystem.enumeration.TapFileType;
import com.supptel.invoicingsystem.record.InboundStatementInRecord;
import com.supptel.invoicingsystem.record.InboundStatementOutRecord;
import com.supptel.invoicingsystem.repository.InboundStatementRepository;
import com.supptel.invoicingsystem.repository.NotAvailableSequenceRepository;
import com.supptel.invoicingsystem.repository.OperatorRepository;
import com.supptel.invoicingsystem.repository.SettlementSpecification;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityManager;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import org.hibernate.Session;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.orm.jpa.JpaSystemException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.io.Reader;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Transactional
public class InboundStatementService {
    private static final Logger logger = LoggerFactory.getLogger(InboundStatementService.class);
    private final InboundStatementRepository inboundStatementRepository;
    private final InOutStatementService inOutStatementService;
    private final OutboundStatementService outboundStatementService;
    private final NotAvailableSequenceRepository notAvailableSequenceRepository;
    private final EntityManager entityManager;
    private final OperatorRepository operatorRepository;

    public InboundStatementService(InboundStatementRepository inboundStatementRepository,
                                   InOutStatementService inOutStatementService,
                                   OutboundStatementService outboundStatementService,
                                   NotAvailableSequenceRepository notAvailableSequenceRepository,
                                   EntityManager entityManager,
                                   OperatorRepository operatorRepository) {
        this.inboundStatementRepository = inboundStatementRepository;
        this.inOutStatementService = inOutStatementService;
        this.outboundStatementService = outboundStatementService;
        this.notAvailableSequenceRepository = notAvailableSequenceRepository;
        this.entityManager = entityManager;
        this.operatorRepository = operatorRepository;
    }

    public void addInboundStatement(Long outboundId, InboundStatementEntity entity) {
        try {
            boolean inOutStatementExist = inOutStatementService.existsByOutboundStatement(outboundStatementService.loadById(outboundId));
            if (!inOutStatementExist) {
                inboundStatementRepository.addInboundStatement(
                        outboundId,
                        entity.getPeriodFrom(),
                        entity.getPeriodTo(),
                        entity.getAmount(),
                        entity.getTitle(),
                        entity.getSeqFrom(),
                        entity.getSeqTo(),
                        entity.getReceivedDate(),
                        entity.getUploadBy(),
                        null,
                        null
                );
            }
        } catch (Exception e) {
            logger.error("Exception at line 77: {}", e.getMessage());
        }
    }

    public void updateCriteria(InOutStatementEntity inOutStatement, String excluded, String included) throws SettlementExceptionEntity {
        try {
            if (excluded.isEmpty() || included.isEmpty() ||
                    inOutStatement.getInboundStatement() == null ||
                    inOutStatement.getOutboundStatement() == null) {
                return;
            }
            outboundStatementService.updateOutboundCriteria(inOutStatement.getOutboundStatement().getId(), excluded, included);
        } catch (Exception e) {
            logger.error("Exception at line 90: {}", e.getMessage());
        }
    }

    public void updateInboundStatementByRecord(InboundStatementInRecord updatedData) throws SettlementExceptionEntity {
        try {
            InboundStatementEntity oldInbound = inboundStatementRepository.findById(updatedData.id()).orElse(null);
            if (oldInbound != null) {
                oldInbound.setAmount(updatedData.invoiceSdr());
                oldInbound.setSeqFrom(updatedData.fromSerial());
                oldInbound.setSeqTo(updatedData.toSerial());
                oldInbound.setExcluded(updatedData.excludeSerials());
                oldInbound.setIncluded(updatedData.includeSerials());
                updateInboundStatementEntity(oldInbound);
            } else {
                throw new SettlementExceptionEntity("invalid entity", 410);
            }
        } catch (Exception e) {
            logger.error("Exception at line 108: {}", e.getMessage());
            throw e;
        }
    }

    private void processSequenceChanges(InboundStatementEntity newInbound, InboundStatementEntity oldInbound) {
        List<String> newSequences;
        if (!Objects.equals(newInbound.getSeqFrom(), oldInbound.getSeqFrom())) {
            int oldSeqFrom = safeParseInt(oldInbound.getSeqFrom());
            int newSeqFrom = safeParseInt(newInbound.getSeqFrom());

            if (oldSeqFrom > newSeqFrom) {
                newSequences = parseRange(String.format("%05d", newSeqFrom) + "-" + String.format("%05d", oldSeqFrom), "from");
                updateIncludedSequences(newInbound, newSequences);
            } else {
                newSequences = parseRange(String.format("%05d", oldSeqFrom) + "-" + String.format("%05d", newSeqFrom), "from");
                updateExcludedSequences(newInbound, newSequences);
            }
        }

        if (!Objects.equals(newInbound.getSeqTo(), oldInbound.getSeqTo())) {
            int oldSeqTo = safeParseInt(oldInbound.getSeqTo());
            int newSeqTo = safeParseInt(newInbound.getSeqTo());

            if (newSeqTo > oldSeqTo) {
                newSequences = parseRange(String.format("%05d", oldSeqTo) + "-" + String.format("%05d", newSeqTo), "to");
                updateIncludedSequences(newInbound, newSequences);
            } else {
                newSequences = parseRange(String.format("%05d", newSeqTo) + "-" + String.format("%05d", oldSeqTo), "to");
                updateExcludedSequences(newInbound, newSequences);
            }
        }
    }

    private void updateIncludedSequences(InboundStatementEntity inboundStatement,
                                         List<String> newSequences) {
        Set<String> currentIncluded = new HashSet<>(Arrays.asList(
                Optional.ofNullable(inboundStatement.reformatCriteriaStringToSave(inboundStatement.getIncluded())).orElse("").trim().split(","))
        );
        Set<String> currentExcluded = new HashSet<>(Arrays.asList(
                Optional.ofNullable(inboundStatement.reformatCriteriaStringToSave(inboundStatement.getExcluded())).orElse("").trim().split(","))
        );

        currentIncluded.removeIf(String::isBlank);
        currentExcluded.removeIf(String::isBlank);
        currentExcluded.removeAll(new HashSet<>(newSequences));
        currentIncluded.addAll(newSequences);
        inboundStatement.setIncluded(String.join(",", currentIncluded));
        inboundStatement.setExcluded(String.join(",", currentExcluded));
    }

    private void updateExcludedSequences(InboundStatementEntity newInbound,
                                         List<String> newSequences) {
        Set<String> currentIncluded = new HashSet<>(Arrays.asList(
                Optional.ofNullable(newInbound.reformatCriteriaStringToSave(newInbound.getIncluded())).orElse("")
                        .replace(" ", "").split(","))
        );
        Set<String> currentExcluded = new HashSet<>(Arrays.asList(
                Optional.ofNullable(newInbound.reformatCriteriaStringToSave(newInbound.getExcluded())).orElse("")
                        .replace(" ", "").split(","))
        );

        currentIncluded.removeIf(String::isBlank);
        currentExcluded.removeIf(String::isBlank);

        currentIncluded.removeAll(new HashSet<>(newSequences));
        currentExcluded.addAll(newSequences);
        newInbound.setIncluded(String.join(",", currentIncluded));
        newInbound.setExcluded(String.join(",", currentExcluded));
    }

    private List<String> parseRange(String range, String type) {
        List<String> sequences = new ArrayList<>();
        String[] parts = range.split("-");

        if (parts.length == 1) {
            sequences.add(parts[0]);
        } else if (parts.length == 2) {
            try {
                int start = Integer.parseInt(parts[0]);
                int end = Integer.parseInt(parts[1]);
                if (type.equals("from")) {
                    for (int i = start; i < end; i++) {
                        sequences.add(String.format("%05d", i));
                    }
                } else {
                    for (int i = start + 1; i <= end; i++) {
                        sequences.add(String.format("%05d", i));
                    }
                }
            } catch (NumberFormatException e) {
                sequences.add(range);
            }
        } else {
            sequences.add(range);
        }

        return sequences;
    }

    private int safeParseInt(String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException("Sequence number cannot be null or empty");
        }
        try {
            return Integer.parseInt(value.trim());
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid sequence number format: " + value, e);
        }
    }

    public InboundStatementEntity getOriginalEntity(Long id) {
        return inboundStatementRepository.findById(id)
                .orElse(null);
    }

    public void updateInboundStatementEntity(InboundStatementEntity newInbound) throws SettlementExceptionEntity {
        Long inboundId = newInbound.getId();
        InOutStatementEntity inOutStatement = inOutStatementService.findInOutStatementByInbound(newInbound);
        List<String> notAvailableSequences = notAvailableSequenceRepository
                .findByOutboundStatementOrderByTapSequenceNumber(inOutStatement.getOutboundStatement()).stream()
                .map(NotAvailableSequenceEntity::getTapSequenceNumber).toList();
        newInbound.getNotAvailableExcludedSequences().addAll(notAvailableSequences);
        entityManager.detach(newInbound);
        InboundStatementEntity oldInbound = getOriginalEntity(inboundId);
        processSequenceChanges(newInbound, oldInbound);
        newInbound.prepareCriteriaToSave();
        newInbound.checkNotAvailableSequences();
        try {
            inboundStatementRepository.updateInboundStatement(
                    inboundId,
                    inOutStatement.getOutboundStatement().getId(),
                    newInbound.getSender().getTadigCode(),
                    newInbound.getRecipient().getTadigCode(),
                    newInbound.getPeriodFrom(),
                    newInbound.getPeriodTo(),
                    newInbound.getAmount(),
                    newInbound.getTitle(),
                    newInbound.getSeqFrom(),
                    newInbound.getSeqTo(),
                    newInbound.getReceivedDate(),
                    Utils.getCurrentUsername(),
                    newInbound.getExcluded(),
                    newInbound.getIncluded()
            );
        } catch (JpaSystemException e) {
            logger.error("Database Exception during update: Database error:{}", e.getMessage());
            String errMsg = e.getMessage();
            String shortErrMsg = errMsg.substring(errMsg.indexOf("Some of the sequences provided to include do not exist {"), errMsg.indexOf("}") + 1);
            throw new SettlementExceptionEntity("Database error: " + shortErrMsg, 504);
        } catch (DataAccessException e) {
            logger.error("Database Exception during update:{}", e.getMessage());
            throw new SettlementExceptionEntity("Database error: " + Objects.requireNonNull(e.getRootCause())
                    .getMessage(), 470);
        } catch (Exception e) {
            logger.error("Exception at line 160: {}", e.getMessage());
            throw new SettlementExceptionEntity(e.getMessage(), 470);
        }
    }

    public void createInOutStatement(String year, String month) throws SettlementExceptionEntity {
        if (outboundStatementService.outboundExistByYearAndMonth(year, month)) {
            logger.warn("Warning at line 167: there are outbounds with this year and month in database");
            throw new SettlementExceptionEntity("there are outbounds with this year and month in database", 404);
        }
        try {
            outboundStatementService.updateOutboundStatement(year, month, "TAP");
            List<OutboundStatementEntity> outboundStatements = outboundStatementService.findOutboundStatements();
            outboundStatements.forEach(outbound -> {
                InboundStatementEntity inboundStatement = new InboundStatementEntity();
                inboundStatement.setSender(outbound.getSender());
                inboundStatement.setRecipient(outbound.getRecipient());
                inboundStatement.setSeqFrom(outbound.getSeqFrom());
                inboundStatement.setSeqTo(outbound.getSeqTo());
                inboundStatement.setReceivedDate(Timestamp.valueOf(LocalDateTime.now()));
                inboundStatement.setUploadBy(Utils.getCurrentUsername());
                addInboundStatement(outbound.getId(), inboundStatement);
            });
        } catch (Exception e) {
            logger.error("Exception at line 184: {}", e.getMessage());
        }
    }

    public void updateInOutStatement(String year, String month) throws SettlementExceptionEntity {
        outboundStatementService.updateOutboundStatement(year, month, "TAP");
        List<OutboundStatementEntity> outboundStatements = outboundStatementService.loadOutboundsWithYearAndMonth(year, month);
        List<Long> existOutbounds = new ArrayList<>();
        List<InOutStatementEntity> inOutStatements = inOutStatementService.
                findAll(SettlementSpecification.getAllInboundsRelatedToOutbounds(year, month));
        inOutStatements.forEach(inOutStatement -> {
            if (inOutStatement.getIsConfirmed() == null) {
                OutboundStatementEntity outbound = outboundStatementService.loadById(inOutStatement.getOutboundStatement().getId());
                existOutbounds.add(outbound.getId());
                InboundStatementEntity inboundStatement = inOutStatement.getInboundStatement();
                inboundStatement.setSender(outbound.getSender());
                inboundStatement.setRecipient(outbound.getRecipient());
                inboundStatement.setSeqFrom(outbound.getSeqFrom());
                inboundStatement.setSeqTo(outbound.getSeqTo());
                inboundStatement.setReceivedDate(Timestamp.valueOf(LocalDateTime.now()));
                inboundStatement.setUploadBy(Utils.getCurrentUsername());
                try {
                    updateInboundStatementEntity(inboundStatement);
                } catch (SettlementExceptionEntity e) {
                    logger.error("Exception at line 207: {}", e.getMessage());
                    throw new SettlementExceptionEntity(e.getMessage(), 400);
                }
            }
        });
        outboundStatements = outboundStatements.stream()
                .filter(outboundStatement -> !existOutbounds.contains(outboundStatement.getId())).toList();
        outboundStatements.forEach(outbound -> {
            InboundStatementEntity inboundStatement = new InboundStatementEntity();
            inboundStatement.setSender(outbound.getSender());
            inboundStatement.setRecipient(outbound.getRecipient());
            inboundStatement.setSeqFrom(outbound.getSeqFrom());
            inboundStatement.setSeqTo(outbound.getSeqTo());
            inboundStatement.setReceivedDate(Timestamp.valueOf(LocalDateTime.now()));
            inboundStatement.setUploadBy(Utils.getCurrentUsername());
            addInboundStatement(outbound.getId(), inboundStatement);
        });
    }


    public Page<InboundStatementOutRecord> getInboundRecords(Specification<InOutStatementEntity> specification, Pageable pageable) {
        beforeLoadData();
        return loadInbounds(specification, pageable).map(inOutStatement -> {
            InboundStatementEntity inboundStatement = inOutStatement.getInboundStatement();
            OutboundStatementEntity outboundStatement = inOutStatement.getOutboundStatement();

            List<String> notAvailableSequences = notAvailableSequenceRepository
                    .findByOutboundStatementOrderByTapSequenceNumber(outboundStatement).stream()
                    .map(NotAvailableSequenceEntity::getTapSequenceNumber).toList();
            inboundStatement.getNotAvailableExcludedSequences().addAll(notAvailableSequences);

            String yearMonth = outboundStatement.getYear() + "_" + outboundStatement.getMonth();

            Boolean status = "y".equalsIgnoreCase(inOutStatement.getIsConfirmed());

            return new InboundStatementOutRecord(
                    inboundStatement.getId(),
                    outboundStatement.getId(),
                    inboundStatement.getSender().getTadigCode(),
                    yearMonth,
                    inboundStatement.getSeqFrom(),
                    inboundStatement.getSeqTo(),
                    inboundStatement.convertCriteriaToString(ExcludeIncludeType.EXCLUDE),
                    inboundStatement.convertCriteriaToString(ExcludeIncludeType.INCLUDE),
                    inboundStatement.getAmount(),
                    outboundStatement.getAmount(),
                    outboundStatement.getAmount().add(inboundStatement.getAmount() != null ?
                            inboundStatement.getAmount().negate() : BigDecimal.valueOf(0)),
                    inboundStatement.getUploadBy()
                    , status
            );
        });
    }


    public Page<InboundStatementOutRecord> searchAndCreateInbounds(TapFileType tapFileType, String streamType, Long countryId, String operator,
                                                                   String year, String month, Pageable pageable) throws SettlementExceptionEntity {
        beforeLoadData();

        Specification<InOutStatementEntity> specification =
                SettlementSpecification.getInOutStatementByFilters(tapFileType, streamType, countryId, operator, year, month);
        Page<InOutStatementEntity> inOutStatements = inOutStatementService.findAll(specification, pageable);
        if (inOutStatements.isEmpty()) {
            try {
                this.createInOutStatement(year, month);
            } catch (EntityExistsException e) {
                List<OutboundStatementEntity> outbounds = outboundStatementService.loadOutboundsWithYearAndMonth(year, month);
                outbounds.forEach(outbound -> {
                    InboundStatementEntity inboundStatement = new InboundStatementEntity();
                    inboundStatement.setSender(outbound.getSender());
                    inboundStatement.setRecipient(outbound.getRecipient());
                    inboundStatement.setSeqFrom(outbound.getSeqFrom());
                    inboundStatement.setSeqTo(outbound.getSeqTo());
                    inboundStatement.setReceivedDate(Timestamp.valueOf(LocalDateTime.now()));
                    inboundStatement.setUploadBy(Utils.getCurrentUsername());
                    addInboundStatement(outbound.getId(), inboundStatement);
                });
            }
            inOutStatements = inOutStatementService.findAll(specification, pageable);
        }
        return mapInOutStatementToRecord(inOutStatements);
    }

    public Page<InOutStatementEntity> loadInbounds(Specification<InOutStatementEntity> specification, Pageable pageable) {
        return inOutStatementService.findAll(specification, pageable);
    }

    public Page<InboundStatementOutRecord> mapInOutStatementToRecord(Page<InOutStatementEntity> inOutStatements) {
        return inOutStatements.map(this::getInboundStatementOutRecord);
    }

    private void beforeLoadData() {
        Session session = entityManager.unwrap(Session.class);
        session.enableFilter("excludeFilter").setParameter("type", ExcludeIncludeType.EXCLUDE.getValue());
        session.enableFilter("includeFilter").setParameter("type", ExcludeIncludeType.INCLUDE.getValue());
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public String uploadInboundsFile(MultipartFile file) {
        if (file.isEmpty()) {
            return "No file uploaded";
        }
        try (Reader reader = new InputStreamReader(file.getInputStream())) {
            Iterable<CSVRecord> records = CSVFormat.DEFAULT
                    .withFirstRecordAsHeader()
                    .withIgnoreHeaderCase()
                    .withTrim()
                    .parse(reader);

            for (CSVRecord csvRecord : records) {
                String senderCode = csvRecord.get("sender").trim();
                String recipientCode = csvRecord.get("recipient").trim();
                String invoiceAmountStr = csvRecord.get("amount").trim();
                BigDecimal invoiceAmount = null;
                if (!invoiceAmountStr.isEmpty() && !invoiceAmountStr.equalsIgnoreCase("nan")) {
                    invoiceAmount = new BigDecimal(invoiceAmountStr);
                }
                Timestamp now = Timestamp.valueOf(LocalDateTime.now());

                inboundStatementRepository.insertInboundFromCsv(
                        senderCode,
                        recipientCode,
                        csvRecord.get("period_from").trim(),
                        csvRecord.get("period_to").trim(),
                        invoiceAmount,
                        csvRecord.get("title").trim(),
                        csvRecord.get("seq_from").trim(),
                        csvRecord.get("seq_to").trim(),
                        now,
                        Utils.getCurrentUsername(),
                        now
                );
            }
            return "File uploaded and processed successfully";
        } catch (Exception e) {
            logger.error("Error uploading file: {}", e.getMessage(), e);
            return "Error processing file: " + e.getMessage();
        }
    }


    public InboundStatementOutRecord loadInbound(Long id) throws SettlementExceptionEntity {
        beforeLoadData();
        InOutStatementEntity inOutStatement = inOutStatementService.findInOutStatementByInboundId(id);
        InboundStatementEntity inboundStatement = inboundStatementRepository
                .findById(inOutStatement.getInboundStatement().getId()).orElse(null);
        OutboundStatementEntity outboundStatement = outboundStatementService
                .loadById(inOutStatement.getOutboundStatement().getId());
        if (inboundStatement == null || outboundStatement == null) {
            logger.error("Exception at line 337: no inbound or outbound exist for this data");
            throw new SettlementExceptionEntity("no inbound or outbound exist for this data", 411);
        }
        return getInboundStatementOutRecord(inOutStatement);
    }

    private InboundStatementOutRecord getInboundStatementOutRecord(InOutStatementEntity inOutStatement) {
        inOutStatement = inOutStatementService.findById(inOutStatement.getId());
        InboundStatementEntity inboundStatement = inOutStatement.getInboundStatement();
        OutboundStatementEntity outboundStatement = inOutStatement.getOutboundStatement();
        List<String> notAvailableSequences = notAvailableSequenceRepository
                .findByOutboundStatementOrderByTapSequenceNumber(outboundStatement).stream()
                .map(NotAvailableSequenceEntity::getTapSequenceNumber).toList();
        String yearMonth = outboundStatement.getYear() + "_" + outboundStatement.getMonth();

        Boolean status = "y".equalsIgnoreCase(inOutStatement.getIsConfirmed());
        inboundStatement.getNotAvailableExcludedSequences().addAll(notAvailableSequences);
        String excluded = inboundStatement.convertCriteriaToString(ExcludeIncludeType.EXCLUDE);
        String included = inboundStatement.convertCriteriaToString(ExcludeIncludeType.INCLUDE);
        return new InboundStatementOutRecord(
                inboundStatement.getId(),
                outboundStatement.getId(),
                inboundStatement.getSender().getTadigCode(),
                yearMonth,
                inboundStatement.getSeqFrom(),
                inboundStatement.getSeqTo(),
                excluded, included,
                inboundStatement.getAmount(),
                outboundStatement.getAmount(),
                (inboundStatement.getAmount() == null ? outboundStatement.getAmount() :
                        outboundStatement.getAmount().add(inboundStatement.getAmount().negate())),
                inboundStatement.getUploadBy()
                , status);
    }

    public void confirmStatement(Long inboundStatementId) {
        Long inOutStatementId = inOutStatementService.findInOutStatementByInboundId(inboundStatementId).getId();
        inboundStatementRepository.confirmStatement(inOutStatementId, "admin");
    }

    public List<InboundStatementEntity> getAllInboundStatements() {
        return inboundStatementRepository.findAll();
    }
}