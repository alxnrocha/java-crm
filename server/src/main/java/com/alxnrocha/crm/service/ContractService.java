package com.alxnrocha.crm.service;

import com.alxnrocha.crm.dto.*;
import com.alxnrocha.crm.enums.BillingTerm;
import com.alxnrocha.crm.enums.ContractStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.UUID;

public interface ContractService {

    ContractResponseDTO getContractById(UUID id);

    ContractResponseDTO getContractByNumber(String contractNumber);

    Page<ContractResponseDTO> getContracts(
            String search,
            ContractStatus status,
            BillingTerm billingTerm,
            Pageable pageable
    );

    ContractResponseDTO createContract(ContractCreateDTO dto);

    ContractResponseDTO updateContract(UUID id, ContractUpdateDTO dto);

    ContractResponseDTO updateContractStatus(UUID id, ContractStatusUpdateDTO dto);

    ContractAmendmentDTO addAmendment(UUID contractId, ContractAmendmentCreateDTO dto);

    ContractResponseDTO quickRenew(UUID contractId, int durationMonths, BigDecimal rateAdjustmentPercent);
}
