package com.bookworm.estore.dto;

import lombok.Data;
import lombok.Builder;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class CartDto {
    private Long cartId;
    private Long userId;
    private List<CartItemDto> items;
    private BigDecimal total;

    @Data
    @Builder
    public static class CartItemDto {
        private Long cartItemId;
        private Long productId;
        private String title;
        private String author;
        private String imageUrl;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal totalPrice;
        private String deliveryDate;
        private String categoryName;
    }

    @Data
    public static class AddItemRequest {
        private Long productId;
        private Integer quantity;
    }

    @Data
    public static class UpdateItemRequest {
        private Integer quantity;
    }
}
