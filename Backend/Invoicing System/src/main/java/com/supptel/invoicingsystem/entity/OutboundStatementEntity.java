package com.supptel.invoicingsystem.entity;

import com.supptel.invoicingsystem.enumeration.ExcludeIncludeType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Filter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "se_ob_stmnt")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OutboundStatementEntity extends BaseEntity {
    @OneToMany(mappedBy = "outboundStatement", fetch = FetchType.LAZY)
    @Filter(name = "excludeFilter", condition = "exc_inc_type = :type")
    @OrderBy("tapSeqNumber ASC")
    private List<OutboundStatementCriteriaEntity> excludedCriteria;

    @OneToMany(mappedBy = "outboundStatement", fetch = FetchType.LAZY)
    @Filter(name = "includeFilter", condition = "exc_inc_type = :type")
    @OrderBy("tapSeqNumber ASC")
    private List<OutboundStatementCriteriaEntity> includedCriteria;
    public OutboundStatementEntity(Long id) {
        this.id = id;
    }

    @Id
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sender", referencedColumnName = "tadigCode")
    private OperatorEntity sender;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient", referencedColumnName = "tadigCode")
    private OperatorEntity recipient;
    private String streamType;
    private String fileType;
    private String stmntType;
    private String year;
    private String month;
    private String seqFrom;
    private String seqTo;
    private Integer fileCount;
    private Integer cdrCount;
    private BigDecimal amount;
    private LocalDateTime lastUpdateTs;

    @ManyToMany(mappedBy = "outboundStatements")
    private List<BaseAggregationEntity> baseAggregations;

    @Transient
    private String excluded;
    @Transient
    private String included;

    @Transient
    private String getExcludedListAsString() {
        StringBuilder excludedSerials = new StringBuilder();
        excludedCriteria.forEach(criteria ->
                excludedSerials.append(criteria.getTapSeqNumber()).append(",")
        );
        return excludedSerials.substring(0, excludedSerials.length() - 1);
    }
    @Transient
    private String getIncludedListAsString() {
        StringBuilder includedSerials = new StringBuilder();
        includedCriteria.forEach(criteria ->
                includedSerials.append(criteria.getTapSeqNumber()).append(",")
        );
        return includedSerials.substring(0,includedSerials.length() - 1);
    }
    @Transient
    public String convertCriteriaToString(ExcludeIncludeType type) {
        StringBuilder resultCriteria  = new StringBuilder();
        String[] allCriteria;
        if (ExcludeIncludeType.EXCLUDE.equals(type)) {
            allCriteria = this.getExcludedListAsString().split(",");
        } else {
            allCriteria = this.getIncludedListAsString().split(",");
        }
        Integer startSerial = Integer.parseInt(allCriteria[0]);
        Integer lastSerial = null;
        Integer endSerial;
        resultCriteria.append(startSerial);
        for (int i = 1; i< allCriteria.length; i++) {
            endSerial = Integer.parseInt(allCriteria[i]);
            if (endSerial - startSerial == 1) {
                lastSerial = endSerial;
            } else {
                if (lastSerial == null) {
                    resultCriteria.append(",").append(endSerial);
                    startSerial = endSerial;
                } else {
                    resultCriteria.append("-").append(lastSerial).append(",");
                    lastSerial = null;
                }
            }
        }
        return resultCriteria.toString();
    }
}
