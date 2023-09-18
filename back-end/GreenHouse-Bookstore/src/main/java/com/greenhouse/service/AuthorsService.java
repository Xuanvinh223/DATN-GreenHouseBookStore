package com.greenhouse.service;

import com.greenhouse.model.Authors;

import java.util.List;

public interface AuthorsService {

    List<Authors> findAll();

    Authors findById(String authorId);

    void add(Authors entity);

    void update(Authors entity);

    void delete(String authorId);
}
