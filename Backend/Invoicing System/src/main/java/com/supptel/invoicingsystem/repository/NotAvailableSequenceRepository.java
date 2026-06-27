package com.supptel.invoicingsystem.repository;

import com.supptel.invoicingsystem.entity.NotAvailableSequenceEntity;
import com.supptel.invoicingsystem.entity.OutboundStatementEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotAvailableSequenceRepository extends JpaRepository<NotAvailableSequenceEntity, Long>, JpaSpecificationExecutor<NotAvailableSequenceEntity> {
    List<NotAvailableSequenceEntity> findByOutboundStatementOrderByTapSequenceNumber(OutboundStatementEntity outboundStatement);
}
