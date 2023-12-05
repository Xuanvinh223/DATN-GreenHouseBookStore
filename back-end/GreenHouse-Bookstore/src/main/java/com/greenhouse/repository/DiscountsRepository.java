package com.greenhouse.repository;

import com.greenhouse.model.Discounts;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DiscountsRepository extends JpaRepository<Discounts, Integer> {

    @Query("SELECT d FROM Discounts d " +
            "WHERE d.startDate <= :currentDateTime " +
            "AND d.endDate >= :currentDateTime")
    List<Discounts> findActiveDiscountsNow(@Param("currentDateTime") Date currentDateTime);

}
