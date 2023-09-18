package com.greenhouse.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.greenhouse.model.Accounts;

@Repository
public interface AccountRepository extends JpaRepository<Accounts,String> {
    Accounts findByUsername(String username);
}
