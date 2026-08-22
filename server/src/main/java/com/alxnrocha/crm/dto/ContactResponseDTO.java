package com.alxnrocha.crm.dto;

import com.alxnrocha.crm.enums.ContactRole;

import java.time.Instant;
import java.util.UUID;

public record ContactResponseDTO(
    UUID id,
    UUID accountId,
    String fullName,
    String email,
    String phone,
    String jobTitle,
    ContactRole roleType,
    String linkedinUrl,
    String avatarUrl,
    boolean isPrimary,
    Instant createdAt
) {}
