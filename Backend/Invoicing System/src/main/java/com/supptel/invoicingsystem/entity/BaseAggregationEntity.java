package com.supptel.invoicingsystem.entity;

import com.supptel.invoicingsystem.converter.YesNoCharToBooleanConverter;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "se_base_agr")
public class BaseAggregationEntity extends BaseEntity {
    @Id
    private Long id;
    private String sender;
    private String recipient;
    private String streamType;
    private String fileType;
    @Column(name = "tap_seq_num")
    private String tapSequenceNumber;
    @Column(name = "rap_seq_num")
    private String rapSequenceNumber;
    @Column(name = "file_creation_ts")
    private String fileCreationTime;
    private String fileCreationUtcTo;
    @Column(name = "tot_charge")
    private BigDecimal totalCharge;
    @Column(name = "tot_tax_val")
    private BigDecimal totalTaxValue;
    @Column(name = "tot_discount_val")
    private BigDecimal totalDiscountValue;
    private Integer callEventDetailsCnt;
    private String localCurrency;
    private String tapCurrency;
    private Integer tapDecimalPlaces;
    private BigDecimal exchangeRate;
    @Column(name = "num_of_decimal_places")
    private Integer numberOfDecimalPlaces;
    @Column(name = "is_used_for_stlmnt", nullable = false)
    @Convert(converter = YesNoCharToBooleanConverter.class)
    private Boolean isUsedForSettlement;
    @Column(name = "ins_ts")
    private LocalDateTime insertTime;
    private BigDecimal amount;
    private Integer count;
    @Column(name = "last_update_ts")
    private LocalDateTime lastUpdateTime;
    @Column(name = "na_seq")
    private String  notAvailableSequence;
    @Column(name = "seq_cts_mon")
    private String sequenceCtsMonth;
    @Column(name = "seq_cts_year")
    private String sequenceCtsYear;
    @Column(name = "seq_from")
    private String sequenceFrom;
    @Column(name = "seq_to")
    private String sequenceTo;

    @ManyToMany
    @JoinTable(
            name = "se_ob_stmnt_base_agr_rel",
            joinColumns = @JoinColumn(name = "base_agr_id"),
            inverseJoinColumns = @JoinColumn(name = "ob_stmnt_id")
    )
    private List<OutboundStatementEntity> outboundStatements;
}
