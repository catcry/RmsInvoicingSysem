package com.supptel.invoicingsystem.service;

import com.supptel.invoicingsystem.entity.OperatorEntity;
import com.supptel.invoicingsystem.repository.OperatorRepository;
import com.supptel.invoicingsystem.repository.SettlementSpecification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OperatorService {
    private final OperatorRepository operatorRepository;

    public OperatorService(OperatorRepository operatorRepository) {
        this.operatorRepository = operatorRepository;
    }
    public List<OperatorEntity> loadOptions(Long countryId, String filterValue) {
        return operatorRepository.findAll(SettlementSpecification.getOperatorSpecificationForLoadOptions(countryId, filterValue));
    }
}
