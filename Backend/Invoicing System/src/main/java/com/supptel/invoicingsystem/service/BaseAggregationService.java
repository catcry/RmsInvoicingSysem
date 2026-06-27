package com.supptel.invoicingsystem.service;

import com.supptel.invoicingsystem.entity.BaseAggregationEntity;
import com.supptel.invoicingsystem.entity.InOutStatementEntity;
import com.supptel.invoicingsystem.entity.OutboundStatementEntity;
import com.supptel.invoicingsystem.entity.SettlementExceptionEntity;
import com.supptel.invoicingsystem.enumeration.TapFileType;
import com.supptel.invoicingsystem.record.BaseAggregationOutRecord;
import com.supptel.invoicingsystem.record.DailyBaseAggregationReportRecord;
import com.supptel.invoicingsystem.record.OutboundAggregationOutRecord;
import com.supptel.invoicingsystem.record.OutboundOutRecord;
import com.supptel.invoicingsystem.repository.BaseAggregationRepository;
import com.supptel.invoicingsystem.repository.SettlementSpecification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BaseAggregationService {
    private static final Logger logger = LoggerFactory.getLogger(BaseAggregationService.class);

    private final BaseAggregationRepository baseAggregationRepository;
    private final OutboundStatementService outboundStatementService;
    private final InOutStatementService inOutStatementService;

    public BaseAggregationService(BaseAggregationRepository baseAggregationRepository, OutboundStatementService outboundStatementService, InOutStatementService inOutStatementService) {
        this.baseAggregationRepository = baseAggregationRepository;
        this.outboundStatementService = outboundStatementService;
        this.inOutStatementService = inOutStatementService;
    }

    public Page<BaseAggregationOutRecord> findAll(Specification<BaseAggregationEntity> specification, Pageable pageable) {
        try {
            return baseAggregationRepository.findAll(specification, pageable).map(baseAggregation ->
                    new BaseAggregationOutRecord(baseAggregation.getId(), baseAggregation.getTapSequenceNumber(),
                            baseAggregation.getFileCreationTime(), baseAggregation.getFileCreationUtcTo(),
                            baseAggregation.getTotalCharge(), baseAggregation.getTotalTaxValue(),
                            baseAggregation.getTotalDiscountValue(), baseAggregation.getCallEventDetailsCnt(),
                            baseAggregation.getLocalCurrency(), baseAggregation.getTapCurrency(), baseAggregation.getExchangeRate())
            );
        } catch (Exception e) {
            logger.error("Exception at line 48: {}", e.getMessage());
            throw new SettlementExceptionEntity(e.getMessage(), 400);
        }
    }

    public OutboundAggregationOutRecord loadOutboundAggregationsByOutboundFilter(TapFileType tapFileType, String operator,
                                                                                 String year, String month, Pageable pageable) throws SettlementExceptionEntity {
        Specification<InOutStatementEntity> specification = SettlementSpecification.getInOutStatementByFilters(
                tapFileType, null, null, operator, year, month);
        List<InOutStatementEntity> inOutStatements = inOutStatementService.findAll(specification);
        if (inOutStatements.isEmpty()) {
            logger.error("Exception at line 59: {}", "outbound with this values does not exist");
            throw new SettlementExceptionEntity("outbound with this values does not exist", 404);
        }
        OutboundStatementEntity outboundStatement = inOutStatements.getFirst().getOutboundStatement();
        return loadOutboundAggregationsByOutbound(outboundStatement, pageable);
    }

    public OutboundAggregationOutRecord loadOutboundAggregationsByOutboundId(Long outboundId, Pageable pageable) {
        OutboundStatementEntity outboundStatement = outboundStatementService.loadById(outboundId);
        return loadOutboundAggregationsByOutbound(outboundStatement, pageable);
    }

    public OutboundAggregationOutRecord loadOutboundAggregationsByOutbound(OutboundStatementEntity outboundStatement, Pageable pageable) {
        OutboundOutRecord outboundOutRecord = new OutboundOutRecord(outboundStatement.getId(),
                outboundStatement.getStreamType().equals("IO") ? outboundStatement.getSender().getTadigCode() :
                        outboundStatement.getRecipient().getTadigCode(),
                outboundStatement.getSeqFrom(), outboundStatement.getSeqTo(), outboundStatement.getStreamType(),
                outboundStatement.getYear(), outboundStatement.getMonth(), outboundStatement.getAmount(),
                outboundStatement.getFileCount());
        Specification<BaseAggregationEntity> specification = SettlementSpecification.getBaseAggregationSpecification(
                outboundStatement.getBaseAggregations().stream().map(BaseAggregationEntity::getId).toList());
        Page<BaseAggregationOutRecord> baseAggregationRecords = findAll(specification, pageable);
        return new OutboundAggregationOutRecord(outboundOutRecord, baseAggregationRecords);
    }

    public List<DailyBaseAggregationReportRecord> loadDailyAggregationReport(String year, String month) {
        return baseAggregationRepository.findDailyAggregation(year, month).stream().map(dailyBaseAggregationReportDTO ->
                        new DailyBaseAggregationReportRecord(dailyBaseAggregationReportDTO.getYear(),
                                dailyBaseAggregationReportDTO.getMonth(), dailyBaseAggregationReportDTO.getDay(),
                                dailyBaseAggregationReportDTO.getFileCount(), dailyBaseAggregationReportDTO.getTotalAmount()))
                .toList();
    }
}
