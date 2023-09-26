package com.greenhouse.repository;

import com.greenhouse.model.FlashSales;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface FlashSalesRepository extends JpaRepository<FlashSales, Integer> {
    // Các phương thức truy vấn tùy chỉnh có thể được thêm vào đây nếu cần.
    @Query(value = "SELECT FS.Name, FS.StartDate, FS.EndDate, FS.UserDate, PFS.DiscountPercentage," +
            " PFS.Quantity, PFS.UsedQuantity, FS.Status" +
            " FROM Product_FlashSale AS PFS INNER JOIN FlashSales AS FS" +
            " ON PFS.FlashSaleId = FS.FlashSaleId", nativeQuery = true)
    List<Object[]> findAllFlashSale();

}
