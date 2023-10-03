package com.greenhouse.repository;

import com.greenhouse.model.Flash_Sales;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface FlashSalesRepository extends JpaRepository<Flash_Sales, Integer> {
    @Query(value = "SELECT FS.Name, FS.Start_Date, FS.End_Date, FS.User_Date, PFS.Discount_Percentage, " +
            "   PFS.Quantity, PFS.Used_Quantity, FS.Status " +
            " FROM Product_Flash_Sale AS PFS INNER JOIN Flash_Sales AS FS " +
            "ON PFS.Flash_Sale_Id = FS.Flash_Sale_Id", nativeQuery = true)
    List<Object[]> findAllFlashSale();
}
