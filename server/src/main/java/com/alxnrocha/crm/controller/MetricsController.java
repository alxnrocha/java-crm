package com.alxnrocha.crm.controller;

import com.alxnrocha.crm.dto.analytics.ExecutiveOverviewDTO;
import com.alxnrocha.crm.dto.analytics.KpiMetricsDTO;
import com.alxnrocha.crm.dto.analytics.RevenueGrowthPointDTO;
import com.alxnrocha.crm.dto.analytics.StatusDistributionDTO;
import com.alxnrocha.crm.service.RevenueMetricsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/metrics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "RevenueOps Analytics", description = "Real-time ARR, MRR, Status Distribution & Growth Analytics")
public class MetricsController {

    private final RevenueMetricsService metricsService;

    @GetMapping("/overview")
    @Operation(summary = "Get complete executive overview with KPIs, donut chart breakdown, and revenue growth series")
    public ResponseEntity<ExecutiveOverviewDTO> getOverview() {
        ExecutiveOverviewDTO overview = metricsService.getExecutiveOverview();
        return ResponseEntity.ok(overview);
    }

    @GetMapping("/kpis")
    @Operation(summary = "Get primary ARR, MRR, NRR, and renewal risk KPI cards")
    public ResponseEntity<KpiMetricsDTO> getKpis() {
        KpiMetricsDTO kpis = metricsService.getKpiMetrics();
        return ResponseEntity.ok(kpis);
    }

    @GetMapping("/status-distribution")
    @Operation(summary = "Get contract count and ARR distribution by status for donut visualization")
    public ResponseEntity<List<StatusDistributionDTO>> getStatusDistribution() {
        List<StatusDistributionDTO> distribution = metricsService.getStatusDistribution();
        return ResponseEntity.ok(distribution);
    }

    @GetMapping("/revenue-growth")
    @Operation(summary = "Get 12-month revenue curve data (Actual vs Target ARR & MRR)")
    public ResponseEntity<List<RevenueGrowthPointDTO>> getRevenueGrowth() {
        List<RevenueGrowthPointDTO> growth = metricsService.getRevenueGrowthSeries();
        return ResponseEntity.ok(growth);
    }
}
