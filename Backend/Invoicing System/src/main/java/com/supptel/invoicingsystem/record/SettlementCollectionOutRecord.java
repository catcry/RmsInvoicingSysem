package com.supptel.invoicingsystem.record;

import java.util.Collection;

public record SettlementCollectionOutRecord(Collection<?> responseBody,ExceptionRecord exception) {
}
