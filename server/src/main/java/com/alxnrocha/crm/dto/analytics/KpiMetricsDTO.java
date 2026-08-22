package com.alxnrocha.crm.dto.analytics;

import java.math.BigDecimal;

public record KpiMetricsDTO(
    BigDecimal totalArr,
    BigDecimal arrGrowthPercent,
    BigDecimal activeMrr,
    BigDecimal mrrTarget,
    BigDecimal mrrAttainmentPercent,
    long expiringContractsCount,
    BigDecimal expiringArrAtRisk,
    BigDecimal netRetentionRate,
    BigDecimal nrrDeltaPercent,
    long activeContractsCount,
    long totalContractsCount
) {}
