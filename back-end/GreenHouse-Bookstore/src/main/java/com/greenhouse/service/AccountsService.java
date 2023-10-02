package com.greenhouse.service;

import com.greenhouse.model.Accounts;
import java.util.List;

public interface AccountsService {

    List<Accounts> findAll();

    Accounts findById(String username);

    Accounts add(Accounts entity);

    Accounts update(Accounts entity);

    void delete(String username);

    int countByCustomer();

    int countByBrand();

    int countOrdersWithStatus();
}
