package com.supptel.invoicingsystem.record;

import java.math.BigDecimal;

public interface DailyBaseAggregationReportDTO {
    String getYear();
    String getMonth();
    String getDay();
    Long getFileCount();
    BigDecimal getTotalAmount();
}