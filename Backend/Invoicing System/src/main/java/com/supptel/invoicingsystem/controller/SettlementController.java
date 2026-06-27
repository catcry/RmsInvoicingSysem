package com.supptel.invoicingsystem.controller;

import com.supptel.invoicingsystem.entity.InOutStatementEntity;
import com.supptel.invoicingsystem.entity.InboundStatementEntity;
import com.supptel.invoicingsystem.entity.SettlementExceptionEntity;
import com.supptel.invoicingsystem.enumeration.StreamType;
import com.supptel.invoicingsystem.enumeration.TapFileType;
import com.supptel.invoicingsystem.record.*;
import com.supptel.invoicingsystem.repository.SettlementSpecification;
import com.supptel.invoicingsystem.service.InboundStatementService;
import com.supptel.invoicingsystem.service.OutboundStatementService;
import jakarta.persistence.EntityExistsException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping(value = "/api/settlements")
public class SettlementController {

    private final InboundStatementService inboundStatementService;

    public SettlementController(InboundStatementService inboundStatementService) {
        this.inboundStatementService = inboundStatementService;
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @PostMapping("/search")
    public SettlementPageOutRecord getSettlements(
            @RequestParam int page,
            @RequestParam int size,
            @RequestParam(required = false) TapFileType tapFileType,
            @RequestParam(required = false) StreamType streamType,
            @RequestParam(required = false) Long countryId,
            @RequestParam(required = false) String operator,
            @RequestParam(required = false) String year,
            @RequestParam(required = false) String month
    ) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<InboundStatementOutRecord> responsePage = inboundStatementService.searchAndCreateInbounds(
                    tapFileType, streamType != null ? streamType.name() : null, countryId, operator, year, month, pageable);
            return new SettlementPageOutRecord(responsePage, null, HttpStatus.OK);
        } catch (SettlementExceptionEntity e) {
            return new SettlementPageOutRecord(null, new ExceptionRecord(e.getMessage(), e.getStatus()), HttpStatus.CONFLICT);
        }
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @PostMapping("/create")
    public ResponseEntity<SettlementPageOutRecord> createAndGetInboundStatements(
            @RequestParam int page,
            @RequestParam int size,
            @RequestParam(required = false) TapFileType tapFileType,
            @RequestParam(required = false) StreamType streamType,
            @RequestParam(required = false) Long countryId,
            @RequestParam(required = false) String operator,
            @RequestParam String year,
            @RequestParam String month
    ) {
        try {
            inboundStatementService.createInOutStatement(year, month);
        } catch (SettlementExceptionEntity e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
        Specification<InOutStatementEntity> spec =
                SettlementSpecification.getInOutStatementByFilters(tapFileType, streamType != null ? streamType.name() : null, countryId, operator, year, month);
        Pageable pageable = PageRequest.of(page, size);
        Page<InboundStatementOutRecord> result = inboundStatementService.getInboundRecords(spec, pageable);
        return ResponseEntity.ok(new SettlementPageOutRecord(result, null, HttpStatus.OK));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @PostMapping("/recreate")
    public SettlementPageOutRecord recreateAndGetInboundStatements(
            @RequestParam int page,
            @RequestParam int size,
            @RequestParam(required = false) TapFileType tapFileType,
            @RequestParam(required = false) StreamType streamType,
            @RequestParam(required = false) Long countryId,
            @RequestParam(required = false) String operator,
            @RequestParam String year,
            @RequestParam String month
    ) {
        try {
            inboundStatementService.updateInOutStatement(year, month);
        } catch (SettlementExceptionEntity e) {
            return new SettlementPageOutRecord(null, new ExceptionRecord(e.getMessage(), e.getStatus()), HttpStatus.CONFLICT);
        }
        Pageable pageable = PageRequest.of(page, size);
        Specification<InOutStatementEntity> spec =
                SettlementSpecification.getInOutStatementByFilters(tapFileType, streamType != null ? streamType.name() : null, countryId, operator, year, month);

        Page<InboundStatementOutRecord> responsePage = inboundStatementService.getInboundRecords(spec, pageable);
        return new SettlementPageOutRecord(responsePage, null, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @PutMapping("/update-inbound")
    public SettlementPageOutRecord updateInbounds(
            @RequestBody InboundStatementInRecord inboundInRecord) {
        try {
            inboundStatementService.updateInboundStatementByRecord(inboundInRecord);
            return new SettlementPageOutRecord(null, null, HttpStatus.OK);
        } catch (SettlementExceptionEntity e) {
            return new SettlementPageOutRecord(null, new ExceptionRecord(e.getMessage(), e.getStatus()), HttpStatus.NOT_ACCEPTABLE);
        }
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @PutMapping("/confirm-statement")
    public ResponseEntity<HttpStatus> confirmStatement(@RequestBody Long inboundId) {
        inboundStatementService.confirmStatement(inboundId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping("/load/{id}")
    public ResponseEntity<SettlementSingleEntityOutRecord> loadInbound(
            @PathVariable Long id) {
        try {
            InboundStatementOutRecord inboundOutRecord = inboundStatementService.loadInbound(id);
            return new ResponseEntity<>(new SettlementSingleEntityOutRecord(inboundOutRecord, null), HttpStatus.OK);
        } catch (SettlementExceptionEntity e) {
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(new SettlementSingleEntityOutRecord(
                    null, new ExceptionRecord(e.getMessage(), e.getStatus())));
        }
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping
    public SettlementCollectionOutRecord loaSettlements() {
        List<InboundStatementEntity> settlementEntities = inboundStatementService.getAllInboundStatements();
        return new SettlementCollectionOutRecord(new HashSet<>(settlementEntities), null);
    }
}