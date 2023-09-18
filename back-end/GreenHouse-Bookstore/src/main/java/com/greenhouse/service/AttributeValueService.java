package com.greenhouse.service;

import com.greenhouse.model.AttributeValue;
import java.util.List;

public interface AttributeValueService {

    List<AttributeValue> findAll();

    AttributeValue findById(Integer id);

    void add(AttributeValue entity);

    void update(AttributeValue entity);

    void delete(Integer id);
}
