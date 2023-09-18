package com.greenhouse.implement;

import com.greenhouse.model.UserVoucher;
import com.greenhouse.repository.UserVoucherRepository;
import com.greenhouse.service.UserVoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserVoucherServiceImpl implements UserVoucherService {

    @Autowired
    private UserVoucherRepository userVoucherRepository;

    @Override
    public List<UserVoucher> findAll() {
        return userVoucherRepository.findAll();
    }

    @Override
    public UserVoucher findById(Integer id) {
        Optional<UserVoucher> result = userVoucherRepository.findById(id);
        return result.orElse(null);
    }

    @Override
    public void add(UserVoucher entity) {
        userVoucherRepository.save(entity);
    }

    @Override
    public void update(UserVoucher entity) {
        userVoucherRepository.save(entity);
    }

    @Override
    public void delete(Integer id) {
        userVoucherRepository.deleteById(id);
    }
}
