package com.greenhouse.service;

import com.greenhouse.model.OTP;

import java.util.List;

public interface OTPService {

    List<OTP> findAll();

    OTP findById(Integer id);

    void add(OTP entity);

    void update(OTP entity);

    void delete(Integer id);
}
