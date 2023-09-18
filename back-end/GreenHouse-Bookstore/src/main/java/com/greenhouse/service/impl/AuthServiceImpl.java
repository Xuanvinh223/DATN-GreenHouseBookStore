package com.greenhouse.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.greenhouse.dto.SignupDTO;
import com.greenhouse.dto.UserDTO;
import com.greenhouse.model.Accounts;
import com.greenhouse.repository.AccountRepository;
import com.greenhouse.service.AuthService;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AccountRepository accountRepository;

    @Override
    public UserDTO createUser(SignupDTO signupDTO) {
        Accounts accounts = new Accounts();
        accounts.setUsername(signupDTO.getUsername());
        accounts.setFullname(signupDTO.getFullname());
        accounts.setEmail(signupDTO.getEmail());
        accounts.setPassword(new BCryptPasswordEncoder().encode(signupDTO.getPassword()));
        
        Accounts createdUser = accountRepository.save(accounts);
        UserDTO accountsDTO = new UserDTO();
        accountsDTO.setUsername(createdUser.getUsername());
        accountsDTO.setEmail(createdUser.getEmail());
        accountsDTO.setFullname(createdUser.getFullname());
        return accountsDTO;
    }
}
