package com.greenhouse.service;

import java.util.List;

import com.greenhouse.dto.SignupDTO;
import com.greenhouse.dto.UserDTO;
import com.greenhouse.model.Authorities;

public interface AuthService {
    UserDTO createUser(SignupDTO signupDTO);
}

