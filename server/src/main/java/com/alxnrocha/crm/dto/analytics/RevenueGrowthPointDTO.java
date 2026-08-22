package com.alxnrocha.crm.dto.analytics;

import java.math.BigDecimal;

public record RevenueGrowthPointDTO(
    String month,
    BigDecimal actualArr,
    BigDecimal targetArr,
    BigDecimal mrr
) {}
