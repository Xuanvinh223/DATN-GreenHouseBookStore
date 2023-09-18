package com.greenhouse.implement;

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
    public Authors findById(String authorId) {
        Optional<Authors> result = authorsRepository.findById(authorId);
        return result.orElse(null);
    }

    @Override
    public void add(Authors authors) {
        authorsRepository.save(authors);
    }

    @Override
    public void update(Authors authors) {
        authorsRepository.save(authors);
    }

    @Override
    public void delete(String authorId) {
        authorsRepository.deleteById(authorId);
    }
}
