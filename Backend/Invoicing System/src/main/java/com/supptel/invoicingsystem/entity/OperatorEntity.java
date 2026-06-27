package com.supptel.invoicingsystem.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "se_operator")
public class OperatorEntity extends BaseEntity {

    public static final String TADIG_CODE = "tadigCode";
    public static final String NAME = "name";
    public static final String CALL_RECEIVED_ABOARD = "callReceivedAboard";
    public static final String CALL_MADE_ABOARD = "callMadeAboard";
    public static final String SMS_RECEIVED_ABOARD = "smsReceivedAboard";
    public static final String SMS_MADE_ABOARD = "smsMadeAboard";
    public static final String COUNTRY = "country";

    @Id
    private String tadigCode;
    private String name;
    private BigDecimal callReceivedAboard;
    private BigDecimal callMadeAboard;
    private BigDecimal smsReceivedAboard;
    private BigDecimal smsMadeAboard;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "country_id")
    @JsonIgnore
    private CountryEntity country;

    @JsonIgnore
    @OneToMany(mappedBy = "sender", fetch = FetchType.LAZY)
    private List<InboundStatementEntity> senderInbound;
    @JsonIgnore
    @OneToMany(mappedBy = "recipient", fetch = FetchType.LAZY)
    private List<InboundStatementEntity> recipientInbound;
    @JsonIgnore
    @OneToMany(mappedBy = "sender", fetch = FetchType.LAZY)
    private List<OutboundStatementEntity> senderOutbound;
    @JsonIgnore
    @OneToMany(mappedBy = "recipient", fetch = FetchType.LAZY)
    private List<OutboundStatementEntity> recipientOutbound;
}
