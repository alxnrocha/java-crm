package com.alxnrocha.crm.dto;

import com.alxnrocha.crm.enums.ContractStatus;
import jakarta.validation.constraints.NotNull;

public record ContractStatusUpdateDTO(
    @NotNull(message = "New contract status is required")
    ContractStatus status,

    String reason
) {}
