package com.greenhouse.service.impl;

import com.greenhouse.model.Accounts;
import com.greenhouse.model.Authorities;
import com.greenhouse.repository.AccountRepository;
import com.greenhouse.repository.AuthoritiesRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private AuthoritiesRepository authoritiesRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Lấy thông tin người dùng từ cơ sở dữ liệu
        Accounts accounts = accountRepository.findByUsername(username);
        List<Authorities> authorities = authoritiesRepository.findByUsername(username);

        if (accounts == null) {
            throw new UsernameNotFoundException("Không tim thấy tài khoản");
        }

        // Tạo danh sách các quyền từ danh sách Authorities
        List<GrantedAuthority> authoritiesList = authorities.stream()
                .map(authority -> new SimpleGrantedAuthority( "ROLE_" + authority.getRole().getRole()))
                .collect(Collectors.toList());
        return new User(accounts.getUsername(), accounts.getPassword(), authoritiesList);
    }

}
