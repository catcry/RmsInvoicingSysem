package com.supptel.invoicingsystem.record;

import java.math.BigDecimal;

public record InboundStatementOutRecord(Long id, Long outboundId, String tadig, String registerDate, String fromSerial,
                                        String toSerial,
                                        String excludeSerials, String includeSerials, BigDecimal invoiceSdr,
                                        BigDecimal tapAmount,
                                        BigDecimal diffAmount, String lastUpdateBy, Boolean status) {
}
