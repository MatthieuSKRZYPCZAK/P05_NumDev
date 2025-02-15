# Yoga Application - Testing plan

Yoga app is a full-stack application that allows individuals to join or leave
yoga classes while enabling administrators to efficiently plan sessions based
on instructor availability.

This application also serves as a structured testing support, covering unit, integration
 and end-to-end tests to ensure software reliability and performance.


## Table of Contents


1. [Technologies](#technologies)
2. [Installation](#installation)
3. [Running the Application](#running-the-application)

---

## Technologies

### Backend

- **Java 11**
- **Spring Boot (2.6.1)**
- **MySQL**
- **JWT Authentication**
- **JUnit & Mockito**
- **Jacoco (0.8.5)**

### Frontend

- **Angular CLI 14**
- **Jest (28.1.3)**
- **Cypress (10.4.0)**

---

## Prerequisites

**MySQL**: Install MySQL.

---

## Installation

### 1. MySQL database

To set up the MySQL database required for this application, you need to:
1. Install MySQL on your system.
2. Create a database, user and password for this application.

For detailed instructions on how to configure MySQL, refer to the [MySQL Setup Guide](MYSQLREADME.md)

3. A database initialization script is provided in `resources/sql/script.sql` to set up the schema.
4. Ensure that the database connection settings in the `application.properties` file of the backend are properly configured.

```
spring.datasource.url=jdbc:mysql://localhost:3306/db_name
spring.datasource.username=db_user
spring.datasource.password=db_password
```

## Clone the Repository

First, clone the project repository from GitHub to your local machine:

```
git clone https://github.com/MatthieuSKRZYPCZAK/P05_NumDev.git
```


