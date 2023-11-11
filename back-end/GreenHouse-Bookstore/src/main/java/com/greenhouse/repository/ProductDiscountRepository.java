package com.greenhouse.repository;

import com.greenhouse.model.Product_Detail;
import com.greenhouse.model.Product_Discount;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductDiscountRepository extends JpaRepository<Product_Discount, Integer> {
    // Các phương thức truy vấn tùy chỉnh (nếu cần) có thể được thêm vào đây.
    @Query("SELECT pdisc FROM Product_Discount pdisc " +
            "JOIN pdisc.discount d " +
            "JOIN pdisc.productDetail pd " +
            "WHERE pd.productDetailId = :productDetailId " +
            "AND d.startDate <= CURRENT_DATE " +
            "AND d.endDate >= CURRENT_DATE")
    List<Product_Discount> findProductDiscountsByProductDetailIdAndDate(@Param("productDetailId") int productDetailId);

    @Query("SELECT pdisc FROM Product_Discount pdisc " +
            "JOIN pdisc.discount d " +
            "WHERE d.startDate <= CURRENT_DATE " +
            "AND d.endDate >= CURRENT_DATE")
    List<Product_Discount> findProductDiscountsByDate();

}
