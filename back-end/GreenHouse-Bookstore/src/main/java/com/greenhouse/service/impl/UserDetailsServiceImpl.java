package com.greenhouse.service.impl;

import com.greenhouse.model.Accounts;
import com.greenhouse.repository.AccountRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private AccountRepository accountRepository;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        //Write Logic to get the user from the DB
        Accounts accounts = accountRepository.findByUsername(username);
        System.out.println(accounts);
        if(accounts == null){
            throw new UsernameNotFoundException("User not found",null);
        }
        return new org.springframework.security.core.userdetails.User(accounts.getUsername(), accounts.getPassword(), new ArrayList<>());
    }
}
