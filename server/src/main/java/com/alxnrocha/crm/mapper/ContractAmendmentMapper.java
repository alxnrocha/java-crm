package com.alxnrocha.crm.mapper;

import com.alxnrocha.crm.dto.ContractAmendmentCreateDTO;
import com.alxnrocha.crm.dto.ContractAmendmentDTO;
import com.alxnrocha.crm.entity.ContractAmendment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface ContractAmendmentMapper {

    @Mapping(target = "contractId", source = "contract.id")
    ContractAmendmentDTO toDTO(ContractAmendment amendment);

    List<ContractAmendmentDTO> toDTOList(List<ContractAmendment> amendments);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "contract", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    ContractAmendment toEntity(ContractAmendmentCreateDTO dto);
}
