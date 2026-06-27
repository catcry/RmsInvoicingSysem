package com.supptel.invoicingsystem.controller;

import com.supptel.invoicingsystem.entity.OperatorEntity;
import com.supptel.invoicingsystem.service.OperatorService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/api/operator")
public class OperatorController {

    private final OperatorService operatorService;

    public OperatorController(OperatorService operatorService) {
        this.operatorService = operatorService;
    }

    @GetMapping("/load-options")
    public List<OperatorEntity> loadOptions(@RequestParam(required = false) Long countryId, @RequestParam(required = false) String filter) {
        return operatorService.loadOptions(countryId, filter != null ? filter.trim() : "");
    }
}
