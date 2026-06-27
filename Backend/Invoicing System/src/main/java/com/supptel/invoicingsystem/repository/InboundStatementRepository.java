package com.supptel.invoicingsystem.repository;

import com.supptel.invoicingsystem.entity.InboundStatementEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Repository
public interface InboundStatementRepository extends JpaRepository<InboundStatementEntity, Long>, JpaSpecificationExecutor<InboundStatementEntity> {

    @Transactional
    @Modifying
    @Query(value = "CALL add_inbound_stmnt_for_outbound_stmnt_2(CAST(:outbound_stmnt_id AS INTEGER), :period_from, :period_to, CAST(:amount AS NUMERIC), " +
            ":title, :seq_from, :seq_to, CAST(:received_date AS TIMESTAMP), :upload_by, :excluded_serial, :included_serial)",
            nativeQuery = true)
    void addInboundStatement(
            @Param("outbound_stmnt_id") Long outboundStatementId,  // Ensure name matches stored procedure
            @Param("period_from") String periodFrom,
            @Param("period_to") String periodTo,
            @Param("amount") BigDecimal amount,  // Use BigDecimal instead of Double
            @Param("title") String title,
            @Param("seq_from") String seqFrom,
            @Param("seq_to") String seqTo,
            @Param("received_date") Timestamp receivedDate,  // Ensure it's java.sql.Timestamp
            @Param("upload_by") String uploadBy,
            @Param("excluded_serial") String excluded,
            @Param("included_serial") String included);

    @Transactional
    @Modifying
    @Query(value = "CALL confirm_recon(CAST(:in_out_stmnt_id AS INTEGER), :confirmed_by)",
            nativeQuery = true)
    void confirmStatement(
            @Param("in_out_stmnt_id") Long inOutStatementId,  // Ensure name matches stored procedure
            @Param("confirmed_by") String confirmedBy);

    @Transactional
    @Modifying
    @Query(value = "CALL update_inbound_stmnt_2(CAST(:inbound_stmnt_id AS INTEGER), CAST(:outbound_stmnt_id AS INTEGER), :sender, :recipient, :period_from, :period_to, CAST(:amount AS NUMERIC), " +
            ":title, :seq_from, :seq_to, CAST(:received_date AS TIMESTAMP), :upload_by, :excluded_serial, :included_serial)",
            nativeQuery = true)
    void updateInboundStatement(
            @Param("inbound_stmnt_id") Long inboundStatementId,  // Ensure name matches stored procedure
            @Param("outbound_stmnt_id") Long outboundStatementId,  // Ensure name matches stored procedure
            @Param("sender") String sender,
            @Param("recipient") String recipient,
            @Param("period_from") String periodFrom,
            @Param("period_to") String periodTo,
            @Param("amount") BigDecimal amount,  // Use BigDecimal instead of Double
            @Param("title") String title,
            @Param("seq_from") String seqFrom,
            @Param("seq_to") String seqTo,
            @Param("received_date") Timestamp receivedDate,  // Ensure it's java.sql.Timestamp
            @Param("upload_by") String uploadBy,
            @Param("excluded_serial") String excluded,
            @Param("included_serial") String included);

    // CSV upload — id رو نمیدیم، دیتابیس GENERATED ALWAYS خودش میسازه
    @Transactional
    @Modifying
    @Query(value = "INSERT INTO se_ib_stmnt (sender, recipient, period_from, period_to, amount, title, seq_from, seq_to, received_date, upload_by, last_update_ts) " +
            "VALUES (:sender, :recipient, :period_from, :period_to, CAST(:amount AS NUMERIC), :title, :seq_from, :seq_to, CAST(:received_date AS TIMESTAMP), :upload_by, CAST(:last_update_ts AS TIMESTAMP))",
            nativeQuery = true)
    void insertInboundFromCsv(
            @Param("sender") String sender,
            @Param("recipient") String recipient,
            @Param("period_from") String periodFrom,
            @Param("period_to") String periodTo,
            @Param("amount") BigDecimal amount,
            @Param("title") String title,
            @Param("seq_from") String seqFrom,
            @Param("seq_to") String seqTo,
            @Param("received_date") Timestamp receivedDate,
            @Param("upload_by") String uploadBy,
            @Param("last_update_ts") Timestamp lastUpdateTs);

}