package com.supptel.invoicingsystem.record;

import java.math.BigDecimal;

public record BaseAggregationOutRecord(Long id, String tapSequenceNumber, String fileCreationTime,
                                       String fileCreationUtcTo, BigDecimal totalCharge,
                                       BigDecimal totalTaxValue, BigDecimal totalDiscountValue,
                                       Integer callEventDetailsCnt, String localCurrency,
                                       String tapCurrency, BigDecimal exchangeRate) {
}
