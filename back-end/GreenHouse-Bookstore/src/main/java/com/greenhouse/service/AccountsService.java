package com.greenhouse.service;

import com.greenhouse.model.Accounts;
import java.util.List;

public interface AccountsService {

    List<Accounts> findAll();

    Accounts findById(String username);

    void add(Accounts entity);

    void update(Accounts entity);

    void delete(String username);
}
