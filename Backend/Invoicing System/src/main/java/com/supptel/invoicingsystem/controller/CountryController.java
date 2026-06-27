package com.supptel.invoicingsystem.controller;

import com.supptel.invoicingsystem.entity.CountryEntity;
import com.supptel.invoicingsystem.service.CountryService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/api/country")
public class CountryController {

    private final CountryService countryService;

    public CountryController(CountryService countryService) {
        this.countryService = countryService;
    }

    @GetMapping("/load-options")
    public List<CountryEntity> loadOptions(@RequestParam(required = false)  String filter) {
        return countryService.loadOptions(filter!=null? filter.trim(): null);
    }
}
