package com.supptel.invoicingsystem.service;

import com.supptel.invoicingsystem.entity.CountryEntity;
import com.supptel.invoicingsystem.repository.CountryRepository;
import com.supptel.invoicingsystem.repository.SettlementSpecification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CountryService {
    private final CountryRepository countryRepository;

    public CountryService(CountryRepository countryRepository) {
        this.countryRepository = countryRepository;
    }

    public List<CountryEntity> loadOptions(String filterValue) {
        return filterValue!=null?
                countryRepository.findAll(SettlementSpecification.getCountrySpecificationForLoadOptions(filterValue))
                : countryRepository.findAll();
    }

}
