package com.alxnrocha.crm.mapper;

import com.alxnrocha.crm.dto.ContactCreateDTO;
import com.alxnrocha.crm.dto.ContactResponseDTO;
import com.alxnrocha.crm.entity.Contact;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface ContactMapper {

    @Mapping(target = "accountId", source = "account.id")
    @Mapping(target = "isPrimary", source = "primary")
    ContactResponseDTO toDTO(Contact contact);

    List<ContactResponseDTO> toDTOList(List<Contact> contacts);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "account", ignore = true)
    @Mapping(target = "primary", source = "isPrimary")
    @Mapping(target = "createdAt", ignore = true)
    Contact toEntity(ContactCreateDTO dto);
}
