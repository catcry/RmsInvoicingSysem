package com.supptel.invoicingsystem.config;

import com.supptel.invoicingsystem.entity.SettlementExceptionEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(SettlementExceptionEntity.class)
    public ResponseEntity<?> handleSettlementException(SettlementExceptionEntity ex) {
        return ResponseEntity.status(ex.getStatus())
                .body(Map.of(
                        "error", ex.getMessage(),
                        "code", ex.getStatus()
                ));
    }
}