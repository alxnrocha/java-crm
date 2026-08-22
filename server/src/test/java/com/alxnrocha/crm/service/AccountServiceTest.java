package com.alxnrocha.crm.service;

import com.alxnrocha.crm.dto.AccountCreateDTO;
import com.alxnrocha.crm.dto.AccountResponseDTO;
import com.alxnrocha.crm.dto.ContactCreateDTO;
import com.alxnrocha.crm.dto.ContactResponseDTO;
import com.alxnrocha.crm.entity.Account;
import com.alxnrocha.crm.entity.Contact;
import com.alxnrocha.crm.enums.AccountStatus;
import com.alxnrocha.crm.enums.AccountTier;
import com.alxnrocha.crm.enums.ContactRole;
import com.alxnrocha.crm.enums.Industry;
import com.alxnrocha.crm.exception.BusinessValidationException;
import com.alxnrocha.crm.exception.ResourceNotFoundException;
import com.alxnrocha.crm.mapper.AccountMapper;
import com.alxnrocha.crm.mapper.ContactMapper;
import com.alxnrocha.crm.repository.AccountRepository;
import com.alxnrocha.crm.repository.ContactRepository;
import com.alxnrocha.crm.service.impl.AccountServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AccountServiceTest {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private ContactRepository contactRepository;

    @Mock
    private AccountMapper accountMapper;

    @Mock
    private ContactMapper contactMapper;

    @InjectMocks
    private AccountServiceImpl accountService;

    private UUID accountId;
    private Account account;
    private AccountResponseDTO accountDTO;

    @BeforeEach
    void setUp() {
        accountId = UUID.randomUUID();
        account = Account.builder()
                .id(accountId)
                .corporateName("Stripe, Inc.")
                .domain("stripe.com")
                .industry(Industry.FINTECH)
                .tier(AccountTier.ENTERPRISE_PLUS)
                .annualRevenue(new BigDecimal("3200000000.00"))
                .status(AccountStatus.ACTIVE)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        accountDTO = new AccountResponseDTO(
                accountId,
                "Stripe, Inc.",
                "stripe.com",
                null,
                "US-11223344",
                Industry.FINTECH,
                AccountTier.ENTERPRISE_PLUS,
                new BigDecimal("3200000000.00"),
                AccountStatus.ACTIVE,
                Instant.now(),
                Instant.now(),
                List.of()
        );
    }

    @Test
    void getAccountById_WhenAccountExists_ShouldReturnAccountDTO() {
        when(accountRepository.findById(accountId)).thenReturn(Optional.of(account));
        when(accountMapper.toDTO(account)).thenReturn(accountDTO);

        AccountResponseDTO result = accountService.getAccountById(accountId);

        assertThat(result).isNotNull();
        assertThat(result.corporateName()).isEqualTo("Stripe, Inc.");
        verify(accountRepository).findById(accountId);
    }

    @Test
    void getAccountById_WhenAccountDoesNotExist_ShouldThrowResourceNotFoundException() {
        when(accountRepository.findById(accountId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> accountService.getAccountById(accountId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining(accountId.toString());
    }

    @Test
    void createAccount_WhenDomainIsUnique_ShouldSaveAndReturnAccount() {
        AccountCreateDTO createDTO = new AccountCreateDTO(
                "Stripe, Inc.",
                "stripe.com",
                null,
                null,
                Industry.FINTECH,
                AccountTier.ENTERPRISE_PLUS,
                new BigDecimal("3200000000.00")
        );

        when(accountRepository.findByDomain("stripe.com")).thenReturn(Optional.empty());
        when(accountMapper.toEntity(createDTO)).thenReturn(account);
        when(accountRepository.save(account)).thenReturn(account);
        when(accountMapper.toDTO(account)).thenReturn(accountDTO);

        AccountResponseDTO result = accountService.createAccount(createDTO);

        assertThat(result).isNotNull();
        assertThat(result.domain()).isEqualTo("stripe.com");
        verify(accountRepository).save(account);
    }

    @Test
    void createAccount_WhenDomainAlreadyExists_ShouldThrowBusinessValidationException() {
        AccountCreateDTO createDTO = new AccountCreateDTO(
                "Stripe, Inc.",
                "stripe.com",
                null,
                null,
                Industry.FINTECH,
                AccountTier.ENTERPRISE_PLUS,
                new BigDecimal("3200000000.00")
        );

        when(accountRepository.findByDomain("stripe.com")).thenReturn(Optional.of(account));

        assertThatThrownBy(() -> accountService.createAccount(createDTO))
                .isInstanceOf(BusinessValidationException.class)
                .hasMessageContaining("stripe.com");

        verify(accountRepository, never()).save(any());
    }

    @Test
    void addContact_WhenAccountExists_ShouldSaveContact() {
        ContactCreateDTO contactCreateDTO = new ContactCreateDTO(
                accountId,
                "Patrick Collison",
                "patrick@stripe.com",
                "+1 415 555 0199",
                "CEO",
                ContactRole.DECISION_MAKER,
                null,
                null,
                true
        );

        Contact contact = Contact.builder()
                .id(UUID.randomUUID())
                .fullName("Patrick Collison")
                .email("patrick@stripe.com")
                .jobTitle("CEO")
                .roleType(ContactRole.DECISION_MAKER)
                .primary(true)
                .build();

        ContactResponseDTO contactResponseDTO = new ContactResponseDTO(
                contact.getId(),
                accountId,
                "Patrick Collison",
                "patrick@stripe.com",
                "+1 415 555 0199",
                "CEO",
                ContactRole.DECISION_MAKER,
                null,
                null,
                true,
                Instant.now()
        );

        when(accountRepository.findById(accountId)).thenReturn(Optional.of(account));
        when(contactMapper.toEntity(contactCreateDTO)).thenReturn(contact);
        when(contactRepository.save(contact)).thenReturn(contact);
        when(contactMapper.toDTO(contact)).thenReturn(contactResponseDTO);

        ContactResponseDTO result = accountService.addContact(accountId, contactCreateDTO);

        assertThat(result).isNotNull();
        assertThat(result.fullName()).isEqualTo("Patrick Collison");
        verify(contactRepository).save(contact);
    }
}
