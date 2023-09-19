package com.greenhouse.service;

import com.greenhouse.model.Vouchers;

import java.util.List;

public interface VouchersService {

    List<Vouchers> findAll();

    Vouchers findById(Integer voucherId);

    void add(Vouchers entity);

    void update(Vouchers entity);

    void delete(Integer voucherId);
}
