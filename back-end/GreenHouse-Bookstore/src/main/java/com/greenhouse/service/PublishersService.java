package com.greenhouse.service;

import com.greenhouse.model.Publishers;

import java.util.List;

public interface PublishersService {

    List<Publishers> findAll();

    Publishers findById(String publisherId);

    Publishers add(Publishers entity);

    void update(Publishers entity);

    void delete(String publisherId);
}
