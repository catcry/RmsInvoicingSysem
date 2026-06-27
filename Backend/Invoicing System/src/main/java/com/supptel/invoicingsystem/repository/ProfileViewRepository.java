package com.supptel.invoicingsystem.repository;

import com.supptel.invoicingsystem.entity.ProfileViewEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfileViewRepository extends JpaRepository<ProfileViewEntity, String>, JpaSpecificationExecutor<ProfileViewEntity> {


    @Override
    Page<ProfileViewEntity> findAll(Specification<ProfileViewEntity> spec, Pageable pageable);
}
