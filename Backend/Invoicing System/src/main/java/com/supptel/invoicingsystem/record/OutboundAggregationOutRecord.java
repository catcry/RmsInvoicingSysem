package com.supptel.invoicingsystem.record;

import org.springframework.data.domain.Page;

public record OutboundAggregationOutRecord(OutboundOutRecord outbound,
                                           Page<BaseAggregationOutRecord> baseAggregations) {
}
