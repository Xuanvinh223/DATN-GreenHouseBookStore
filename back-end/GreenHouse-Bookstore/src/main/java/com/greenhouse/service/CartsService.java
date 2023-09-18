package com.greenhouse.service;

import com.greenhouse.model.Carts;

import java.util.List;

public interface CartsService {

    List<Carts> findAll();

    Carts findById(Integer cartId);

    void add(Carts entity);

    void update(Carts entity);

    void delete(Integer cartId);
}
