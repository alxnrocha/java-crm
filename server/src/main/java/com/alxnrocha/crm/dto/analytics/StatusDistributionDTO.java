package com.alxnrocha.crm.dto.analytics;

import com.alxnrocha.crm.enums.ContractStatus;

import java.math.BigDecimal;

public record StatusDistributionDTO(
    ContractStatus status,
    String label,
    long count,
    BigDecimal percentage,
    BigDecimal totalArr,
    String color
) {}
