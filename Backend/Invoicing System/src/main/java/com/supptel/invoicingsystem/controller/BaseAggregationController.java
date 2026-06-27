package com.supptel.invoicingsystem.controller;

import com.supptel.invoicingsystem.entity.SettlementExceptionEntity;
import com.supptel.invoicingsystem.enumeration.TapFileType;
import com.supptel.invoicingsystem.record.*;
import com.supptel.invoicingsystem.service.BaseAggregationService;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/api/base-aggregation")
public class BaseAggregationController {

    private final BaseAggregationService baseAggregationService;

    public BaseAggregationController(BaseAggregationService baseAggregationService) {
        this.baseAggregationService = baseAggregationService;
    }

    @GetMapping("/outbound-aggregations")
    public ResponseEntity<SettlementSingleEntityOutRecord> loadOutboundAggregations(
            Pageable pageable,
            @RequestParam(required = false) Long outboundId,
            @RequestParam(required = false) TapFileType tapFileType,
            @RequestParam(required = false) String year,
            @RequestParam(required = false) String month,
            @RequestParam(required = false) String operator) {

        try {
            OutboundAggregationOutRecord outboundAggregation;
            if (outboundId != null) {
                outboundAggregation = baseAggregationService.loadOutboundAggregationsByOutboundId(outboundId, pageable);
                return ResponseEntity.ok(new SettlementSingleEntityOutRecord(outboundAggregation, null));
            }
            if (tapFileType != null && year != null && month != null && operator != null) {
                outboundAggregation = baseAggregationService.loadOutboundAggregationsByOutboundFilter(tapFileType,
                        operator, year, month, pageable);
                return ResponseEntity.ok(new SettlementSingleEntityOutRecord(outboundAggregation, null));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new SettlementSingleEntityOutRecord(null,
                    new ExceptionRecord("invalid input data", 400)));
        } catch (SettlementExceptionEntity e ) {
            return ResponseEntity.badRequest().body(new SettlementSingleEntityOutRecord(null,
                    new ExceptionRecord(e.getMessage(), e.getStatus())));
        }
    }

    @GetMapping("/daily-report")
    public ResponseEntity<SettlementCollectionOutRecord> loadDailyReport(
            @RequestParam(required = false) String year,
            @RequestParam(required = false) String month) {
        List<DailyBaseAggregationReportRecord> dailyReportRecords = baseAggregationService.loadDailyAggregationReport(year, month);
        return ResponseEntity.ok(new SettlementCollectionOutRecord(dailyReportRecords, null));
    }
}
