package com.supptel.invoicingsystem.record;

import java.math.BigDecimal;

public record InboundStatementInRecord(Long id, String fromSerial, String toSerial, String excludeSerials,
                                       String includeSerials, BigDecimal invoiceSdr, Boolean status) {
}
