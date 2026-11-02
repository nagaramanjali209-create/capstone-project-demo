package com.bookworm.estore.dto;

import com.bookworm.estore.entity.Product;
import lombok.Data;
import lombok.Builder;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class ProductDto {
    private Long id;
    private String title;
    private String author;
    private String description;
    private BigDecimal price;
    private String isbn;
    private String publisher;
    private String language;
    private Product.Format format;
    private String imageUrl;
    private Integer stock;
    private Double rating;
    private Integer reviewCount;
    private Integer salesCount;
    private Long categoryId;
    private String categoryName;
    private String deliveryDate;
    private Boolean isFeatured;
    private Boolean isNewLaunch;
    private Boolean isBestseller;
    private List<ReviewDto> reviews;

    @Data
    @Builder
    public static class ReviewDto {
        private Long id;
        private String reviewerName;
        private String content;
        private Integer rating;
        private String createdAt;
    }
}
