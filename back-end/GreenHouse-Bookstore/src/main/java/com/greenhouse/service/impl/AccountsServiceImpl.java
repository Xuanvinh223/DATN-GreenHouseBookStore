package com.greenhouse.service.impl;

import com.greenhouse.model.Accounts;
import com.greenhouse.model.Brand;
import com.greenhouse.repository.AccountRepository;
import com.greenhouse.service.AccountsService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class AccountsServiceImpl implements AccountsService {

   @Autowired
    AccountRepository accountsRepository;
    

    @Override
    public List<Accounts> findAll() {
        return accountsRepository.findAll();
    }

    @Override
    public Accounts findById(String username) {
       Optional<Accounts> result = accountsRepository.findById(username);
        return result.orElse(null);
    }

    @Override
    public Accounts add(Accounts accounts) {
       return accountsRepository.save(accounts);
    }

    @Override
    public void update(Accounts accounts) {
        accountsRepository.save(accounts);
    }

    @Override
    public void delete(String username) {
        accountsRepository.deleteById(username);
    }
}
