package com.supptel.invoicingsystem.record;

import com.supptel.invoicingsystem.entity.SettlementExceptionEntity;

import java.math.BigDecimal;

public record OutboundOutRecord(Long id, String operator, String sequenceFrom, String sequenceTo, String streamType,
                                String year, String month, BigDecimal tap3Amount, Integer fileCount){}
