package com.supptel.invoicingsystem.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Immutable;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Immutable
@Table(name = "se_international_outbounds_summary_view")
public class InternationalOutboundsSummaryEntity {

    @Id
    @Column(name = "year_month", nullable = false)
    private String yearMonth;

    @Column(name = "closed_invoices")
    private Integer closedInvoices;

    @Column(name = "closed_tap3amounts")
    private BigDecimal closedTap3Amounts;

    @Column(name = "closed_diff_amounts")
    private BigDecimal closedDiffAmounts;

    @Column(name = "pending_invoices")
    private Integer pendingInvoices;

    @Column(name = "pending_tap3amounts")
    private BigDecimal pendingTap3Amounts;

    @Column(name = "pending_diff_amounts")
    private BigDecimal pendingDiffAmounts;
}
