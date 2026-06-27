package com.supptel.invoicingsystem.repository;

import com.supptel.invoicingsystem.entity.*;
import com.supptel.invoicingsystem.enumeration.TapFileType;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class SettlementSpecification {

    public static Specification<InOutStatementEntity> getInOutStatementByFilters(TapFileType tapFileType,
                                                                                 String streamType,
                                                                                 Long countryId,
                                                                                 String operator,
                                                                                 String year,
                                                                                 String month
    ) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (streamType != null && !streamType.isEmpty()) {
                predicates.add(criteriaBuilder.equal(
                        root.get("outboundStatement").get("streamType"), streamType
                ));
            }
            if (operator != null && !operator.isEmpty()) {
                Join<InOutStatementEntity, InboundStatementEntity> inboundStatementJoin = root.join("inboundStatement");
                Join<InboundStatementEntity, OperatorEntity> operatorJoin = TapFileType.TAP_IN.equals(tapFileType)
                        ? inboundStatementJoin.join("sender")
                        : inboundStatementJoin.join("recipient");
                predicates.add(criteriaBuilder.equal(
                        criteriaBuilder.upper(operatorJoin.get(OperatorEntity.TADIG_CODE)),
                        operator.toUpperCase()
                ));
            }
            if (countryId != null) {
                CountryEntity country = new CountryEntity();
                country.setId(countryId);

                Join<InOutStatementEntity, InboundStatementEntity> inboundStatementJoin = root.join("inboundStatement");
                Join<InboundStatementEntity, OperatorEntity> operatorJoin = TapFileType.TAP_IN.equals(tapFileType)
                        ? inboundStatementJoin.join("sender")
                        : inboundStatementJoin.join("recipient");
                predicates.add(criteriaBuilder.equal(
                        operatorJoin.get(OperatorEntity.COUNTRY),
                        country
                ));
            }
            if (year != null) {
                predicates.add(criteriaBuilder.equal(
                        root.get("outboundStatement").get("year"), year));
            }
            if (month != null) {
                predicates.add(criteriaBuilder.equal(
                        root.get("outboundStatement").get("month"), month));
            }

            if (predicates.isEmpty()) {
                return criteriaBuilder.conjunction(); // Returns all records if no filters are provided
            } else {
                return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
            }
        };
    }

    public static Specification<InOutStatementEntity> getAllInboundsRelatedToOutbounds(
            String year, String month) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(criteriaBuilder.equal(root.get("outboundStatement").get("year"), year));
            predicates.add(criteriaBuilder.equal(root.get("outboundStatement").get("month"), month));
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
    public static Specification<ProfileViewEntity> getProfileViewSpecification(Boolean status) {
        return ((root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(criteriaBuilder.equal(root.get("status"), Boolean.TRUE.equals(status) ? "Y" : "N"));
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        });
    }

    public static Specification<BaseAggregationEntity> getBaseAggregationSpecification(List<Long> baseAggregationIds) {
        return (root, query, criteriaBuilder) -> {
            CriteriaBuilder.In<Long> inClause = criteriaBuilder.in(root.get("id"));
            for (Long id : baseAggregationIds) {
                inClause.value(id);
            }
            return criteriaBuilder.and(inClause);
        };
    }

    public static Specification<CountryEntity> getCountrySpecificationForLoadOptions(String filterValue) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get(CountryEntity.NAME)), filterValue.toLowerCase() + "%"),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get(CountryEntity.ISO_ALPHA_2)), filterValue.toLowerCase() + "%"),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get(CountryEntity.ISO_ALPHA_3)), filterValue.toLowerCase() + "%"),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get(CountryEntity.COUNTRY_CODE)), filterValue.toLowerCase() + "%")
            ));
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    public static Specification<OperatorEntity> getOperatorSpecificationForLoadOptions(Long countryId, String filterValue) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get(OperatorEntity.TADIG_CODE)), filterValue.toLowerCase() + "%"),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get(OperatorEntity.NAME)), filterValue.toLowerCase() + "%")
            ));
            if (countryId != null) {
                CountryEntity country = new CountryEntity();
                country.setId(countryId);
                predicates.add(criteriaBuilder.equal(root.get(OperatorEntity.COUNTRY), country));
            }
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

}