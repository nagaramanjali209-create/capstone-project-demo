package com.bookworm.estore.service;

import com.bookworm.estore.dto.CartDto;
import com.bookworm.estore.entity.*;
import com.bookworm.estore.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartDto getCart(String userEmail) {
        User user = getUser(userEmail);
        Cart cart = getOrCreateCart(user);
        return toDto(cart);
    }

    @Transactional
    public CartDto addItem(String userEmail, CartDto.AddItemRequest request) {
        User user = getUser(userEmail);
        Cart cart = getOrCreateCart(user);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Optional<CartItem> existing = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(product.getId()))
                .findFirst();

        if (existing.isPresent()) {
            existing.get().setQuantity(existing.get().getQuantity() + request.getQuantity());
        } else {
            CartItem item = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .unitPrice(product.getPrice())
                    .build();
            cart.getItems().add(item);
        }
        cartRepository.save(cart);
        return toDto(cart);
    }

    @Transactional
    public CartDto updateItem(String userEmail, Long cartItemId, CartDto.UpdateItemRequest request) {
        User user = getUser(userEmail);
        Cart cart = getOrCreateCart(user);
        cart.getItems().stream()
                .filter(i -> i.getId().equals(cartItemId))
                .findFirst()
                .ifPresent(i -> {
                    if (request.getQuantity() <= 0) {
                        cart.getItems().remove(i);
                    } else {
                        i.setQuantity(request.getQuantity());
                    }
                });
        cartRepository.save(cart);
        return toDto(cart);
    }

    @Transactional
    public CartDto removeItem(String userEmail, Long cartItemId) {
        User user = getUser(userEmail);
        Cart cart = getOrCreateCart(user);
        cart.getItems().removeIf(i -> i.getId().equals(cartItemId));
        cartRepository.save(cart);
        return toDto(cart);
    }

    @Transactional
    public void clearCart(Cart cart) {
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUserId(user.getId()).orElseGet(() -> {
            Cart cart = Cart.builder().user(user).build();
            return cartRepository.save(cart);
        });
    }

    public CartDto toDto(Cart cart) {
        List<CartDto.CartItemDto> items = cart.getItems().stream().map(i -> CartDto.CartItemDto.builder()
                .cartItemId(i.getId())
                .productId(i.getProduct().getId())
                .title(i.getProduct().getTitle())
                .author(i.getProduct().getAuthor())
                .imageUrl(i.getProduct().getImageUrl())
                .quantity(i.getQuantity())
                .unitPrice(i.getUnitPrice())
                .totalPrice(i.getUnitPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .deliveryDate(i.getProduct().getDeliveryDate())
                .categoryName(i.getProduct().getCategory() != null ? i.getProduct().getCategory().getName() : null)
                .build()).collect(Collectors.toList());

        BigDecimal total = items.stream()
                .map(CartDto.CartItemDto::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartDto.builder()
                .cartId(cart.getId())
                .userId(cart.getUser().getId())
                .items(items)
                .total(total)
                .build();
    }
}
