package com.bookworm.estore.repository;

import com.bookworm.estore.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByCategoryId(Long categoryId, Pageable pageable);

    List<Product> findByCategoryIdAndIdNot(Long categoryId, Long productId);

    List<Product> findByIsFeaturedTrue();

    List<Product> findByIsNewLaunchTrue();

    List<Product> findByIsBestsellerTrue();

    @Query("SELECT p FROM Product p WHERE " +
           "LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.author) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Product> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.category.id = :categoryId ORDER BY p.salesCount DESC")
    List<Product> findTopSellersByCategory(@Param("categoryId") Long categoryId, Pageable pageable);
}
