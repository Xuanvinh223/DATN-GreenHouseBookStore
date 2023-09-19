package com.greenhouse.service;

import com.greenhouse.model.Authentic_Photos;
import java.util.List;

public interface AuthenticPhotosService {

    List<Authentic_Photos> findAll();

    Authentic_Photos findById(Integer id);

    void add(Authentic_Photos entity);

    void update(Authentic_Photos entity);

    void delete(Integer id);
}
