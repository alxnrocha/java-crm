package com.alxnrocha.crm.dto.analytics;

import java.util.List;

public record ExecutiveOverviewDTO(
    KpiMetricsDTO kpis,
    List<StatusDistributionDTO> statusDistribution,
    List<RevenueGrowthPointDTO> revenueGrowth,
    long totalContractsCount
) {}
