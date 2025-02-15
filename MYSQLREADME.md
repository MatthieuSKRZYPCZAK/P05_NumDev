# MySQL Setup Guide

[⬅️ Back to Main README](README.md)

This guide provides step-by-step instructions for configuring MySQL for this application.

---

## **Install MySQL**

Download and install MySQL from the [official website](https://dev.mysql.com/doc/mysql-getting-started/en/).

Before running the application, you need to configure the MySQL database. Follow these steps to set up the database and user directly from the MySQL command line:

After installing MySQL, follow these steps to create a database, a user and assign a password to the user.

### 1. Log in to the MySQL Server

Open a terminal or command prompt and run the following command to log in to MySQL:

```bash 
   mysql -u root -p
```
Enter the root password when prompted.

### 2. Create the Database

Run the following command to create a new database (replace `yogadb` with your preferred database name):

```sql 
CREATE DATABASE yogadb;
```

### 3. Create a New User

Run the following command to create a new user (replace `yogauser` and `yogapassword` with your desired username and password):

```sql
CREATE USER 'yogauser'@'localhost' IDENTIFIED BY 'yogapassword';
```
### 4. Grant Permissions to the User

Grant all necessary privileges on the newly created database to the new user:

```sql 
GRANT ALL PRIVILEGES ON yogadb.* TO 'yogauser'@'localhost';
```

### 5. Apply Changes

Apply the changes to ensure the permissions are updated:

```sql 
FLUSH PRIVILEGES;
```

### 6. Verify the Configuration

You can verify that the user can access the database by logging in with the new credentials:

```bash
   mysql -u yogauser -p
```

Then, select the database:

```sql 
USER yogadb;
```

If no errors occur, the database and user have been configured successfully.

[⬅️ Back to Main README](README.md)