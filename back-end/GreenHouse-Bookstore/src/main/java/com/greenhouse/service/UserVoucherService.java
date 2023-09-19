package com.greenhouse.service;

import com.greenhouse.model.UserVoucher;

import java.util.List;

public interface UserVoucherService {

    List<UserVoucher> findAll();

    UserVoucher findById(Integer id);

    void add(UserVoucher entity);

    void update(UserVoucher entity);

    void delete(Integer id);
}
