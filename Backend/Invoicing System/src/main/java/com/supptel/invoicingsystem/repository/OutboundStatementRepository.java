package com.supptel.invoicingsystem.repository;

import com.supptel.invoicingsystem.entity.OutboundStatementEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OutboundStatementRepository extends JpaRepository<OutboundStatementEntity, Long>, JpaSpecificationExecutor<OutboundStatementEntity> {

    @Procedure(procedureName = "create_update_outbound_statements_year_mon")
    void createUpdateOutboundStatements(
            @Param("i_seq_cts_year") String year,
            @Param("i_seq_cts_mon") String month,
            @Param("i_file_type") String fileType
    );

    @Procedure(name = "update_criteria_of_outbound_stmnt", value = "update_criteria_of_outbound_stmnt")
    void updateOutboundCriteria(Integer outboundId, String excluded, String included);

    boolean existsByYearAndMonth(String year, String month);

    List<OutboundStatementEntity> findAllByYearAndMonth(String year, String month);
}
