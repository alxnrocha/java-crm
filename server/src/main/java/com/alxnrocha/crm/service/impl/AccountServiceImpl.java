package com.alxnrocha.crm.service.impl;

import com.alxnrocha.crm.dto.AccountCreateDTO;
import com.alxnrocha.crm.dto.AccountResponseDTO;
import com.alxnrocha.crm.dto.ContactCreateDTO;
import com.alxnrocha.crm.dto.ContactResponseDTO;
import com.alxnrocha.crm.entity.Account;
import com.alxnrocha.crm.entity.Contact;
import com.alxnrocha.crm.enums.AccountStatus;
import com.alxnrocha.crm.enums.AccountTier;
import com.alxnrocha.crm.enums.Industry;
import com.alxnrocha.crm.exception.BusinessValidationException;
import com.alxnrocha.crm.exception.ResourceNotFoundException;
import com.alxnrocha.crm.mapper.AccountMapper;
import com.alxnrocha.crm.mapper.ContactMapper;
import com.alxnrocha.crm.repository.AccountRepository;
import com.alxnrocha.crm.repository.ContactRepository;
import com.alxnrocha.crm.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final ContactRepository contactRepository;
    private final AccountMapper accountMapper;
    private final ContactMapper contactMapper;

    @Override
    public AccountResponseDTO getAccountById(UUID id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account", id));
        return accountMapper.toDTO(account);
    }

    @Override
    public Page<AccountResponseDTO> getAccounts(
            String search,
            AccountTier tier,
            Industry industry,
            AccountStatus status,
            Pageable pageable
    ) {
        return accountRepository.findAccountsFiltered(search, tier, industry, status, pageable)
                .map(accountMapper::toDTO);
    }

    @Override
    @Transactional
    public AccountResponseDTO createAccount(AccountCreateDTO dto) {
        accountRepository.findByDomain(dto.domain()).ifPresent(existing -> {
            throw new BusinessValidationException("An account with domain '" + dto.domain() + "' already exists");
        });

        Account account = accountMapper.toEntity(dto);
        Account saved = accountRepository.save(account);
        return accountMapper.toDTO(saved);
    }

    @Override
    @Transactional
    public ContactResponseDTO addContact(UUID accountId, ContactCreateDTO dto) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account", accountId));

        Contact contact = contactMapper.toEntity(dto);
        contact.setAccount(account);

        Contact saved = contactRepository.save(contact);
        return contactMapper.toDTO(saved);
    }

    @Override
    public List<ContactResponseDTO> getAccountContacts(UUID accountId) {
        if (!accountRepository.existsById(accountId)) {
            throw new ResourceNotFoundException("Account", accountId);
        }
        return contactMapper.toDTOList(contactRepository.findByAccountId(accountId));
    }
}
