package com.bookworm.estore.controller;

import com.bookworm.estore.dto.OrderDto;
import com.bookworm.estore.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Tag(name = "Orders", description = "Order management")
@SecurityRequirement(name = "bearerAuth")
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/checkout")
    @Operation(summary = "Checkout and place order")
    public ResponseEntity<OrderDto.OrderResponse> checkout(
            @RequestBody OrderDto.CheckoutRequest request,
            Authentication auth) {
        return ResponseEntity.ok(orderService.checkout(auth.getName(), request));
    }

    @GetMapping("/history")
    @Operation(summary = "Get order history")
    public ResponseEntity<List<OrderDto.OrderResponse>> getHistory(Authentication auth) {
        return ResponseEntity.ok(orderService.getOrderHistory(auth.getName()));
    }

    @PutMapping("/{orderId}/cancel")
    @Operation(summary = "Cancel order (within 48 hours)")
    public ResponseEntity<OrderDto.OrderResponse> cancelOrder(
            @PathVariable Long orderId,
            Authentication auth) {
        return ResponseEntity.ok(orderService.cancelOrder(orderId, auth.getName()));
    }
}
