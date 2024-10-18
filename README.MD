# User Management System

## Overview

This application is a web-based user management system built with Node.js, Express, and MySQL. It allows users to register, log in, and manage their profiles while providing an interface to view a list of users. User passwords are securely hashed using bcrypt, and data integrity is maintained through foreign key relationships between tables.

## Features

- **User Registration:** Users can sign up with an email and password.
- **Secure Login:** Users can log in using their registered credentials.
- **Session Management:** User sessions are maintained using `express-session` to keep users logged in.
- **Data Management:** Users can add, edit, and delete their profiles.
- **Dynamic User List:** A list of all users is displayed with the ability to delete or edit entries.
- **Color Picker:** Users can select a favorite color using a color input field, which is stored in the database.
- **Error Handling:** The application includes error handling for invalid login attempts, signup errors, and data submission issues.
- **EJS Templating:** The application uses EJS for rendering dynamic HTML views.

## Technologies Used

- **Node.js:** JavaScript runtime for building the server.
- **Express:** Web framework for Node.js to handle routing and middleware.
- **MySQL:** Database for storing user and profile information.
- **bcrypt:** Library for hashing passwords securely.
- **express-session:** Middleware for session management.
- **EJS:** Templating engine for rendering HTML views.

## Prerequisites

- Node.js installed on your machine.
- MySQL server installed and running.
- A MySQL database named `user_data` with the following tables:

### MySQL Table Structure

To create the necessary tables, run the following SQL commands:

```sql
CREATE TABLE user_data (
    id1 INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE user_d (
    id INT AUTO_INCREMENT PRIMARY KEY,
    NAME VARCHAR(255),
    ADRESS VARCHAR(255),
    EMAIL VARCHAR(255),
    gender VARCHAR(50),
    comment TEXT,
    subject VARCHAR(255),
    capacity INT,
    programing_language VARCHAR(255),
    bike BOOLEAN,
    car BOOLEAN,
    h_both BOOLEAN,
    fav_color VARCHAR(7),
    birthday DATE,
    month_ofJoin VARCHAR(50),
    Quantity_ofC INT,
    phon_number VARCHAR(20),
    id1 INT,
    FOREIGN KEY (id1) REFERENCES user_data(id1)
);
