package com.supptel.invoicingsystem.controller;

import com.supptel.invoicingsystem.entity.InternationalOutboundsSummaryEntity;
import com.supptel.invoicingsystem.record.SettlementSingleEntityOutRecord;
import com.supptel.invoicingsystem.service.InternationalOutboundsSummaryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/summary")
public class InternationalOutboundsSummaryController {

    private final InternationalOutboundsSummaryService service;

    public InternationalOutboundsSummaryController(InternationalOutboundsSummaryService service) {
        this.service = service;
    }

    @GetMapping
    public List<InternationalOutboundsSummaryEntity> getStatementSummary() {
        return service.getAllSummaries();
    }
    @GetMapping("/{yearMonth}")
    public ResponseEntity<SettlementSingleEntityOutRecord> getStatementSummary(@PathVariable String yearMonth) {
        return ResponseEntity.ok(new SettlementSingleEntityOutRecord(service.getSummaryById(yearMonth), null));
    }
}
