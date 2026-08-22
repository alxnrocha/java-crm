package com.alxnrocha.crm.dto;

import com.alxnrocha.crm.enums.AccountStatus;
import com.alxnrocha.crm.enums.AccountTier;
import com.alxnrocha.crm.enums.Industry;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record AccountResponseDTO(
    UUID id,
    String corporateName,
    String domain,
    String logoUrl,
    String taxId,
    Industry industry,
    AccountTier tier,
    BigDecimal annualRevenue,
    AccountStatus status,
    Instant createdAt,
    Instant updatedAt,
    List<ContactResponseDTO> contacts
) {}
