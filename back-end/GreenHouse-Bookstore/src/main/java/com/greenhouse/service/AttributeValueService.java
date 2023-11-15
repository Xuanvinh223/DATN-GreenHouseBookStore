package com.greenhouse.service;

import com.greenhouse.model.AttributeValue;
import com.greenhouse.model.Product_Detail;

import java.util.List;

public interface AttributeValueService {

    List<AttributeValue> findAll();

    AttributeValue findById(Integer id);

    AttributeValue add(AttributeValue entity);

    AttributeValue update(AttributeValue entity);

    void delete(Integer id);

    List<AttributeValue> findByProductDetail(Product_Detail productDetail);
}
