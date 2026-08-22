package com.alxnrocha.crm.dto;

import com.alxnrocha.crm.enums.BillingTerm;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ContractUpdateDTO(
    @NotBlank(message = "Title is required")
    String title,

    @NotNull(message = "Total value is required")
    @Positive(message = "Total value must be positive")
    BigDecimal totalValue,

    @NotNull(message = "Billing term is required")
    BillingTerm billingTerm,

    @NotNull(message = "Start date is required")
    LocalDate startDate,

    @NotNull(message = "End date is required")
    LocalDate endDate,

    boolean autoRenew,

    @NotBlank(message = "Owner name is required")
    String ownerName,

    String ownerAvatar
) {}
