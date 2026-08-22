package com.alxnrocha.crm.mapper;

import com.alxnrocha.crm.dto.ContractCreateDTO;
import com.alxnrocha.crm.dto.ContractResponseDTO;
import com.alxnrocha.crm.entity.Contract;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = {ContractAmendmentMapper.class})
public interface ContractMapper {

    @Mapping(target = "accountId", source = "account.id")
    @Mapping(target = "accountCorporateName", source = "account.corporateName")
    @Mapping(target = "accountDomain", source = "account.domain")
    @Mapping(target = "accountLogoUrl", source = "account.logoUrl")
    @Mapping(target = "accountTier", source = "account.tier")
    ContractResponseDTO toDTO(Contract contract);

    List<ContractResponseDTO> toDTOList(List<Contract> contracts);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "account", ignore = true)
    @Mapping(target = "contractNumber", ignore = true)
    @Mapping(target = "monthlyValue", ignore = true)
    @Mapping(target = "status", constant = "DRAFT")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "amendments", ignore = true)
    Contract toEntity(ContractCreateDTO dto);
}
