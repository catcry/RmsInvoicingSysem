package com.supptel.invoicingsystem.repository;

import com.supptel.invoicingsystem.entity.OperatorEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OperatorRepository extends JpaRepository<OperatorEntity, Long>, JpaSpecificationExecutor<OperatorEntity> {
    Optional<OperatorEntity> findByTadigCode(String tadigCode);
}