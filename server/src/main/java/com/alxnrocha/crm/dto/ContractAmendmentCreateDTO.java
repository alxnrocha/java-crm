package com.alxnrocha.crm.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ContractAmendmentCreateDTO(
    @NotBlank(message = "Amendment title is required")
    String amendmentTitle,

    @NotNull(message = "Value delta is required")
    BigDecimal valueDelta,

    @NotNull(message = "Effective date is required")
    LocalDate effectiveDate,

    @NotBlank(message = "Author name is required")
    String authorName,

    String description
) {}
