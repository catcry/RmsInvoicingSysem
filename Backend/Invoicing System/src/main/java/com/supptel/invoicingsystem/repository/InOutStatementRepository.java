package com.supptel.invoicingsystem.repository;

import com.supptel.invoicingsystem.entity.InOutStatementEntity;
import com.supptel.invoicingsystem.entity.OutboundStatementEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface InOutStatementRepository  extends JpaRepository<InOutStatementEntity, Long>, JpaSpecificationExecutor<InOutStatementEntity> {
    boolean existsByOutboundStatement(OutboundStatementEntity outboundStatement);

    InOutStatementEntity findInOutStatementEntityByInboundStatement_Id(Long id);
//    List<InboundStatementEntity>

}
