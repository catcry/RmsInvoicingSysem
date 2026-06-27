package com.supptel.invoicingsystem.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "se_recon")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@NamedEntityGraph(
        name = "InOutStatement.withChildren",
        attributeNodes = @NamedAttributeNode(value = "inboundStatement", subgraph = "inboundStatement.children"),
        subgraphs = @NamedSubgraph(name = "inboundStatement.children", attributeNodes = {
                @NamedAttributeNode("includedCriteria"), @NamedAttributeNode("excludedCriteria")
        })
)
public class InOutStatementEntity extends BaseEntity {
    @Id
    private Long id;

    @JoinColumn(name = "ib_stmnt_id")
    @ManyToOne(fetch = FetchType.LAZY)
    private InboundStatementEntity inboundStatement;

    @JoinColumn(name = "ob_stmnt_id")
    @ManyToOne(fetch = FetchType.LAZY)
    private OutboundStatementEntity outboundStatement;

    private String isConfirmed;
    private LocalDateTime confirmationTs;
    private String confirmedBy;

}
