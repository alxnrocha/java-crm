package com.alxnrocha.crm.service.impl;

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
import com.alxnrocha.crm.service.ContractService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.Year;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ContractServiceImpl implements ContractService {

    private final ContractRepository contractRepository;
    private final AccountRepository accountRepository;
    private final ContractAmendmentRepository amendmentRepository;
    private final ContractMapper contractMapper;
    private final ContractAmendmentMapper amendmentMapper;

    @Override
    public ContractResponseDTO getContractById(UUID id) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contract", id));
        return contractMapper.toDTO(contract);
    }

    @Override
    public ContractResponseDTO getContractByNumber(String contractNumber) {
        Contract contract = contractRepository.findByContractNumber(contractNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Contract with number", contractNumber));
        return contractMapper.toDTO(contract);
    }

    @Override
    public Page<ContractResponseDTO> getContracts(
            String search,
            ContractStatus status,
            BillingTerm billingTerm,
            Pageable pageable
    ) {
        return contractRepository.findContractsFiltered(search, status, billingTerm, pageable)
                .map(contractMapper::toDTO);
    }

    @Override
    @Transactional
    public ContractResponseDTO createContract(ContractCreateDTO dto) {
        Account account = accountRepository.findById(dto.accountId())
                .orElseThrow(() -> new ResourceNotFoundException("Account", dto.accountId()));

        if (dto.endDate().isBefore(dto.startDate())) {
            throw new BusinessValidationException("Contract end date cannot be prior to start date");
        }

        Contract contract = contractMapper.toEntity(dto);
        contract.setAccount(account);
        contract.setContractNumber(generateUniqueContractNumber());
        contract.setStatus(ContractStatus.DRAFT);
        contract.setMonthlyValue(calculateMonthlyValue(dto.totalValue(), dto.billingTerm()));

        Contract saved = contractRepository.save(contract);
        return contractMapper.toDTO(saved);
    }

    @Override
    @Transactional
    public ContractResponseDTO updateContract(UUID id, ContractUpdateDTO dto) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contract", id));

        if (contract.getStatus() == ContractStatus.CANCELLED) {
            throw new BusinessValidationException("Cannot update a cancelled contract");
        }

        if (dto.endDate().isBefore(dto.startDate())) {
            throw new BusinessValidationException("Contract end date cannot be prior to start date");
        }

        contract.setTitle(dto.title());
        contract.setTotalValue(dto.totalValue());
        contract.setMonthlyValue(calculateMonthlyValue(dto.totalValue(), dto.billingTerm()));
        contract.setBillingTerm(dto.billingTerm());
        contract.setStartDate(dto.startDate());
        contract.setEndDate(dto.endDate());
        contract.setAutoRenew(dto.autoRenew());
        contract.setOwnerName(dto.ownerName());
        if (dto.ownerAvatar() != null) {
            contract.setOwnerAvatar(dto.ownerAvatar());
        }

        Contract saved = contractRepository.save(contract);
        return contractMapper.toDTO(saved);
    }

    @Override
    @Transactional
    public ContractResponseDTO updateContractStatus(UUID id, ContractStatusUpdateDTO dto) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contract", id));

        validateStatusTransition(contract.getStatus(), dto.status());
        contract.setStatus(dto.status());

        Contract saved = contractRepository.save(contract);
        return contractMapper.toDTO(saved);
    }

    @Override
    @Transactional
    public ContractAmendmentDTO addAmendment(UUID contractId, ContractAmendmentCreateDTO dto) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new ResourceNotFoundException("Contract", contractId));

        ContractAmendment amendment = amendmentMapper.toEntity(dto);
        amendment.setContract(contract);

        // Adjust contract total and monthly value by the amendment delta
        if (dto.valueDelta().compareTo(BigDecimal.ZERO) != 0) {
            BigDecimal newTotal = contract.getTotalValue().add(dto.valueDelta());
            contract.setTotalValue(newTotal);
            contract.setMonthlyValue(calculateMonthlyValue(newTotal, contract.getBillingTerm()));
            contractRepository.save(contract);
        }

        ContractAmendment saved = amendmentRepository.save(amendment);
        return amendmentMapper.toDTO(saved);
    }

    @Override
    @Transactional
    public ContractResponseDTO quickRenew(UUID contractId, int durationMonths, BigDecimal rateAdjustmentPercent) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new ResourceNotFoundException("Contract", contractId));

        // Mark current as RENEWED
        contract.setStatus(ContractStatus.RENEWED);
        contractRepository.save(contract);

        // Calculate new values
        BigDecimal adjustmentMultiplier = BigDecimal.ONE.add(
                rateAdjustmentPercent.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP)
        );
        BigDecimal newTotalValue = contract.getTotalValue().multiply(adjustmentMultiplier).setScale(2, RoundingMode.HALF_UP);

        LocalDate newStartDate = contract.getEndDate().plusDays(1);
        LocalDate newEndDate = newStartDate.plusMonths(durationMonths);

        Contract renewedContract = Contract.builder()
                .account(contract.getAccount())
                .contractNumber(generateUniqueContractNumber())
                .title(contract.getTitle() + " (Renewed)")
                .totalValue(newTotalValue)
                .monthlyValue(calculateMonthlyValue(newTotalValue, contract.getBillingTerm()))
                .billingTerm(contract.getBillingTerm())
                .startDate(newStartDate)
                .endDate(newEndDate)
                .status(ContractStatus.ACTIVE)
                .autoRenew(contract.isAutoRenew())
                .ownerName(contract.getOwnerName())
                .ownerAvatar(contract.getOwnerAvatar())
                .build();

        Contract saved = contractRepository.save(renewedContract);

        // Add initial amendment for renewal log
        ContractAmendment renewalLog = ContractAmendment.builder()
                .contract(saved)
                .amendmentTitle("Contract Auto-Renewal Executed")
                .valueDelta(newTotalValue.subtract(contract.getTotalValue()))
                .effectiveDate(LocalDate.now())
                .authorName(contract.getOwnerName())
                .description("Automatic renewal with " + rateAdjustmentPercent + "% adjustment rate.")
                .build();
        amendmentRepository.save(renewalLog);

        return contractMapper.toDTO(saved);
    }

    private void validateStatusTransition(ContractStatus current, ContractStatus next) {
        if (current == next) return;

        boolean isValid = switch (current) {
            case DRAFT -> next == ContractStatus.IN_REVIEW || next == ContractStatus.CANCELLED;
            case IN_REVIEW -> next == ContractStatus.ACTIVE || next == ContractStatus.DRAFT || next == ContractStatus.CANCELLED;
            case ACTIVE -> next == ContractStatus.EXPIRING_SOON || next == ContractStatus.RENEWED || next == ContractStatus.CANCELLED;
            case EXPIRING_SOON -> next == ContractStatus.RENEWED || next == ContractStatus.ACTIVE || next == ContractStatus.CANCELLED;
            case RENEWED, CANCELLED -> false;
        };

        if (!isValid) {
            throw new InvalidStateTransitionException(current, next);
        }
    }

    private BigDecimal calculateMonthlyValue(BigDecimal totalValue, BillingTerm term) {
        if (totalValue == null) return BigDecimal.ZERO;
        return switch (term) {
            case ANNUAL -> totalValue.divide(BigDecimal.valueOf(12), 2, RoundingMode.HALF_UP);
            case QUARTERLY -> totalValue.divide(BigDecimal.valueOf(3), 2, RoundingMode.HALF_UP);
            case MONTHLY -> totalValue;
        };
    }

    private String generateUniqueContractNumber() {
        int randomNum = ThreadLocalRandom.current().nextInt(1000, 9999);
        return String.format("CTR-%d-%d", Year.now().getValue(), randomNum);
    }
}
