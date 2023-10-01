package com.greenhouse.repository;

import com.greenhouse.model.FlashSales;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface FlashSalesRepository extends JpaRepository<FlashSales, Integer> {
    // Các phương thức truy vấn tùy chỉnh có thể được thêm vào đây nếu cần.
    @Query(value = "SELECT FS.Name, FS.Start_Date, FS.End_Date, FS.User_Date, " +
            " PFS.Quantity, PFS.Used_Quantity, FS.Status" +
            " FROM FlashSales FS INNER JOIN Product_FlashSale PFS" +
            " ON FS.Flash_Sale_Id = PFS.Flash_Sale_Id", nativeQuery = true)
    List<Object[]> findAllFlashSale();

}
