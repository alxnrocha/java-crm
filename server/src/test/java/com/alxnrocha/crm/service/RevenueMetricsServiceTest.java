package com.alxnrocha.crm.service;

import com.alxnrocha.crm.dto.analytics.ExecutiveOverviewDTO;
import com.alxnrocha.crm.dto.analytics.KpiMetricsDTO;
import com.alxnrocha.crm.dto.analytics.RevenueGrowthPointDTO;
import com.alxnrocha.crm.entity.Contract;
import com.alxnrocha.crm.enums.ContractStatus;
import com.alxnrocha.crm.repository.ContractRepository;
import com.alxnrocha.crm.service.impl.RevenueMetricsServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class RevenueMetricsServiceTest {

    @Mock
    private ContractRepository contractRepository;

    @InjectMocks
    private RevenueMetricsServiceImpl revenueMetricsService;

    @Test
    void getKpiMetrics_ShouldCalculateCorrectMetrics() {
        when(contractRepository.sumTotalValueByStatus(ContractStatus.ACTIVE))
                .thenReturn(new BigDecimal("4850000.00"));
        when(contractRepository.sumMonthlyValueByStatus(ContractStatus.ACTIVE))
                .thenReturn(new BigDecimal("404166.00"));
        when(contractRepository.countByStatus(ContractStatus.ACTIVE)).thenReturn(68L);
        when(contractRepository.count()).thenReturn(127L);

        Contract expiringContract = Contract.builder()
                .totalValue(new BigDecimal("580000.00"))
                .endDate(LocalDate.now().plusDays(30))
                .build();

        when(contractRepository.findExpiringContracts(any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(List.of(expiringContract));

        KpiMetricsDTO kpis = revenueMetricsService.getKpiMetrics();

        assertThat(kpis).isNotNull();
        assertThat(kpis.totalArr()).isEqualByComparingTo("4850000.00");
        assertThat(kpis.activeMrr()).isEqualByComparingTo("404166.00");
        assertThat(kpis.mrrAttainmentPercent()).isEqualByComparingTo("101.0");
        assertThat(kpis.expiringContractsCount()).isEqualTo(1);
        assertThat(kpis.expiringArrAtRisk()).isEqualByComparingTo("580000.00");
        assertThat(kpis.netRetentionRate()).isEqualByComparingTo("114.8");
    }

    @Test
    void getRevenueGrowthSeries_ShouldReturn12MonthsPoints() {
        List<RevenueGrowthPointDTO> series = revenueMetricsService.getRevenueGrowthSeries();

        assertThat(series).hasSize(12);
        assertThat(series.get(0).month()).isEqualTo("Jan");
        assertThat(series.get(11).month()).isEqualTo("Dec");
    }

    @Test
    void getExecutiveOverview_ShouldAggregateAllMetrics() {
        when(contractRepository.sumTotalValueByStatus(any())).thenReturn(new BigDecimal("1000000.00"));
        when(contractRepository.sumMonthlyValueByStatus(any())).thenReturn(new BigDecimal("100000.00"));
        when(contractRepository.countByStatus(any())).thenReturn(20L);
        when(contractRepository.count()).thenReturn(100L);

        ExecutiveOverviewDTO overview = revenueMetricsService.getExecutiveOverview();

        assertThat(overview).isNotNull();
        assertThat(overview.kpis()).isNotNull();
        assertThat(overview.totalContractsCount()).isEqualTo(100L);
        assertThat(overview.revenueGrowth()).hasSize(12);
        assertThat(overview.statusDistribution()).isNotEmpty();
    }
}
