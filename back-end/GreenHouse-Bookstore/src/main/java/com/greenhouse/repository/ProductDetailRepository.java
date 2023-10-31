package com.greenhouse.repository;

import com.greenhouse.model.Product_Detail;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductDetailRepository extends JpaRepository<Product_Detail, Integer> {
    // @Query(value = "SELECT " +
    // " PD.Product_Detail_Id AS ID, " +
    // " P.Product_Name AS 'Tên sản phẩm', " +
    // " PD.Price AS 'Giá nhập', " +
    // " PD.Price_Discount AS 'Giá bán', " +
    // " P.Manufacture_Date AS 'Ngày sản xuất', " +
    // " P.Create_At AS 'Ngày thêm', " +
    // " P.status AS 'Trạng thái', " +
    // " PD.Quantity_In_Stock AS 'Số lượng tồn', " +
    // " B.Brand_Name AS 'Thương Hiệu' " +
    // "FROM Product_Detail AS PD " +
    // "INNER JOIN Products AS P ON PD.Product_Id = P.Product_Id " +
    // "LEFT JOIN Brands AS B ON P.Brand_Id = B.Brand_Id", nativeQuery = true)
    // List<Object[]> findAllInventoryList();
    @Query(value = "SELECT " +
            "    p.Product_Id AS ID, " +
            "    p.Product_Name AS 'Tên sản phẩm', " +
            "    pd.Quantity_In_Stock AS 'Số lượng tồn kho', " +
            "    pd.Price AS 'Giá nhập', " + // Sửa tên cột từ "Giá bán" thành "Giá nhập"
            "    p.Status AS 'Trạng thái tồn kho', " +
            "    b.Brand_Name AS 'Tên thương hiệu', " +
            "    p.Manufacture_Date AS 'Ngày sản xuất' " +
            "FROM Products p " +
            "INNER JOIN Product_Detail pd ON p.Product_Id = pd.Product_Id " +
            "INNER JOIN Brands b ON p.Brand_Id = b.Brand_Id", nativeQuery = true)
        List<Object[]> findAllInventoryList();

        // Các phương thức truy vấn tùy chỉnh (nếu cần) có thể được thêm vào đây.
        @Query(value = "SELECT " +
                "    p.Product_Id AS ID, " +
                "    p.Product_Name AS 'Tên sản phẩm', " +
                "    pd.Quantity_In_Stock AS 'Số lượng tồn kho', " +
                "    pd.Price AS 'Giá nhập', " +
                "    p.Status AS 'Trạng thái tồn kho', " +
                "    b.Brand_Name AS 'Tên thương hiệu', " +
                "    p.Manufacture_Date AS 'Ngày sản xuất' " +
                "FROM Products p " +
                "INNER JOIN Product_Detail pd ON p.Product_Id = pd.Product_Id " +
                "INNER JOIN Brands b ON p.Brand_Id = b.Brand_Id " +
                "ORDER BY pd.Quantity_In_Stock DESC", nativeQuery = true)
        List<Object[]> findAllInventoryListDesc();

    // @Query(value = "SELECT p.Product_Id, p.Product_Name, pd.Image, id.Quantity AS
    // Quantity_Invoice, pd.Price AS Product_Price, pd.Price_Discount AS
    // Product_Discount, id.Amount "
    // +
    // "FROM Product_Detail AS pd " +
    // "JOIN Products AS p ON pd.Product_Id = p.Product_Id " +
    // "JOIN Invoice_Details AS id ON pd.Product_Detail_Id = id.Product_Detail_Id "
    // +
    // "WHERE id.Invoice_Id = :id", nativeQuery = true)
    // List<Object[]> getInvoiceDetails(@Param("id") Integer id);

    // @Query(value = "SELECT d.* FROM Product_Detail d join Products p on
    // d.Product_Id = p.Product_Id " +
    // "WHERE p.Status = 1", nativeQuery = true)
    // List<Product_Detail> findProductsByStatus();

    @Query(value = "SELECT p.Product_Id, p.Product_Name, pd.Image, id.Quantity AS Quantity_Invoice, pd.Price AS Product_Price, pd.Price_Discount AS Product_Discount, id.Amount "
            +
            "FROM Product_Detail AS pd " +
            "JOIN Products AS p ON pd.Product_Id = p.Product_Id " +
            "JOIN Invoice_Details AS id ON pd.Product_Detail_Id = id.Product_Detail_Id " +
            "WHERE id.Invoice_Id = :id", nativeQuery = true)
    List<Object[]> getInvoiceDetails(@Param("id") Integer id);

    @Query(value = "SELECT d.* FROM Product_Detail d join Products p on d.Product_Id = p.Product_Id " +
            "WHERE p.Status = 1", nativeQuery = true)
    List<Product_Detail> findProductsByStatus();

    @Query(value = "SELECT p.Product_Id, p.Product_Name, pd.Quantity_In_Stock AS Stock_Quantity, " +
            "SUM(id.Quantity) AS Total_Sold_Quantity, AVG(pr.Star) AS Average_Rating, " +
            "COALESCE((SELECT COUNT(Review_Id) FROM Product_Reviews r WHERE r.Product_Id = p.Product_Id), 0) AS ReviewCount "
            +
            "FROM Products p " +
            "INNER JOIN Product_Detail pd ON p.Product_Id = pd.Product_Id " +
            "LEFT JOIN Invoice_Details id ON pd.Product_Detail_Id = id.Product_Detail_Id " +
            "LEFT JOIN Product_Reviews pr ON p.Product_Id = pr.Product_Id " +
            "GROUP BY p.Product_Id, p.Product_Name, pd.Quantity_In_Stock " +
            "HAVING SUM(id.Quantity) > 0 " +
            "ORDER BY Total_Sold_Quantity DESC, Average_Rating DESC", nativeQuery = true)
    List<Object[]> getBestSellingProducts();

}
