package com.supptel.invoicingsystem.entity;

import com.supptel.invoicingsystem.converter.ExcludeIncludeTypeConverter;
import com.supptel.invoicingsystem.enumeration.ExcludeIncludeType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "se_ob_stmnt_criteria")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OutboundStatementCriteriaEntity extends BaseEntity {

    @Id
    private Long id;
    @Column(name = "tap_seq_num")
    private String tapSeqNumber;


    @Convert(converter = ExcludeIncludeTypeConverter.class)
    @Column(name = "exc_inc_type", length = 1, nullable = false)
    private ExcludeIncludeType type;

    @JoinColumn(name = "ib_stmnt_id")
    @ManyToOne(fetch = FetchType.LAZY)
    private OutboundStatementEntity outboundStatement;

}