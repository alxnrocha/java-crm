package com.alxnrocha.crm.service;

import com.alxnrocha.crm.dto.analytics.ExecutiveOverviewDTO;
import com.alxnrocha.crm.dto.analytics.KpiMetricsDTO;
import com.alxnrocha.crm.dto.analytics.RevenueGrowthPointDTO;
import com.alxnrocha.crm.dto.analytics.StatusDistributionDTO;

import java.util.List;

public interface RevenueMetricsService {

    ExecutiveOverviewDTO getExecutiveOverview();

    KpiMetricsDTO getKpiMetrics();

    List<StatusDistributionDTO> getStatusDistribution();

    List<RevenueGrowthPointDTO> getRevenueGrowthSeries();
}
