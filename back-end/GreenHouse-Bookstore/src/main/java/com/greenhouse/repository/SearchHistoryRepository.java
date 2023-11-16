package com.greenhouse.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.greenhouse.model.Search_History;

public interface SearchHistoryRepository extends JpaRepository<Search_History, Integer> {

    List<Search_History> findByAccountUsernameOrderBySearchTimeDesc(String username);
}
