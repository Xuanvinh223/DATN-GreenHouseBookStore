package com.greenhouse.repository;

import com.greenhouse.model.Publishers;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PublishersRepository extends JpaRepository<Publishers, String> {
    
}
