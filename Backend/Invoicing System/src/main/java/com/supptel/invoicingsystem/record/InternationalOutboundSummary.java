package com.supptel.invoicingsystem.record;

import java.math.BigDecimal;

public record InternationalOutboundSummary(String year, String month,
                                           Integer closedInvoicesCount,
                                           BigDecimal closedTap3Amounts,
                                           BigDecimal closedDifferencesAmounts,
                                           Integer pendingInvoicesCount,
                                           BigDecimal pendingTap3Amounts,
                                           BigDecimal pendingDifferencesAmounts) {
}
