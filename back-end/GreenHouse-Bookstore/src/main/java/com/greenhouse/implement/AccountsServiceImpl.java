package com.greenhouse.implement;

import com.greenhouse.model.Accounts;
import com.greenhouse.repository.AccountsRepository;
import com.greenhouse.service.AccountsService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AccountsServiceImpl implements AccountsService {

   @Autowired
    AccountsRepository accountsRepository;
    

    @Override
    public List<Accounts> findAll() {
        return accountsRepository.findAll();
    }

    @Override
    public Accounts findById(String id) {
        return accountsRepository.findById(id).orElse(null);
    }

    @Override
    public void add(Accounts entity) {
        accountsRepository.save(entity);
    }

    @Override
    public void update(Accounts entity) {
        accountsRepository.save(entity);
    }

    @Override
    public void delete(String id) {
        accountsRepository.deleteById(id);
    }
}
