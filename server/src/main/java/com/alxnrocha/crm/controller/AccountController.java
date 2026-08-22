package com.alxnrocha.crm.controller;

import com.alxnrocha.crm.dto.AccountCreateDTO;
import com.alxnrocha.crm.dto.AccountResponseDTO;
import com.alxnrocha.crm.dto.ContactCreateDTO;
import com.alxnrocha.crm.dto.ContactResponseDTO;
import com.alxnrocha.crm.enums.AccountStatus;
import com.alxnrocha.crm.enums.AccountTier;
import com.alxnrocha.crm.enums.Industry;
import com.alxnrocha.crm.service.AccountService;
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

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/accounts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Accounts", description = "Enterprise Accounts & Stakeholder Contacts Management")
public class AccountController {

    private final AccountService accountService;

    @GetMapping
    @Operation(summary = "Get paginated enterprise accounts with optional filtering")
    public ResponseEntity<Page<AccountResponseDTO>> getAccounts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) AccountTier tier,
            @RequestParam(required = false) Industry industry,
            @RequestParam(required = false) AccountStatus status,
            @PageableDefault(size = 20, sort = "corporateName", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        Page<AccountResponseDTO> accounts = accountService.getAccounts(search, tier, industry, status, pageable);
        return ResponseEntity.ok(accounts);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get enterprise account by UUID")
    public ResponseEntity<AccountResponseDTO> getAccountById(@PathVariable UUID id) {
        AccountResponseDTO account = accountService.getAccountById(id);
        return ResponseEntity.ok(account);
    }

    @PostMapping
    @Operation(summary = "Create a new enterprise account")
    public ResponseEntity<AccountResponseDTO> createAccount(@Valid @RequestBody AccountCreateDTO dto) {
        AccountResponseDTO created = accountService.createAccount(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/{id}/contacts")
    @Operation(summary = "Add a stakeholder contact to an account")
    public ResponseEntity<ContactResponseDTO> addContact(
            @PathVariable UUID id,
            @Valid @RequestBody ContactCreateDTO dto
    ) {
        ContactResponseDTO created = accountService.addContact(id, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}/contacts")
    @Operation(summary = "List all contacts for a specific account")
    public ResponseEntity<List<ContactResponseDTO>> getAccountContacts(@PathVariable UUID id) {
        List<ContactResponseDTO> contacts = accountService.getAccountContacts(id);
        return ResponseEntity.ok(contacts);
    }
}
