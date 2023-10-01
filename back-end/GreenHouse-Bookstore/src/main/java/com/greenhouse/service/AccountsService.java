package com.greenhouse.service;

import com.greenhouse.model.Accounts;
import java.util.List;

public interface AccountsService {

    List<Accounts> findAll();

    Accounts findById(String username);

    Accounts add(Accounts entity);

    void update(Accounts entity);

    void delete(String username);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    boolean existsById(String username);
}
