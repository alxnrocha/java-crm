package com.alxnrocha.crm.service;

import com.alxnrocha.crm.dto.AccountCreateDTO;
import com.alxnrocha.crm.dto.AccountResponseDTO;
import com.alxnrocha.crm.dto.ContactCreateDTO;
import com.alxnrocha.crm.dto.ContactResponseDTO;
import com.alxnrocha.crm.enums.AccountStatus;
import com.alxnrocha.crm.enums.AccountTier;
import com.alxnrocha.crm.enums.Industry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface AccountService {

    AccountResponseDTO getAccountById(UUID id);

    Page<AccountResponseDTO> getAccounts(
            String search,
            AccountTier tier,
            Industry industry,
            AccountStatus status,
            Pageable pageable
    );

    AccountResponseDTO createAccount(AccountCreateDTO dto);

    ContactResponseDTO addContact(UUID accountId, ContactCreateDTO dto);

    List<ContactResponseDTO> getAccountContacts(UUID accountId);
}
