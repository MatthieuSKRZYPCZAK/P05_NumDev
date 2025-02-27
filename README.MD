# Yoga Application - Testing plan

Yoga app is a full-stack application that allows individuals to join or leave
yoga classes while enabling administrators to efficiently manage sessions based on teacher
availability.

This project also includes a structured testing strategy, covering unit, integration and
end-to-end tests to ensure software reliability and performance.


## Table of Contents


1. [Technologies](#technologies)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Running the Application](#running-the-application)
5. [Executing Tests](#executing-tests)

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

### 2. Clone the Repository

First, clone the project repository from GitHub to your local machine:

```
git clone https://github.com/MatthieuSKRZYPCZAK/P05_NumDev.git
```

#### Backend Installation

Navigate to the backend project folder:
```
cd back
```

Install dependencies:
```
mvn clean install
```

#### Frontend Installation

Navigate to the frontend project folder:
```
cd ..
cd front
```

Install dependencies:
```
npm install
```
---

## Running the Application

### 1. Launch the Backend Server

Navigate to the backend project folder and start the backend server:
```
mvn spring-boot:run
```

The backend application will be accessible at: `http://localhost:8080`

### 2. Launch the Frontend Application

Navigate to the frontend project folder and start frontend application:
```
ng serve
```

The frontend application will be accessible at: `http://localhost:4200`

---

## Executing Tests

### Frontend (Jest)

To run the unit and integration tests for the frontend, navigate to the `front` project folder
and execute:
```
npm run test
```

To generate a test coverage report:
```
npm run test:coverage
```
The coverage report will be generated in the following directory:  `front/coverage/jest/index.html`

You can open this file in a web browser to visualize the test coverage report.

Example of Coverage Report:
![Coverage Report](/ressources/image/jest-test.png)

### End-to-End (Cypress)

To run the end-to-end tests, stay in the `front` project folder and execute:
```
npm run e2e
```

To generate a test coverage report after running the tests, execute:
```
npm run e2e:coverage
```
The coverage report will be generated in the following directory: `front/coverage/lcov-report/index.html`

You can open this file in a web browser to visualize the test coverage report.

Example of Coverage Report:

![Coverage Report](/ressources/image/cypress-test.png)

### Backend (JUnit & Mockito)

To run the unit and integration tests for the backend, navigate to the `back` project folder
and execute:
```
mvn clean test
```
To generate a test coverage report, execute:
```
mvn jacoco:report
```

The coverage report will be generated in the following directory: `back/target/site/jacoco/index.html`

You can open this file in a web browser to visualize the test coverage report.

Example of Coverage Report:
![Coverage Report](/ressources/image/jacoco-test.png)







