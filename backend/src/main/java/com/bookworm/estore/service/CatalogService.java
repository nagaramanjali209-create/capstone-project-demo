package com.bookworm.estore.service;

import com.bookworm.estore.dto.ProductDto;
import com.bookworm.estore.entity.Category;
import com.bookworm.estore.entity.Product;
import com.bookworm.estore.entity.Review;
import com.bookworm.estore.repository.CategoryRepository;
import com.bookworm.estore.repository.ProductRepository;
import com.bookworm.estore.repository.ReviewRepository;
import com.bookworm.estore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CatalogService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Page<ProductDto> getProductsByCategory(Long categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findByCategoryId(categoryId, pageable).map(this::toDto);
    }

    public Page<ProductDto> searchProducts(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.searchByKeyword(keyword, pageable).map(this::toDto);
    }

    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found: " + id));
        return toDto(product);
    }

    public List<ProductDto> getFeaturedProducts() {
        return productRepository.findByIsFeaturedTrue().stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<ProductDto> getNewLaunches() {
        return productRepository.findByIsNewLaunchTrue().stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<ProductDto> getBestsellers() {
        return productRepository.findByIsBestsellerTrue().stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<ProductDto> getRelatedProducts(Long productId) {
        Product p = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return productRepository.findByCategoryIdAndIdNot(p.getCategory().getId(), productId)
                .stream().limit(4).map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public ProductDto addReview(Long productId, String userEmail, String content, Integer rating) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        var user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Review review = Review.builder()
                .product(product)
                .user(user)
                .reviewerName(user.getFirstName() + " " + (user.getLastName() != null ? user.getLastName() : ""))
                .content(content)
                .rating(rating)
                .build();
        reviewRepository.save(review);
        // Update product rating
        List<Review> reviews = reviewRepository.findByProductId(productId);
        double avg = reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
        product.setRating(Math.round(avg * 10.0) / 10.0);
        product.setReviewCount(reviews.size());
        productRepository.save(product);
        return toDto(product);
    }

    public ProductDto toDto(Product p) {
        List<ProductDto.ReviewDto> reviewDtos = reviewRepository.findByProductId(p.getId())
                .stream().map(r -> ProductDto.ReviewDto.builder()
                        .id(r.getId())
                        .reviewerName(r.getReviewerName())
                        .content(r.getContent())
                        .rating(r.getRating())
                        .createdAt(r.getCreatedAt().toString())
                        .build())
                .collect(Collectors.toList());

        return ProductDto.builder()
                .id(p.getId())
                .title(p.getTitle())
                .author(p.getAuthor())
                .description(p.getDescription())
                .price(p.getPrice())
                .isbn(p.getIsbn())
                .publisher(p.getPublisher())
                .language(p.getLanguage())
                .format(p.getFormat())
                .imageUrl(p.getImageUrl())
                .stock(p.getStock())
                .rating(p.getRating())
                .reviewCount(p.getReviewCount())
                .salesCount(p.getSalesCount())
                .categoryId(p.getCategory() != null ? p.getCategory().getId() : null)
                .categoryName(p.getCategory() != null ? p.getCategory().getName() : null)
                .deliveryDate(p.getDeliveryDate())
                .isFeatured(p.getIsFeatured())
                .isNewLaunch(p.getIsNewLaunch())
                .isBestseller(p.getIsBestseller())
                .reviews(reviewDtos)
                .build();
    }
}
