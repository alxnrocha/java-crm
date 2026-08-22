package com.alxnrocha.crm.service;

import com.alxnrocha.crm.dto.*;
import com.alxnrocha.crm.entity.Account;
import com.alxnrocha.crm.entity.Contract;
import com.alxnrocha.crm.entity.ContractAmendment;
import com.alxnrocha.crm.enums.BillingTerm;
import com.alxnrocha.crm.enums.ContractStatus;
import com.alxnrocha.crm.exception.BusinessValidationException;
import com.alxnrocha.crm.exception.InvalidStateTransitionException;
import com.alxnrocha.crm.exception.ResourceNotFoundException;
import com.alxnrocha.crm.mapper.ContractAmendmentMapper;
import com.alxnrocha.crm.mapper.ContractMapper;
import com.alxnrocha.crm.repository.AccountRepository;
import com.alxnrocha.crm.repository.ContractAmendmentRepository;
import com.alxnrocha.crm.repository.ContractRepository;
import com.alxnrocha.crm.service.impl.ContractServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ContractServiceTest {

    @Mock
    private ContractRepository contractRepository;

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private ContractAmendmentRepository amendmentRepository;

    @Mock
    private ContractMapper contractMapper;

    @Mock
    private ContractAmendmentMapper amendmentMapper;

    @InjectMocks
    private ContractServiceImpl contractService;

    private UUID contractId;
    private UUID accountId;
    private Account account;
    private Contract contract;
    private ContractResponseDTO contractDTO;

    @BeforeEach
    void setUp() {
        contractId = UUID.randomUUID();
        accountId = UUID.randomUUID();

        account = Account.builder()
                .id(accountId)
                .corporateName("Cloudflare Inc.")
                .domain("cloudflare.com")
                .build();

        contract = Contract.builder()
                .id(contractId)
                .account(account)
                .contractNumber("CTR-2026-8941")
                .title("Master Services Agreement")
                .totalValue(new BigDecimal("240000.00"))
                .monthlyValue(new BigDecimal("20000.00"))
                .billingTerm(BillingTerm.ANNUAL)
                .startDate(LocalDate.of(2025, 3, 15))
                .endDate(LocalDate.of(2026, 3, 15))
                .status(ContractStatus.ACTIVE)
                .autoRenew(true)
                .ownerName("Sarah Chen")
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .amendments(new ArrayList<>())
                .build();

        contractDTO = new ContractResponseDTO(
                contractId,
                accountId,
                "Cloudflare Inc.",
                "cloudflare.com",
                null,
                "ENTERPRISE",
                "CTR-2026-8941",
                "Master Services Agreement",
                new BigDecimal("240000.00"),
                new BigDecimal("20000.00"),
                BillingTerm.ANNUAL,
                LocalDate.of(2025, 3, 15),
                LocalDate.of(2026, 3, 15),
                ContractStatus.ACTIVE,
                true,
                "Sarah Chen",
                null,
                Instant.now(),
                Instant.now(),
                new ArrayList<>()
        );
    }

    @Test
    void getContractById_WhenExists_ShouldReturnDTO() {
        when(contractRepository.findById(contractId)).thenReturn(Optional.of(contract));
        when(contractMapper.toDTO(contract)).thenReturn(contractDTO);

        ContractResponseDTO result = contractService.getContractById(contractId);

        assertThat(result).isNotNull();
        assertThat(result.contractNumber()).isEqualTo("CTR-2026-8941");
    }

    @Test
    void getContractById_WhenNotFound_ShouldThrowResourceNotFoundException() {
        when(contractRepository.findById(contractId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> contractService.getContractById(contractId))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void createContract_WhenEndDateBeforeStartDate_ShouldThrowBusinessValidationException() {
        ContractCreateDTO createDTO = new ContractCreateDTO(
                accountId,
                "Invalid Agreement",
                new BigDecimal("100000.00"),
                BillingTerm.ANNUAL,
                LocalDate.of(2026, 5, 1),
                LocalDate.of(2026, 1, 1), // Invalid end date
                true,
                "Sarah Chen",
                null
        );

        when(accountRepository.findById(accountId)).thenReturn(Optional.of(account));

        assertThatThrownBy(() -> contractService.createContract(createDTO))
                .isInstanceOf(BusinessValidationException.class)
                .hasMessageContaining("prior to start date");

        verify(contractRepository, never()).save(any());
    }

    @Test
    void updateContractStatus_WhenValidTransition_ShouldUpdateAndReturnDTO() {
        contract.setStatus(ContractStatus.DRAFT);
        ContractStatusUpdateDTO updateDTO = new ContractStatusUpdateDTO(ContractStatus.IN_REVIEW, "Submitted for legal review");

        when(contractRepository.findById(contractId)).thenReturn(Optional.of(contract));
        when(contractRepository.save(contract)).thenReturn(contract);
        when(contractMapper.toDTO(contract)).thenReturn(contractDTO);

        ContractResponseDTO result = contractService.updateContractStatus(contractId, updateDTO);

        assertThat(result).isNotNull();
        assertThat(contract.getStatus()).isEqualTo(ContractStatus.IN_REVIEW);
        verify(contractRepository).save(contract);
    }

    @Test
    void updateContractStatus_WhenInvalidTransition_ShouldThrowInvalidStateTransitionException() {
        contract.setStatus(ContractStatus.DRAFT);
        // DRAFT cannot directly jump to ACTIVE without IN_REVIEW
        ContractStatusUpdateDTO updateDTO = new ContractStatusUpdateDTO(ContractStatus.ACTIVE, "Direct activation attempt");

        when(contractRepository.findById(contractId)).thenReturn(Optional.of(contract));

        assertThatThrownBy(() -> contractService.updateContractStatus(contractId, updateDTO))
                .isInstanceOf(InvalidStateTransitionException.class);

        verify(contractRepository, never()).save(any());
    }

    @Test
    void addAmendment_ShouldUpdateContractTotalAndLogAmendment() {
        ContractAmendmentCreateDTO amendmentDTO = new ContractAmendmentCreateDTO(
                "Amendment #1 — Cloudflare Spectrum",
                new BigDecimal("40000.00"),
                LocalDate.of(2025, 1, 20),
                "Maya Rodriguez",
                "Added Spectrum security"
        );

        ContractAmendment amendment = ContractAmendment.builder()
                .id(UUID.randomUUID())
                .contract(contract)
                .amendmentTitle(amendmentDTO.amendmentTitle())
                .valueDelta(amendmentDTO.valueDelta())
                .effectiveDate(amendmentDTO.effectiveDate())
                .authorName(amendmentDTO.authorName())
                .description(amendmentDTO.description())
                .createdAt(Instant.now())
                .build();

        ContractAmendmentDTO responseDTO = new ContractAmendmentDTO(
                amendment.getId(),
                contractId,
                amendment.getAmendmentTitle(),
                amendment.getValueDelta(),
                amendment.getEffectiveDate(),
                amendment.getAuthorName(),
                amendment.getDescription(),
                amendment.getCreatedAt()
        );

        when(contractRepository.findById(contractId)).thenReturn(Optional.of(contract));
        when(amendmentMapper.toEntity(amendmentDTO)).thenReturn(amendment);
        when(amendmentRepository.save(amendment)).thenReturn(amendment);
        when(amendmentMapper.toDTO(amendment)).thenReturn(responseDTO);

        ContractAmendmentDTO result = contractService.addAmendment(contractId, amendmentDTO);

        assertThat(result).isNotNull();
        assertThat(contract.getTotalValue()).isEqualByComparingTo("280000.00");
        verify(contractRepository).save(contract);
        verify(amendmentRepository).save(amendment);
    }
}
