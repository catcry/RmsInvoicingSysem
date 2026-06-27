package com.supptel.invoicingsystem.record;

import java.math.BigDecimal;

public record DailyBaseAggregationReportRecord(String year, String month, String day,
                                               Long fileCount, BigDecimal totalAmount) {
}
