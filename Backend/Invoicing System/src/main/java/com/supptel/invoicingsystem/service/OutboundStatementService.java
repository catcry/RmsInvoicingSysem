package com.supptel.invoicingsystem.service;

import com.supptel.invoicingsystem.entity.OutboundStatementEntity;
import com.supptel.invoicingsystem.entity.SettlementExceptionEntity;
import com.supptel.invoicingsystem.repository.OutboundStatementRepository;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OutboundStatementService {
    private final OutboundStatementRepository outboundStatementRepository;

    public OutboundStatementService(OutboundStatementRepository outboundStatementRepository) {
        this.outboundStatementRepository = outboundStatementRepository;
    }

    public void updateOutboundStatement(String year, String month, String fileType) {
        outboundStatementRepository.createUpdateOutboundStatements(year, month, fileType);
    }

    public List<OutboundStatementEntity> findOutboundStatements() {
        return outboundStatementRepository.findAll();
    }

    public OutboundStatementEntity loadById(Long id) {
        return outboundStatementRepository.findById(id).orElse(null);
    }

    public boolean outboundExistByYearAndMonth(String year, String month) {
        return outboundStatementRepository.existsByYearAndMonth(year, month);
    }

    public void updateOutboundCriteria(Long id, String excluded, String included) throws DataAccessException, SettlementExceptionEntity {
        try {
            outboundStatementRepository.updateOutboundCriteria(Integer.valueOf(id.toString()), excluded, included);
        } catch (Exception e) {
            throw new SettlementExceptionEntity("update outbound error: " + e, 412);
        }
    }

    public List<OutboundStatementEntity> loadOutboundsWithYearAndMonth(String year, String month) {
        return outboundStatementRepository.findAllByYearAndMonth(year, month);
    }
}
