-- Create Database
CREATE DATABASE IF NOT EXISTS `trip_canvas`;
USE `trip_canvas`;

-- Drop tables if they exist (clean setup)
DROP TABLE IF EXISTS `media`;
DROP TABLE IF EXISTS `blog_tags`;
DROP TABLE IF EXISTS `blogs`;
DROP TABLE IF EXISTS `tags`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `users`;

-- Create tables
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'author', 'user') NOT NULL DEFAULT 'user',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(191) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `tags` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(191) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `blogs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(191) NOT NULL UNIQUE,
  `content` TEXT NOT NULL,
  `category_id` INT NOT NULL,
  `author_id` INT NOT NULL,
  `status` ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `blog_tags` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `blog_id` INT NOT NULL,
  `tag_id` INT NOT NULL,
  UNIQUE KEY `blog_tag_unique` (`blog_id`, `tag_id`),
  FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `media` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `blog_id` INT NOT NULL,
  `file_url` TEXT NOT NULL,
  `file_type` ENUM('image', 'video') NOT NULL DEFAULT 'image',
  `file_name` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Seed Users
-- Passwords:
-- admin@example.com -> Admin123 (hashed: 8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918)
-- author@example.com -> Author123 (hashed: e6ca3a479ff737fb277852f8de3860bb4787a7187ad39999052d9a6c9e9007bf)
-- writer@example.com -> Writer123 (hashed: 63f733190ab7a224f46f3a61d157dfbfbbbf88ef050aa59d28ee8d8d38864700)
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `created_at`) VALUES
(1, 'Admin User', 'admin@example.com', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'admin', '2026-01-01 10:00:00'),
(2, 'Jane Doe', 'author@example.com', 'e6ca3a479ff737fb277852f8de3860bb4787a7187ad39999052d9a6c9e9007bf', 'author', '2026-01-10 12:00:00'),
(3, 'John Smith', 'writer@example.com', '63f733190ab7a224f46f3a61d157dfbfbbbf88ef050aa59d28ee8d8d38864700', 'author', '2026-01-15 14:30:00');

-- Insert Seed Categories
INSERT INTO `categories` (`id`, `name`, `slug`) VALUES
(1, 'Travel', 'travel'),
(2, 'Technology', 'technology'),
(3, 'Lifestyle', 'lifestyle'),
(4, 'Design', 'design');

-- Insert Seed Tags
INSERT INTO `tags` (`id`, `name`, `slug`) VALUES
(1, 'Adventure', 'adventure'),
(2, 'Wanderlust', 'wanderlust'),
(3, 'Coding', 'coding'),
(4, 'Next.js', 'nextjs'),
(5, 'Minimalist', 'minimalist'),
(6, 'Productivity', 'productivity');


