package com.bookworm.estore.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String author;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    private String isbn;

    private String publisher;

    private String language;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Format format = Format.PAPERBACK;

    private String imageUrl;

    @Builder.Default
    private Integer stock = 100;

    @Builder.Default
    private Double rating = 0.0;

    @Builder.Default
    private Integer reviewCount = 0;

    @Builder.Default
    private Integer salesCount = 0;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    private String deliveryDate;

    @Builder.Default
    private Boolean isFeatured = false;

    @Builder.Default
    private Boolean isNewLaunch = false;

    @Builder.Default
    private Boolean isBestseller = false;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<Review> reviews;

    public enum Format {
        PAPERBACK, HARDCOVER, EBOOK, AUDIOBOOK
    }
}
