package com.greenhouse.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.greenhouse.model.Product_Flash_Sale;

public interface Product_FlashSaleRepository extends JpaRepository<Product_Flash_Sale, Integer> {
    // Bạn có thể thêm các phương thức truy vấn tùy chỉnh ở đây nếu cần.
    @Query(value = "SELECT * FROM Product_Flash_Sale WHERE Flash_Sale_Id = ?1", nativeQuery = true)
    List<Product_Flash_Sale> findByProductFSId(Integer id);

}
