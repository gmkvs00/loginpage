# Login Page Application

## Overview

This application is a simple login and signup system built with Node.js, Express, and MySQL. It allows users to create an account, log in, and access a dashboard page. Passwords are securely hashed using bcrypt to ensure user data is protected.

## Features

- **User Registration:** Users can sign up with an email and password.
- **Secure Login:** Users can log in to the application using their registered credentials.
- **Session Management:** User sessions are maintained using `express-session` to keep users logged in.
- **Error Handling:** The application includes error handling for invalid login attempts and signup errors.
- **EJS Templating:** The application uses EJS for rendering dynamic HTML views.

## Technologies Used

- **Node.js:** JavaScript runtime for building the server.
- **Express:** Web framework for Node.js to handle routing and middleware.
- **MySQL:** Database for storing user information.
- **bcrypt:** Library for hashing passwords securely.
- **express-session:** Middleware for session management.
- **EJS:** Templating engine for rendering HTML views.

## Prerequisites

- Node.js installed on your machine.
- MySQL server installed and running.
- A MySQL database named `user_data` with a table to store user credentials.

### MySQL Table Structure

Before running the application, ensure that your MySQL database has the following table structure:

```sql
CREATE TABLE user_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);
