package com.bookworm.estore.service;

import com.bookworm.estore.dto.OrderDto;
import com.bookworm.estore.entity.*;
import com.bookworm.estore.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final CartService cartService;

    @Transactional
    public OrderDto.OrderResponse checkout(String userEmail, OrderDto.CheckoutRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        BigDecimal subtotal = cart.getItems().stream()
                .map(i -> i.getUnitPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal tax = subtotal.multiply(BigDecimal.valueOf(0.12)).setScale(2, java.math.RoundingMode.HALF_UP);
        BigDecimal discount = BigDecimal.ZERO;

        // Coupon logic
        if (request.getCouponCode() != null && request.getCouponCode().equalsIgnoreCase("BOOK10")) {
            discount = BigDecimal.valueOf(100);
        }
        BigDecimal total = subtotal.add(tax).subtract(discount);

        Order order = Order.builder()
                .user(user)
                .subtotal(subtotal)
                .tax(tax)
                .discount(discount)
                .deliveryCharges(BigDecimal.ZERO)
                .totalAmount(total)
                .couponCode(request.getCouponCode())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .addressLine(request.getAddressLine())
                .city(request.getCity())
                .state(request.getState())
                .country(request.getCountry())
                .pin(request.getPin())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .status(Order.OrderStatus.CONFIRMED)
                .build();

        // Create order items from cart
        List<OrderItem> orderItems = cart.getItems().stream().map(ci -> OrderItem.builder()
                .order(order)
                .product(ci.getProduct())
                .quantity(ci.getQuantity())
                .unitPrice(ci.getUnitPrice())
                .totalPrice(ci.getUnitPrice().multiply(BigDecimal.valueOf(ci.getQuantity())))
                .build()).collect(Collectors.toList());
        order.setItems(orderItems);

        // Payment
        Payment payment = Payment.builder()
                .order(order)
                .amount(total)
                .paymentMethod(request.getPaymentMethod())
                .status(Payment.PaymentStatus.SUCCESS)
                .transactionId("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .build();
        order.setPayment(payment);

        Order saved = orderRepository.save(order);

        // Clear cart after order
        cartService.clearCart(cart);

        return buildResponse(saved);
    }

    public List<OrderDto.OrderResponse> getOrderHistory(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream().map(this::buildResponse).collect(Collectors.toList());
    }

    @Transactional
    public OrderDto.OrderResponse cancelOrder(Long orderId, String userEmail) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        if (!order.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized");
        }
        if (order.getCreatedAt().isBefore(LocalDateTime.now().minusHours(48))) {
            throw new RuntimeException("Cannot cancel order after 48 hours");
        }
        order.setStatus(Order.OrderStatus.CANCELLED);
        order.setUpdatedAt(LocalDateTime.now());
        return buildResponse(orderRepository.save(order));
    }

    private OrderDto.OrderResponse buildResponse(Order order) {
        List<OrderDto.OrderItemDto> items = order.getItems().stream().map(i -> OrderDto.OrderItemDto.builder()
                .productId(i.getProduct().getId())
                .title(i.getProduct().getTitle())
                .author(i.getProduct().getAuthor())
                .imageUrl(i.getProduct().getImageUrl())
                .quantity(i.getQuantity())
                .unitPrice(i.getUnitPrice())
                .totalPrice(i.getTotalPrice())
                .deliveryDate(i.getProduct().getDeliveryDate())
                .categoryName(i.getProduct().getCategory() != null ? i.getProduct().getCategory().getName() : null)
                .build()).collect(Collectors.toList());

        return OrderDto.OrderResponse.builder()
                .orderId(order.getId())
                .status(order.getStatus().name())
                .subtotal(order.getSubtotal())
                .tax(order.getTax())
                .discount(order.getDiscount())
                .deliveryCharges(order.getDeliveryCharges())
                .totalAmount(order.getTotalAmount())
                .paymentStatus(order.getPayment() != null ? order.getPayment().getStatus().name() : null)
                .transactionId(order.getPayment() != null ? order.getPayment().getTransactionId() : null)
                .items(items)
                .build();
    }
}
