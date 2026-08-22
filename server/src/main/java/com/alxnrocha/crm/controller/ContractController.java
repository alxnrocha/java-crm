package com.alxnrocha.crm.controller;

import com.alxnrocha.crm.dto.*;
import com.alxnrocha.crm.enums.BillingTerm;
import com.alxnrocha.crm.enums.ContractStatus;
import com.alxnrocha.crm.service.ContractService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/contracts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Contracts", description = "B2B Contract Lifecycle, Amendments & State Transitions")
public class ContractController {

    private final ContractService contractService;

    @GetMapping
    @Operation(summary = "Get paginated contracts with multi-criteria filtering")
    public ResponseEntity<Page<ContractResponseDTO>> getContracts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) ContractStatus status,
            @RequestParam(required = false) BillingTerm billingTerm,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<ContractResponseDTO> contracts = contractService.getContracts(search, status, billingTerm, pageable);
        return ResponseEntity.ok(contracts);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get contract details with amendments and stakeholders by UUID")
    public ResponseEntity<ContractResponseDTO> getContractById(@PathVariable UUID id) {
        ContractResponseDTO contract = contractService.getContractById(id);
        return ResponseEntity.ok(contract);
    }

    @GetMapping("/by-number/{contractNumber}")
    @Operation(summary = "Get contract by corporate contract number (e.g. CTR-2026-8941)")
    public ResponseEntity<ContractResponseDTO> getContractByNumber(@PathVariable String contractNumber) {
        ContractResponseDTO contract = contractService.getContractByNumber(contractNumber);
        return ResponseEntity.ok(contract);
    }

    @PostMapping
    @Operation(summary = "Create a new B2B contract in DRAFT state")
    public ResponseEntity<ContractResponseDTO> createContract(@Valid @RequestBody ContractCreateDTO dto) {
        ContractResponseDTO created = contractService.createContract(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing contract details")
    public ResponseEntity<ContractResponseDTO> updateContract(
            @PathVariable UUID id,
            @Valid @RequestBody ContractUpdateDTO dto
    ) {
        ContractResponseDTO updated = contractService.updateContract(id, dto);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Transition contract lifecycle state (Draft -> Legal Review -> Active -> Renewal)")
    public ResponseEntity<ContractResponseDTO> updateContractStatus(
            @PathVariable UUID id,
            @Valid @RequestBody ContractStatusUpdateDTO dto
    ) {
        ContractResponseDTO updated = contractService.updateContractStatus(id, dto);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/amendments")
    @Operation(summary = "Register a contract amendment or value adjustment")
    public ResponseEntity<ContractAmendmentDTO> addAmendment(
            @PathVariable UUID id,
            @Valid @RequestBody ContractAmendmentCreateDTO dto
    ) {
        ContractAmendmentDTO created = contractService.addAmendment(id, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/{id}/quick-renew")
    @Operation(summary = "Execute instant contract renewal with term duration and rate adjustment")
    public ResponseEntity<ContractResponseDTO> quickRenew(
            @PathVariable UUID id,
            @RequestParam(defaultValue = "12") int durationMonths,
            @RequestParam(defaultValue = "5.0") BigDecimal rateAdjustmentPercent
    ) {
        ContractResponseDTO renewed = contractService.quickRenew(id, durationMonths, rateAdjustmentPercent);
        return ResponseEntity.ok(renewed);
    }
}
