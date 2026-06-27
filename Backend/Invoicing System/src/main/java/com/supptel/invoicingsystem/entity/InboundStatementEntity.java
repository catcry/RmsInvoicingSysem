package com.supptel.invoicingsystem.entity;


import com.supptel.invoicingsystem.enumeration.ExcludeIncludeType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.*;

@Entity
@Table(name = "se_ib_stmnt")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FilterDef(name = "excludeFilter", parameters = @ParamDef(name = "type", type = String.class))
@FilterDef(name = "includeFilter", parameters = @ParamDef(name = "type", type = String.class))
public class InboundStatementEntity extends BaseEntity {
    @OneToMany(mappedBy = "inboundStatement", fetch = FetchType.LAZY)
    @Filter(name = "excludeFilter", condition = "exc_inc_type = :type")
    @OrderBy("tapSeqNumber ASC")
    private List<InboundStatementCriteriaEntity> excludedCriteria;

    @OneToMany(mappedBy = "inboundStatement", fetch = FetchType.LAZY)
    @Filter(name = "includeFilter", condition = "exc_inc_type = :type")
    @OrderBy("tapSeqNumber ASC")
    private List<InboundStatementCriteriaEntity> includedCriteria;
    @Id
    private Long id;
    @ManyToOne
    @JoinColumn(name = "sender", referencedColumnName = "tadigCode")
    private OperatorEntity sender;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient", referencedColumnName = "tadigCode")
    private OperatorEntity recipient;
    private String periodFrom;
    private String periodTo;
    private BigDecimal amount;
    private String title;
    private String seqFrom;
    private String seqTo;
    private Timestamp receivedDate;
    private String uploadBy;
    private Timestamp registerDate;
    private Timestamp lastUpdateTs;
    @OneToMany
    private List<InOutStatementEntity> inOutStatement;
    @Transient
    private String excluded;
    @Transient
    private String included;
    @Transient
    private List<String> notAvailableExcludedSequences = new ArrayList<>();
    @Transient
    private List<String> notAvailableIncludedSequences = new ArrayList<>();

    public InboundStatementEntity(Long id) {
        this.id = id;
    }

    @Transient
    private static void calculateModifiedCriteria(String criteriaSerialRange, StringBuilder modifiedCriteriaString) throws SettlementExceptionEntity {
        if (criteriaSerialRange.contains("-")) {
            String[] rangeNumbers = criteriaSerialRange.split("-");
            if (rangeNumbers.length > 0) {
                if (rangeNumbers.length > 2) {
                    throw new SettlementExceptionEntity("wrong string", 410);
                }
                int startNumber = Integer.parseInt(rangeNumbers[0]);
                int endNumber = Integer.parseInt(rangeNumbers[1]);
                for (int i = startNumber; i <= endNumber; i++) {
                    String serialStr = formatRange(i, i);
                    modifiedCriteriaString.append(serialStr).append(",");
                }
            }
        } else {
            modifiedCriteriaString.append(criteriaSerialRange).append(",");
        }
    }

    private static String formatRange(int start, int end) {
        if (start == end) {
            return String.format("%05d", start);
        } else {
            return String.format("%05d-%05d", start, end);
        }
    }

    @Transient
    public void prepareCriteriaToSave() throws SettlementExceptionEntity {
        if (excluded != null) this.setExcluded(reformatCriteriaStringToSave(excluded));
        if (included != null) this.setIncluded(reformatCriteriaStringToSave(included));
    }

    @Transient
    public String reformatCriteriaStringToSave(String criteria) throws SettlementExceptionEntity {
        if (criteria == null) {
            return null;
        }
        if (!criteria.contains(",") && !criteria.contains("-")) {
            return criteria;
        } else {
            StringBuilder modifiedCriteriaString = new StringBuilder();
            String[] splitByCommaList = criteria.replace(" ", "").split(",");
            for (String criteriaSerialRange : splitByCommaList) {
                calculateModifiedCriteria(criteriaSerialRange, modifiedCriteriaString);
            }

            return modifiedCriteriaString.length() > 1 ? modifiedCriteriaString.substring(0, modifiedCriteriaString.length() - 1) : null;
        }
    }

    @Transient
    public String getExcludedListAsString() {
        if (this.excludedCriteria == null) {
            return null;
        }
        StringBuilder calculatingExcluded = new StringBuilder();
        excludedCriteria.forEach(criteria -> calculatingExcluded.append(criteria.getTapSeqNumber()).append(","));
        return calculatingExcluded.length() > 1 ? calculatingExcluded.substring(0, calculatingExcluded.length() - 1) : null;
    }

    @Transient
    public String getIncludedListAsString() {
        if (includedCriteria == null) {
            return null;
        }
        StringBuilder calculatingIncluded = new StringBuilder();
        includedCriteria.forEach(criteria -> calculatingIncluded.append(criteria.getTapSeqNumber()).append(","));
        return calculatingIncluded.length() > 1 ? calculatingIncluded.substring(0, calculatingIncluded.length() - 1) : null;
    }

    @Transient
    public String[] getAllCriteria(ExcludeIncludeType type) {
        String[] emptyArray = {};
        if (ExcludeIncludeType.EXCLUDE.equals(type)) {
            Set<String> excludedList = new HashSet<>();
            excludedList.addAll(notAvailableExcludedSequences);
            excludedList.addAll(getExcludedCriteria().stream().map(InboundStatementCriteriaEntity::getTapSeqNumber).toList());
            return excludedList.toArray(new String[0]);
        } else {
            if (this.getIncludedCriteria() == null || this.getIncludedCriteria().isEmpty()) return emptyArray;
            return this.getIncludedCriteria().stream().map(InboundStatementCriteriaEntity::getTapSeqNumber).toArray(String[]::new);
        }
    }

    @Transient
    public String convertCriteriaToString(ExcludeIncludeType type) {
        String[] allCriteria = getAllCriteria(type);
        Arrays.sort(allCriteria);
        return compressSequences(allCriteria);
    }

    @Transient
    public void checkNotAvailableSequences() {
        if (!notAvailableExcludedSequences.isEmpty() && excluded != null && !excluded.isEmpty()) {
            Arrays.stream(excluded.split(",")).toList().forEach(excludeNumber -> {
                if (notAvailableExcludedSequences.contains(excludeNumber)) {
                    excluded = excluded.trim().replace(excludeNumber, "").trim().replace(",,", ",");
                }
            });
            excluded = excluded.trim();
            if (!excluded.isEmpty() && excluded.charAt(0) == ',') {
                excluded = excluded.substring(1);
            }
            excluded = excluded.trim();
            if (!excluded.isEmpty() && excluded.charAt(excluded.length() - 1) == ',') {
                excluded = excluded.substring(0, excluded.length() - 1);
            }
        }
    }

    public String compressSequences(String[] input) {
        if (input == null || input.length == 0) {
            return "";
        }
        int[] numbers = Arrays.stream(input).mapToInt(str -> {
            if (!str.matches("\\d{5}")) {
                throw new IllegalArgumentException("Invalid input: " + str + " (must be exactly 5 digits)");
            }
            return Integer.parseInt(str);
        }).sorted().toArray();

        if (numbers.length == 0) return "";
        List<String> result = new ArrayList<>();
        int start = numbers[0];
        int end = numbers[0];

        for (int i = 1; i < numbers.length; i++) {
            if (numbers[i] == end + 1) {
                end = numbers[i];
            } else {
                result.add(formatRange(start, end));
                start = end = numbers[i];
            }
        }

        result.add(formatRange(start, end));
        return String.join(", ", result);
    }

}
