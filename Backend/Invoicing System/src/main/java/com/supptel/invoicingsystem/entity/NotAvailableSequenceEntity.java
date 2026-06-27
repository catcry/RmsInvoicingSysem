package com.supptel.invoicingsystem.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "se_ob_stmnt_na_seq")
public class NotAvailableSequenceEntity extends BaseEntity {
    @Id
    private Long id;
    @JoinColumn(name = "ob_stmnt_id")
    @ManyToOne
    private OutboundStatementEntity outboundStatement;
    @Column(name = "tap_seq_num")
    private String tapSequenceNumber;

}
