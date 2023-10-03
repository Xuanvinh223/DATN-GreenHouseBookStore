package com.greenhouse.repository;

import com.greenhouse.model.Product_Detail;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ProductDetailRepository extends JpaRepository<Product_Detail, Integer> {
    @Query(value = "SELECT " +
            "    PD.Product_Detail_Id AS ID, " +
            "    P.Product_Name AS 'Tên sản phẩm', " +
            "    PD.Price AS 'Giá nhập', " +
            "    PD.Price_Discount AS 'Giá bán', " +
            "    P.Manufacture_Date AS 'Ngày sản xuất', " +
            "    P.Create_At AS 'Ngày thêm', " +
            "    P.status AS 'Trạng thái', " +
            "    PD.Quantity_In_Stock AS 'Số lượng tồn', " +
            "    B.Brand_Name AS 'Thương Hiệu' " +
            "FROM Product_Detail AS PD " +
            "INNER JOIN Products AS P ON PD.Product_Id = P.Product_Id " +
            "LEFT JOIN Brand AS B ON P.Brand_Id = B.Brand_Id", nativeQuery = true)
    List<Object[]> findAllInventoryList();

    // Các phương thức truy vấn tùy chỉnh (nếu cần) có thể được thêm vào đây.

    @Query(value = "SELECT d.* FROM Product_Detail d join Products p on d.Product_Id = p.Product_Id " +
            "WHERE p.Status = 1", nativeQuery = true)
    List<Product_Detail> findProductsByStatus();
}
