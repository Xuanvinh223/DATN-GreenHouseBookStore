package com.greenhouse.service.impl;

import com.greenhouse.model.Address;
import com.greenhouse.repository.AddressRepository;
import com.greenhouse.service.AddressService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AddressServiceImpl implements AddressService {

    @Autowired
    AddressRepository addressRepository;
    

    @Override
    public List<Address> findAll() {
        return addressRepository.findAll();
    }

    @Override
    public Address findById(Integer id) {
        return addressRepository.findById(id).orElse(null);
    }

    @Override
    public void add(Address entity) {
        addressRepository.save(entity);
    }

    @Override
    public void update(Address entity) {
        addressRepository.save(entity);
    }

    @Override
    public void delete(Integer id) {
        addressRepository.deleteById(id);
    }

}
