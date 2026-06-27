package com.supptel.invoicingsystem.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "se_country")
public class CountryEntity extends BaseEntity {

    public static final String ID = "id";
    public static final String NAME = "name";
    public static final String ISO_ALPHA_2 = "isoAlpha2";
    public static final String ISO_ALPHA_3 = "isoAlpha3";
    public static final String COUNTRY_CODE = "countryCode";
    public static final String OPERATORS = "operators";

    @Id
    private Long id;
    private String name;
    private String isoAlpha2;
    private String isoAlpha3;
    private String countryCode;

    @OneToMany(mappedBy = "country", fetch = FetchType.LAZY)
    private List<OperatorEntity> operators;

}
