package com.supptel.invoicingsystem.service;

import com.supptel.invoicingsystem.entity.InOutStatementEntity;
import com.supptel.invoicingsystem.entity.InboundStatementEntity;
import com.supptel.invoicingsystem.entity.OutboundStatementEntity;
import com.supptel.invoicingsystem.repository.InOutStatementRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InOutStatementService {
    private final InOutStatementRepository inOutStatementRepository;

    public InOutStatementService(InOutStatementRepository inOutStatementRepository) {
        this.inOutStatementRepository = inOutStatementRepository;
    }

    public InOutStatementEntity findInOutStatementByInbound(InboundStatementEntity inboundStatement) {
        return inOutStatementRepository.findInOutStatementEntityByInboundStatement_Id(inboundStatement.getId());
    }

    public InOutStatementEntity findInOutStatementByInboundId(Long inboundId) {
        return inOutStatementRepository.findInOutStatementEntityByInboundStatement_Id(inboundId);
    }

    public List<InOutStatementEntity> findAll(Specification<InOutStatementEntity> specification) {
        return inOutStatementRepository.findAll(specification);
    }

    public InOutStatementEntity findById(Long inOutStatementId) {
        return inOutStatementRepository.findById(inOutStatementId).orElse(null);
    }

    public Page<InOutStatementEntity> findAll(Specification<InOutStatementEntity> specification, Pageable pageable) {
        return inOutStatementRepository.findAll(specification, pageable);
    }

    public boolean existsByOutboundStatement(OutboundStatementEntity outboundStatement) {
        return inOutStatementRepository.existsByOutboundStatement(outboundStatement);
    }
}
