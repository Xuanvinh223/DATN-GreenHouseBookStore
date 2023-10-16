package com.greenhouse.repository;

import com.greenhouse.model.Products;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ProductsRepository extends JpaRepository<Products, String> {
    // Các phương thức truy vấn tùy chỉnh nếu cần
    @Query(value="SELECT TOP 10 " + //
            "    p.[Product_Id] AS ProductId," + //
            "    d.[Product_Detail_Id] AS ProductDetailId," + //
            "    p.[Product_Name] AS ProductName," + //
            "    d.[Price] AS UnitPrice," + //
            "    SUM(id.[Quantity]) AS TotalQuantitySold," + //
            "    d.[Image] AS ProductImage " + //
            "FROM [Products] p " + //
            "JOIN [Product_Detail] d ON p.[Product_Id] = d.[Product_Id] " + //
            "JOIN [Invoice_Details] id ON d.[Product_Detail_Id] = id.[Product_Detail_Id] " + //
            "JOIN [Invoices] i ON id.[Invoice_Id] = i.[Invoice_Id] " + //
            "GROUP BY p.[Product_Id], d.[Product_Detail_Id], p.[Product_Name], d.[Price], d.[Image] " + //
            "ORDER BY SUM(id.[Quantity]) DESC; " ,nativeQuery = true)
    List<Object[]> SellingProduct();
}
