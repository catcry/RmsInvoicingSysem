package com.supptel.invoicingsystem.repository;

import com.supptel.invoicingsystem.entity.InternationalOutboundsSummaryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InternationalOutboundsSummaryRepository extends JpaRepository<InternationalOutboundsSummaryEntity, String> {
    // Additional query methods if needed
}