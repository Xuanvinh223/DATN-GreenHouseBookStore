package com.greenhouse.service.impl;

import com.greenhouse.model.Roles;
import com.greenhouse.repository.RolesRepository;
import com.greenhouse.service.RolesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RolesServiceImpl implements RolesService {

    @Autowired
    private RolesRepository rolesRepository;

    @Override
    public List<Roles> findAll() {
        return rolesRepository.findAll();
    }

    @Override
    public Roles findById(Integer roleId) {
        Optional<Roles> result = rolesRepository.findById(roleId);
        return result.orElse(null);
    }

    @Override
    public void add(Roles role) {
        rolesRepository.save(role);
    }

    @Override
    public void update(Roles role) {
        rolesRepository.save(role);
    }

    @Override
    public void delete(Integer roleId) {
        rolesRepository.deleteById(roleId);
    }
}
