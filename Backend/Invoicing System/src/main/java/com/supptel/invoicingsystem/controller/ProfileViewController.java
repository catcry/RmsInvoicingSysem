package com.supptel.invoicingsystem.controller;

import com.supptel.invoicingsystem.entity.ProfileViewEntity;
import com.supptel.invoicingsystem.record.ProfileViewRecord;
import com.supptel.invoicingsystem.record.SettlementPageOutRecord;
import com.supptel.invoicingsystem.repository.SettlementSpecification;
import com.supptel.invoicingsystem.service.ProfileViewService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/profile-view")
public class ProfileViewController {

    private final ProfileViewService profileViewService;

    public ProfileViewController(ProfileViewService profileViewService) {
        this.profileViewService = profileViewService;
    }

    @GetMapping
    public SettlementPageOutRecord getAllProfiles(Pageable pageable, Boolean status) {
        Specification<ProfileViewEntity> specification = SettlementSpecification.getProfileViewSpecification(status);
        Page<ProfileViewRecord> profileViewRecords = profileViewService.getAllProfiles(specification, pageable);
        return new SettlementPageOutRecord(profileViewRecords, null, HttpStatus.OK);
    }

}
