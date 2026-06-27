package com.supptel.invoicingsystem.service;

import com.supptel.invoicingsystem.entity.InternationalOutboundsSummaryEntity;
import com.supptel.invoicingsystem.repository.InternationalOutboundsSummaryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InternationalOutboundsSummaryService {
    private final InternationalOutboundsSummaryRepository repository;

    public InternationalOutboundsSummaryService(InternationalOutboundsSummaryRepository repository) {
        this.repository = repository;
    }

    public List<InternationalOutboundsSummaryEntity> getAllSummaries() {
        return repository.findAll();
    }
    public InternationalOutboundsSummaryEntity getSummaryById(String yearMonth) {
        return repository.findById(yearMonth).orElse(null);
    }
}
