package com.greenhouse.service;

import com.greenhouse.model.Suppliers;

import java.util.List;

public interface SuppliersService {

    List<Suppliers> findAll();

    Suppliers findById(String supplierId);

    void add(Suppliers entity);

    void update(Suppliers entity);

    void delete(String supplierId);
}
