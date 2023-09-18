package com.greenhouse.service.impl;

import com.greenhouse.model.OTP;
import com.greenhouse.repository.OTPRepository;
import com.greenhouse.service.OTPService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OTPServiceImpl implements OTPService {

    @Autowired
    private OTPRepository otpRepository;

    @Override
    public List<OTP> findAll() {
        return otpRepository.findAll();
    }

    @Override
    public OTP findById(Integer id) {
        Optional<OTP> result = otpRepository.findById(id);
        return result.orElse(null);
    }

    @Override
    public void add(OTP otp) {
        otpRepository.save(otp);
    }

    @Override
    public void update(OTP otp) {
        otpRepository.save(otp);
    }

    @Override
    public void delete(Integer id) {
        otpRepository.deleteById(id);
    }
}
