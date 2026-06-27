package com.supptel.invoicingsystem.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@Getter
@Setter
@ResponseStatus(HttpStatus.NOT_ACCEPTABLE)
public class SettlementExceptionEntity extends RuntimeException {

    private final int status;

    public SettlementExceptionEntity(String message, Integer status) {
        super(message);
        this.status = status;
    }
}
