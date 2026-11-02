package com.bookworm.estore.controller;

import com.bookworm.estore.dto.ProductDto;
import com.bookworm.estore.entity.Category;
import com.bookworm.estore.service.CatalogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Catalog", description = "Browse books and categories")
public class CatalogController {

    private final CatalogService catalogService;

    @GetMapping("/categories")
    @Operation(summary = "Get all categories")
    public ResponseEntity<List<Category>> getCategories() {
        return ResponseEntity.ok(catalogService.getAllCategories());
    }

    @GetMapping("/products")
    @Operation(summary = "Get products (optionally filtered by category or keyword)")
    public ResponseEntity<Page<ProductDto>> getProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        if (keyword != null && !keyword.isBlank()) {
            return ResponseEntity.ok(catalogService.searchProducts(keyword, page, size));
        }
        if (categoryId != null) {
            return ResponseEntity.ok(catalogService.getProductsByCategory(categoryId, page, size));
        }
        return ResponseEntity.ok(catalogService.searchProducts("", page, size));
    }

    @GetMapping("/products/{id}")
    @Operation(summary = "Get product details by ID")
    public ResponseEntity<ProductDto> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(catalogService.getProductById(id));
    }

    @GetMapping("/products/{id}/related")
    @Operation(summary = "Get related products")
    public ResponseEntity<List<ProductDto>> getRelated(@PathVariable Long id) {
        return ResponseEntity.ok(catalogService.getRelatedProducts(id));
    }

    @GetMapping("/products/featured")
    public ResponseEntity<List<ProductDto>> getFeatured() {
        return ResponseEntity.ok(catalogService.getFeaturedProducts());
    }

    @GetMapping("/products/new-launches")
    public ResponseEntity<List<ProductDto>> getNewLaunches() {
        return ResponseEntity.ok(catalogService.getNewLaunches());
    }

    @GetMapping("/products/bestsellers")
    public ResponseEntity<List<ProductDto>> getBestsellers() {
        return ResponseEntity.ok(catalogService.getBestsellers());
    }

    @PostMapping("/products/{id}/reviews")
    @Operation(summary = "Add a review to a product")
    public ResponseEntity<ProductDto> addReview(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body,
            Authentication auth) {
        String content = (String) body.get("content");
        Integer rating = (Integer) body.get("rating");
        return ResponseEntity.ok(catalogService.addReview(id, auth.getName(), content, rating));
    }
}
