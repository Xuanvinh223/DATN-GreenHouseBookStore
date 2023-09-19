package com.greenhouse.service;

import com.greenhouse.model.Address;
import java.util.List;

public interface AddressService {

    List<Address> findAll();

    Address findById(Integer id);

    void add(Address entity);

    void update(Address entity);

    void delete(Integer id);
}
