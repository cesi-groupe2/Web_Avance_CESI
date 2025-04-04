-- Création de la base
CREATE DATABASE IF NOT EXISTS easeat;

USE easeat;

-- ROLES
CREATE TABLE roles (
    id_role INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- USERS
CREATE TABLE users (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    profil_picture TEXT,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivery_adress TEXT,
    facturation_adress TEXT,
    id_role INT,
    sponsorship_code VARCHAR(50),
    already_sponsored BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_user_role FOREIGN KEY (id_role) REFERENCES roles (id_role)
);

-- RESTAURANTS
CREATE TABLE restaurants (
    id_restaurant INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    picture TEXT,
    localisation_latitude DECIMAL(9, 6),
    localisation_longitude DECIMAL(9, 6),
    phone VARCHAR(20),
    opening_hours JSON
);

-- MENUITEMS
CREATE TABLE menuitems (
    id_menu_item INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_restaurant INT NOT NULL,
    CONSTRAINT fk_menuitem_restaurant FOREIGN KEY (id_restaurant) REFERENCES restaurants (id_restaurant)
);

-- POSSEDER (relation USER - RESTAURANT)
CREATE TABLE posseder (
    id_user INT NOT NULL,
    id_restaurant INT NOT NULL,
    PRIMARY KEY (id_user, id_restaurant),
    CONSTRAINT fk_posseder_user FOREIGN KEY (id_user) REFERENCES users (id_user),
    CONSTRAINT fk_posseder_restaurant FOREIGN KEY (id_restaurant) REFERENCES restaurants (id_restaurant)
);

-- ------------------------
-- INSERT ROLES
-- ------------------------
INSERT INTO roles (name) VALUES
('CLIENT'),
('RESTAURANT'),
('DELIVERER');