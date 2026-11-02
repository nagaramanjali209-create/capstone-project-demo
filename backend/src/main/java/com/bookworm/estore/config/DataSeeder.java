package com.bookworm.estore.config;

import com.bookworm.estore.entity.*;
import com.bookworm.estore.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (categoryRepository.count() > 0) return;

        // Categories
        Category romance = save(cat("Romance", "Romantic fiction books"));
        Category mystery = save(cat("Mystery", "Mystery and thriller books"));
        Category sciFi = save(cat("Science Fiction", "Sci-Fi and fantasy books"));
        Category nonFiction = save(cat("Non-Fiction", "Self-help and educational books"));
        Category selfHelp = save(cat("Self-Help", "Personal development books"));
        Category fantasy = save(cat("Fantasy", "Fantasy adventure books"));
        Category historical = save(cat("Historical", "Historical fiction"));
        Category biography = save(cat("Biography", "Biographies and memoirs"));
        Category cooking = save(cat("Cooking", "Cooking and recipes"));
        Category children = save(cat("Children's", "Books for children"));
        Category youngAdult = save(cat("Young Adult", "Young adult fiction"));
        Category comics = save(cat("Comics & Graphic Novels", "Graphic novels and comics"));
        Category poetry = save(cat("Poetry", "Poetry collections"));
        Category drama = save(cat("Drama", "Drama and plays"));
        Category science = save(cat("Science", "Science books"));
        Category philosophy = save(cat("Philosophy", "Philosophy books"));
        Category religion = save(cat("Religion", "Religion and spirituality"));
        Category language = save(cat("Language Learning", "Language learning books"));

        // Books seed data
        productRepository.saveAll(List.of(
            book("The Art of Focus", "Arjun Patel",
                "Practical guide to mastering focus & boosting productivity every day.",
                new BigDecimal("399"), selfHelp, "https://covers.openlibrary.org/b/id/8739161-L.jpg",
                4.5, true, false, false, "Mon, 21 Jul"),
            book("The Art of Learning", "Raj Patel",
                "Master the mindset and methods for effective lifelong learning.",
                new BigDecimal("259"), nonFiction, "https://covers.openlibrary.org/b/id/8226191-L.jpg",
                4.3, true, false, false, "Mon, 21 Jul"),
            book("The Path to Success", "James Wright",
                "A practical guide to achieving goals with clarity and confidence.",
                new BigDecimal("359"), selfHelp, "https://covers.openlibrary.org/b/id/8091016-L.jpg",
                4.6, true, false, false, "Mon, 21 Jul"),
            book("The Midnight Hour", "James Adams",
                "Haunting tale of a man's journey & the shadows of a forgotten past.",
                new BigDecimal("299"), mystery, "https://covers.openlibrary.org/b/id/9255566-L.jpg",
                4.2, false, true, false, "Mon, 21 Jul"),
            book("Beneath the Stars", "Jessica Martin",
                "A heartwarming tale where two souls discover who they need.",
                new BigDecimal("499"), romance, "https://covers.openlibrary.org/b/id/10527843-L.jpg",
                4.4, false, true, false, "Mon, 21 Jul"),
            book("The Final Frontier", "Laura Mitchell",
                "A mission to space secrets to change humanity forever.",
                new BigDecimal("359"), sciFi, "https://covers.openlibrary.org/b/id/9255457-L.jpg",
                4.1, false, true, false, "Mon, 21 Jul"),
            book("Joy of Minimalism", "Daniel Reed",
                "Declutter your life to uncover peace, clarity, and joy.",
                new BigDecimal("149"), selfHelp, "https://covers.openlibrary.org/b/id/8739882-L.jpg",
                4.7, false, false, true, "Mon, 21 Jul"),
            book("The Vanishing House", "Clara Nelson",
                "A chilling mystery unfolds within a house that disappears.",
                new BigDecimal("99"), mystery, "https://covers.openlibrary.org/b/id/8224661-L.jpg",
                4.0, false, false, true, "Mon, 21 Jul"),
            book("The Lost Kitten", "Emily Parker",
                "A heartwarming tale of courage, friendship, and feline adventure.",
                new BigDecimal("339"), children, "https://covers.openlibrary.org/b/id/8091016-L.jpg",
                4.8, false, false, true, "Mon, 21 Jul"),
            book("Cosmos Unraveled", "Neil Patel",
                "An exploration of the universe's deepest mysteries.",
                new BigDecimal("449"), science, null, 4.5, false, true, false, "Mon, 21 Jul"),
            book("Dragon's Lair", "Sophie Turner",
                "A young hero battles ancient dragons in a magical realm.",
                new BigDecimal("279"), fantasy, null, 4.3, true, false, false, "Mon, 21 Jul"),
            book("The Great Recipe", "Chef Marco",
                "300 delicious recipes from around the world.",
                new BigDecimal("599"), cooking, null, 4.6, false, false, true, "Mon, 21 Jul")
        ));

        // Seed admin user
        if (!userRepository.existsByEmail("admin@bookworm.com")) {
            User admin = User.builder()
                    .email("admin@bookworm.com")
                    .password(passwordEncoder.encode("admin123"))
                    .firstName("Admin")
                    .lastName("User")
                    .role(User.Role.ADMIN)
                    .build();
            userRepository.save(admin);
            cartRepository.save(Cart.builder().user(admin).build());
        }

        // Seed demo user
        if (!userRepository.existsByEmail("demo@bookworm.com")) {
            User demo = User.builder()
                    .email("demo@bookworm.com")
                    .password(passwordEncoder.encode("demo123"))
                    .firstName("Demo")
                    .lastName("User")
                    .giftPoints(250)
                    .build();
            userRepository.save(demo);
            cartRepository.save(Cart.builder().user(demo).build());
        }

        System.out.println("✅ Seed data loaded successfully.");
    }

    private Category save(Category c) { return categoryRepository.save(c); }

    private Category cat(String name, String desc) {
        return Category.builder().name(name).description(desc).build();
    }

    private Product book(String title, String author, String desc, BigDecimal price,
                         Category cat, String img, double rating,
                         boolean featured, boolean bestseller, boolean newLaunch, String delivery) {
        return Product.builder()
                .title(title).author(author).description(desc).price(price)
                .category(cat).imageUrl(img).rating(rating)
                .isFeatured(featured).isBestseller(bestseller).isNewLaunch(newLaunch)
                .deliveryDate(delivery).language("English").format(Product.Format.PAPERBACK)
                .stock(100).salesCount((int)(Math.random() * 1000))
                .build();
    }
}
