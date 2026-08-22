package com.alxnrocha.crm.repository;

import com.alxnrocha.crm.entity.Account;
import com.alxnrocha.crm.enums.AccountStatus;
import com.alxnrocha.crm.enums.AccountTier;
import com.alxnrocha.crm.enums.Industry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AccountRepository extends JpaRepository<Account, UUID> {

    Optional<Account> findByDomain(String domain);

    List<Account> findByStatus(AccountStatus status);

    long countByStatus(AccountStatus status);

    @Query("SELECT a FROM Account a WHERE " +
           "(:search IS NULL OR LOWER(a.corporateName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(a.domain) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:tier IS NULL OR a.tier = :tier) AND " +
           "(:industry IS NULL OR a.industry = :industry) AND " +
           "(:status IS NULL OR a.status = :status)")
    Page<Account> findAccountsFiltered(
            @Param("search") String search,
            @Param("tier") AccountTier tier,
            @Param("industry") Industry industry,
            @Param("status") AccountStatus status,
            Pageable pageable
    );
}
