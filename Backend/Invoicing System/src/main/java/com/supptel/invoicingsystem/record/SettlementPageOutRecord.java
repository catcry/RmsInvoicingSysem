package com.supptel.invoicingsystem.record;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;

public record SettlementPageOutRecord(Page<?> responseBody, ExceptionRecord exception, HttpStatus status) {
}
