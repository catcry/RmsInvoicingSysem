package com.supptel.invoicingsystem.record;

import java.math.BigDecimal;

public record ProfileViewRecord(Long id, String yearMonth, String operator, String country,
                                String streamType, Boolean status, BigDecimal tap3Amount) {
}
