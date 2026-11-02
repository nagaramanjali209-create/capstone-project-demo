package com.bookworm.estore.dto;

import com.bookworm.estore.entity.Payment;
import lombok.Data;
import lombok.Builder;
import java.math.BigDecimal;
import java.util.List;

public class OrderDto {

    @Data
    public static class CheckoutRequest {
        private String firstName;
        private String lastName;
        private String addressLine;
        private String city;
        private String state;
        private String country;
        private String pin;
        private String email;
        private String phoneNumber;
        private String couponCode;
        private Payment.PaymentMethod paymentMethod;
        private String cardNumber;
        private String nameOnCard;
        private String cvv;
        private String expiryDate;
        private String upiId;
    }

    @Data
    @Builder
    public static class OrderResponse {
        private Long orderId;
        private String status;
        private BigDecimal subtotal;
        private BigDecimal tax;
        private BigDecimal discount;
        private BigDecimal deliveryCharges;
        private BigDecimal totalAmount;
        private String paymentStatus;
        private String transactionId;
        private List<OrderItemDto> items;
    }

    @Data
    @Builder
    public static class OrderItemDto {
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
}
