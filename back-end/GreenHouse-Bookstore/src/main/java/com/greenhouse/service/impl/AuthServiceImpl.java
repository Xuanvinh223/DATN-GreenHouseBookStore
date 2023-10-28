package com.greenhouse.service.impl;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.greenhouse.dto.SignupDTO;
import com.greenhouse.dto.UserDTO;
import com.greenhouse.model.Accounts;
import com.greenhouse.model.Authorities;
import com.greenhouse.repository.AccountRepository;
import com.greenhouse.repository.AuthoritiesRepository;
import com.greenhouse.service.AuthService;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private AuthoritiesRepository authoritiesRepository;

    @Override
    public UserDTO signup(SignupDTO signupDTO) {
        Accounts accounts = new Accounts();
        Authorities authorities = new Authorities();
        UserDTO accountsDTO = new UserDTO();

        accounts.setUsername(signupDTO.getUsername());
        accounts.setPassword(new BCryptPasswordEncoder().encode(signupDTO.getPassword()));
        accounts.setEmail(signupDTO.getEmail());
        accounts.setPhone(signupDTO.getPhone());
        accounts.setCreatedAt(new Date());
        accounts.setActive(false);
        Accounts createdUser = accountRepository.save(accounts); // lưu vào db bảng account

        authorities.setUsername(accounts.getUsername());
        authorities.setRoleId(3);
        authoritiesRepository.save(authorities); // lưu vào db bảng authorities

        accountsDTO.setUsername(createdUser.getUsername());
        accountsDTO.setEmail(createdUser.getEmail());
        accountsDTO.setFullname(createdUser.getFullname());
        return accountsDTO;
    }
}
