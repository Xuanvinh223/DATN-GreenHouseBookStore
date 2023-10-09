package com.greenhouse.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.greenhouse.model.Accounts;

public interface AccountRepository extends JpaRepository<Accounts, String> {
    Accounts findByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByEmail(String username);

    boolean existsByPhone(String username);

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

}
