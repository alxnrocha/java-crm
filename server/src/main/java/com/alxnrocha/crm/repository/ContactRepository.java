package com.alxnrocha.crm.repository;

import com.alxnrocha.crm.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ContactRepository extends JpaRepository<Contact, UUID> {

    List<Contact> findByAccountId(UUID accountId);

    Optional<Contact> findByAccountIdAndPrimaryTrue(UUID accountId);
}
