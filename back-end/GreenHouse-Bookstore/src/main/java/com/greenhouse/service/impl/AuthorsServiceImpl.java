package com.greenhouse.service.impl;

import com.greenhouse.model.Authors;
import com.greenhouse.repository.AuthorsRepository;
import com.greenhouse.service.AuthorsService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AuthorsServiceImpl implements AuthorsService {

    @Autowired
    private AuthorsRepository authorsRepository;

    @Override
    public List<Authors> findAll() {
        return authorsRepository.findAll();
    }

    @Override
    public Authors findById(String id) {
        Optional<Authors> result = authorsRepository.findById(id);
        return result.orElse(null);
    }

    @Override
    public void add(Authors bookAuthors) {
        authorsRepository.save(bookAuthors);
    }

    @Override
    public void update(Authors bookAuthors) {
        authorsRepository.save(bookAuthors);
    }

    @Override
    public void delete(String id) {
        authorsRepository.deleteById(id);
    }
}
