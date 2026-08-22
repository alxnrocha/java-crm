package com.alxnrocha.crm.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record ContractAmendmentDTO(
    UUID id,
    UUID contractId,
    String amendmentTitle,
    BigDecimal valueDelta,
    LocalDate effectiveDate,
    String authorName,
    String description,
    Instant createdAt
) {}
