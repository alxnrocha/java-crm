package com.alxnrocha.crm.dto;

import com.alxnrocha.crm.enums.ContactRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record ContactCreateDTO(
    @NotNull(message = "Account ID is required")
    UUID accountId,

    @NotBlank(message = "Full name is required")
    String fullName,

    @NotBlank(message = "Email is required")
    @Email(message = "Valid email is required")
    String email,

    String phone,
    String jobTitle,

    @NotNull(message = "Role type is required")
    ContactRole roleType,

    String linkedinUrl,
    String avatarUrl,
    boolean isPrimary
) {}
