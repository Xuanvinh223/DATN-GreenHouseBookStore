package com.greenhouse.implement;

import com.greenhouse.model.AttributeValue;
import com.greenhouse.repository.AttributeValueRepository;
import com.greenhouse.service.AttributeValueService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;


@Service
public class AttributeValueServiceImpl implements AttributeValueService {

     @Autowired
    AttributeValueRepository attributeValueRepository;
    

     @Override
    public List<AttributeValue> findAll() {
        return attributeValueRepository.findAll();
    }

    @Override
    public AttributeValue findById(Integer id) {
        return attributeValueRepository.findById(id).orElse(null);
    }

    @Override
    public void add(AttributeValue entity) {
        attributeValueRepository.save(entity);
    }

    @Override
    public void update(AttributeValue entity) {
        attributeValueRepository.save(entity);
    }

    @Override
    public void delete(Integer id) {
        attributeValueRepository.deleteById(id);
    }
}
