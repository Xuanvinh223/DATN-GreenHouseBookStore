package com.greenhouse.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.greenhouse.model.Accounts;


public interface AccountRepository extends JpaRepository<Accounts, String> {
    Accounts findByUsername(String username);

    Accounts findByEmail(String username);

    Accounts findByPhone(String username);

    Accounts findByUsernameAndEmail(String username, String email);

    Accounts findByUsernameOrEmailOrPhone(String username, String email, String phone);

    boolean existsByUsernameAndActiveIsTrue(String username);

    boolean existsByEmailAndActiveIsTrue(String email);

    boolean existsByPhone(String phone);

    boolean existsByEmail(String email);

    @Query(value = "SELECT COUNT(o.Order_Id) FROM Orders o " +
            "JOIN Order_Mapping_Status m ON o.Order_Id = m.Order_Id " +
            "JOIN Order_Status s ON s.Status_Id = m.Status_Id " +
            "WHERE s.Status_Id = 3", nativeQuery = true)
    int countOrdersWithStatus();

    @Query(value = "SELECT  COUNT(*) AS UsersCount " +
            "FROM Accounts " +
            "WHERE YEAR(Create_At) = YEAR(GETDATE()) AND Active = 1 " +
            "GROUP BY YEAR(Create_At)", nativeQuery = true)
    long countActiveUsersByYear();

    @Query(value = "SELECT COUNT(*) AS UsersCount " +
            "FROM Accounts " +
            "WHERE YEAR(Create_At) = YEAR(GETDATE()) - 1 AND Active = 1 " +
            "GROUP BY YEAR(Create_At)", nativeQuery = true)
    long countActiveUsersByPreviousYear();

    List<Accounts> findByDeletedByIsNullAndDeletedAtIsNull();

}
