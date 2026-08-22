package com.alxnrocha.crm.repository;

import com.alxnrocha.crm.entity.Contract;
import com.alxnrocha.crm.enums.BillingTerm;
import com.alxnrocha.crm.enums.ContractStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ContractRepository extends JpaRepository<Contract, UUID> {

    Optional<Contract> findByContractNumber(String contractNumber);

    List<Contract> findByAccountId(UUID accountId);

    List<Contract> findByStatus(ContractStatus status);

    long countByStatus(ContractStatus status);

    @Query("SELECT COALESCE(SUM(c.totalValue), 0) FROM Contract c WHERE c.status = :status")
    BigDecimal sumTotalValueByStatus(@Param("status") ContractStatus status);

    @Query("SELECT COALESCE(SUM(c.monthlyValue), 0) FROM Contract c WHERE c.status = :status")
    BigDecimal sumMonthlyValueByStatus(@Param("status") ContractStatus status);

    @Query("SELECT c FROM Contract c WHERE c.status = 'ACTIVE' AND c.endDate BETWEEN :now AND :thresholdDate")
    List<Contract> findExpiringContracts(
            @Param("now") LocalDate now,
            @Param("thresholdDate") LocalDate thresholdDate
    );

    @Query("SELECT c FROM Contract c " +
           "JOIN FETCH c.account a " +
           "WHERE (:search IS NULL OR " +
           "      LOWER(c.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "      LOWER(c.contractNumber) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "      LOWER(a.corporateName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "      LOWER(c.ownerName) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:status IS NULL OR c.status = :status) AND " +
           "(:billingTerm IS NULL OR c.billingTerm = :billingTerm)")
    Page<Contract> findContractsFiltered(
            @Param("search") String search,
            @Param("status") ContractStatus status,
            @Param("billingTerm") BillingTerm billingTerm,
            Pageable pageable
    );
}
