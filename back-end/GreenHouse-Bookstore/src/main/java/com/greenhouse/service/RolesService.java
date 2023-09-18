package com.greenhouse.service;

import com.greenhouse.model.Roles;

import java.util.List;

public interface RolesService {

    List<Roles> findAll();

    Roles findById(Integer roleId);

    void add(Roles entity);

    void update(Roles entity);

    void delete(Integer roleId);
}
