package com.greenhouse.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.greenhouse.model.Accounts;

public interface AccountRepository extends JpaRepository<Accounts,String> {
    Accounts findByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByEmail(String username);

    boolean existsByPhone(String username);
}
