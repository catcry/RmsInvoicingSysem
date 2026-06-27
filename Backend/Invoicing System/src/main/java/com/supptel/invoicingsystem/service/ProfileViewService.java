package com.supptel.invoicingsystem.service;

import com.supptel.invoicingsystem.entity.ProfileViewEntity;
import com.supptel.invoicingsystem.record.ProfileViewRecord;
import com.supptel.invoicingsystem.repository.ProfileViewRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

@Service
public class ProfileViewService {

    private final ProfileViewRepository profileViewRepository;

    public ProfileViewService(ProfileViewRepository profileViewRepository) {
        this.profileViewRepository = profileViewRepository;
    }

    public List<ProfileViewEntity> getAllProfiles() {
        return profileViewRepository.findAll();
    }
    public Page<ProfileViewRecord> getAllProfiles(Specification<ProfileViewEntity> specification, Pageable pageable) {
        AtomicReference<Long> id = new AtomicReference<>(1L);
        return profileViewRepository.findAll(specification, pageable).map(profileView ->
                new ProfileViewRecord(id.getAndSet(id.get() + 1), profileView.getId().getYearMonth(),
                        profileView.getId().getOperator(),
                        profileView.getCountry(),profileView.getStreamType(),
                        profileView.getStatus().equalsIgnoreCase("y"), profileView.getTap3Amount())
        );
    }
    public Page<ProfileViewRecord> getAllProfiles(Pageable pageable) {
        AtomicReference<Long> id = new AtomicReference<>(1L);
        return  profileViewRepository.findAll(pageable).map(profileView ->
             new ProfileViewRecord(id.getAndSet(id.get() + 1), profileView.getId().getYearMonth(),
                     profileView.getId().getOperator(),
                     profileView.getCountry(),profileView.getStreamType(),
                     profileView.getStatus().equalsIgnoreCase("y"), profileView.getTap3Amount())
        );
    }
}