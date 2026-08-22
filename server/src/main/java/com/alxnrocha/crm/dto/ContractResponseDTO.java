package com.alxnrocha.crm.dto;

import com.alxnrocha.crm.enums.BillingTerm;
import com.alxnrocha.crm.enums.ContractStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record ContractResponseDTO(
    UUID id,
    UUID accountId,
    String accountCorporateName,
    String accountDomain,
    String accountLogoUrl,
    String accountTier,
    String contractNumber,
    String title,
    BigDecimal totalValue,
    BigDecimal monthlyValue,
    BillingTerm billingTerm,
    LocalDate startDate,
    LocalDate endDate,
    ContractStatus status,
    boolean autoRenew,
    String ownerName,
    String ownerAvatar,
    Instant createdAt,
    Instant updatedAt,
    List<ContractAmendmentDTO> amendments
) {}
