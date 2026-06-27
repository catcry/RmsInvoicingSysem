package com.supptel.invoicingsystem.repository;

import com.supptel.invoicingsystem.entity.BaseAggregationEntity;
import com.supptel.invoicingsystem.record.DailyBaseAggregationReportDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BaseAggregationRepository extends JpaRepository<BaseAggregationEntity, Long>, JpaSpecificationExecutor<BaseAggregationEntity> {
    @Query(value = """
                SELECT
                    SUBSTRING(file_creation_ts, 1, 4) AS year,
                    SUBSTRING(file_creation_ts, 5, 2) AS month,
                    SUBSTRING(file_creation_ts, 7, 2) AS day,
                    COUNT(*) AS fileCount,
                    SUM(tot_charge + tot_discount_val - tot_tax_val) AS totalAmount
                FROM se_base_agr
                WHERE SUBSTRING(file_creation_ts, 1, 4) = :year
                  AND SUBSTRING(file_creation_ts, 5, 2) = :month
                GROUP BY year, month, day
                ORDER BY year, month, day
            """, nativeQuery = true)
    List<DailyBaseAggregationReportDTO> findDailyAggregation(@Param("year") String year, @Param("month") String month);
}
