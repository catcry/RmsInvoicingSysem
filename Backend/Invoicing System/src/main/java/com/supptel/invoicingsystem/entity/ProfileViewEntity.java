package com.supptel.invoicingsystem.entity;

import jakarta.persistence.*;
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
@Table(name = "se_profile_view")
public class ProfileViewEntity extends BaseEntity {

    @EmbeddedId
    private ProfileViewId id;
    private String country;
    private String streamType;
    private String status;
    @Column(name = "tap3_amount")
    private BigDecimal tap3Amount;
}
