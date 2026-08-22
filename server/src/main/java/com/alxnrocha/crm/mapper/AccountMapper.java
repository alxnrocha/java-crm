package com.alxnrocha.crm.mapper;

import com.alxnrocha.crm.dto.AccountCreateDTO;
import com.alxnrocha.crm.dto.AccountResponseDTO;
import com.alxnrocha.crm.entity.Account;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = {ContactMapper.class})
public interface AccountMapper {

    AccountResponseDTO toDTO(Account account);

    List<AccountResponseDTO> toDTOList(List<Account> accounts);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", constant = "ACTIVE")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "contacts", ignore = true)
    @Mapping(target = "contracts", ignore = true)
    Account toEntity(AccountCreateDTO dto);
}
