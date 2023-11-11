package com.greenhouse.repository;

import com.greenhouse.model.Product_Detail;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductDetailRepository extends JpaRepository<Product_Detail, Integer> {
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
            "ORDER BY pd.Quantity_In_Stock ASC", nativeQuery = true)
    List<Object[]> findAllInventoryListAsc();

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

    @Query(value = "SELECT \r\n" + //
            "\tp.Product_Id, \r\n" + //
            "    p.Product_Name, \r\n" + //
            "    pd.Product_Detail_Id,\r\n" + //
            "    pd.Quantity_In_Stock AS Stock_Quantity, \r\n" + //
            "    SUM(id.Quantity) AS Total_Sold_Quantity, \r\n" + //
            "    AVG(pr.Star) AS Average_Rating,  \r\n" + //
            "    COALESCE((SELECT COUNT(Review_Id) FROM Product_Reviews r WHERE r.Product_Detail_Id = pd.Product_Detail_Id), 0) AS ReviewCount \r\n"
            + //
            "FROM Products p  \r\n" + //
            "INNER JOIN Product_Detail pd ON p.Product_Id = pd.Product_Id  \r\n" + //
            "LEFT JOIN Invoice_Details id ON pd.Product_Detail_Id = id.Product_Detail_Id  \r\n" + //
            "LEFT JOIN Product_Reviews pr ON pd.Product_Detail_Id = pr.Product_Detail_Id  \r\n" + //
            "GROUP BY p.Product_Id, p.Product_Name, pd.Product_Detail_Id, pd.Quantity_In_Stock  \r\n" + //
            "HAVING SUM(id.Quantity) > 0  \r\n" + //
            "ORDER BY Total_Sold_Quantity DESC, Average_Rating DESC", nativeQuery = true)
    List<Object[]> getBestSellingProducts();

    List<Product_Detail> findProductDetailsByProduct_Brand_BrandId(String brandId);

    @Query(value = "SELECT d.* FROM Product_Detail d " +
            "JOIN Products p ON d.Product_Id = p.Product_Id " +
            "JOIN Product_Category c ON p.Product_Id = c.Product_Id " +
            "WHERE c.Category_Id IN " +
            "(SELECT Category_Id FROM Product_Category WHERE Product_Id = " +
            "(SELECT Product_Id FROM Product_Detail WHERE Product_Detail_Id = ?1)) " +
            " AND d.Product_Detail_Id <> ?1", nativeQuery = true)
    List<Product_Detail> findRelatedProducts(int productDetailId);

    @Query(value = "SELECT pd.* " +
            "FROM Product_Category pc " +
            "INNER JOIN Products p ON pc.Product_Id = p.Product_Id " +
            "INNER JOIN Product_Detail pd ON p.Product_Id = pd.Product_Id " +
            "WHERE pc.Category_Id = :categoryId", nativeQuery = true)
    List<Product_Detail> findAllCate(@Param("categoryId") String categoryId);

    @Query("SELECT pd FROM Product_Detail pd " +
            "JOIN pd.product p " +
            "WHERE p.brand.brandId = :brandId")
    List<Product_Detail> findProductDetailsByBrandId(@Param("brandId") String brandId);

    @Query(value = "SELECT d.* FROM Product_Detail " +
            " d JOIN Products p ON d.Product_Id= p.Product_Id JOIN " +
            " Product_Category c ON p.Product_Id=  c.Product_Id where c.Category_Id=:categoryId " +
            " and p.Brand_Id=:brandId", nativeQuery = true)
    List<Product_Detail> findProductDetailsByCategoryAndBrand(
            @Param("categoryId") String categoryId,
            @Param("brandId") String brandId);

    @Query(value = "SELECT TOP 10   d.* " +
            " FROM Product_Detail d " +
            "JOIN Invoice_Details id ON d.Product_Detail_Id = id.Product_Detail_Id " +
            " GROUP BY d.[Product_Id],d.Image,d.Price,d.Price_Discount,d.Product_Detail_Id,d.Quantity_In_Stock, "
            +
            " d.Weight ORDER BY SUM(id.Quantity) DESC; ", nativeQuery = true)
    List<Product_Detail> SellingProduct();
}
