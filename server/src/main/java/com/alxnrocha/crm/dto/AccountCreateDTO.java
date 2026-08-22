package com.alxnrocha.crm.dto;

import com.alxnrocha.crm.enums.AccountTier;
import com.alxnrocha.crm.enums.Industry;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

public record AccountCreateDTO(
    @NotBlank(message = "Corporate name is required")
    String corporateName,

    @NotBlank(message = "Domain is required")
    String domain,

    String logoUrl,
    String taxId,

    @NotNull(message = "Industry is required")
    Industry industry,

    @NotNull(message = "Account tier is required")
    AccountTier tier,

    @NotNull(message = "Annual revenue is required")
    @PositiveOrZero(message = "Annual revenue must be zero or positive")
    BigDecimal annualRevenue
) {}
