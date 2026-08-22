package com.alxnrocha.crm.entity;

import com.alxnrocha.crm.enums.AccountStatus;
import com.alxnrocha.crm.enums.AccountTier;
import com.alxnrocha.crm.enums.Industry;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "accounts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "corporate_name", nullable = false)
    private String corporateName;

    @Column(name = "domain", nullable = false)
    private String domain;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(name = "tax_id")
    private String taxId;

    @Enumerated(EnumType.STRING)
    @Column(name = "industry", nullable = false)
    private Industry industry;

    @Enumerated(EnumType.STRING)
    @Column(name = "tier", nullable = false)
    private AccountTier tier;

    @Column(name = "annual_revenue", nullable = false, precision = 15, scale = 2)
    private BigDecimal annualRevenue;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private AccountStatus status;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Builder.Default
    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Contact> contacts = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL)
    private List<Contract> contracts = new ArrayList<>();
}
