DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;

USE company_db;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    dept_name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id  NOT NULL AUTO_INCREMENT INT PRIMARY KEY,
	title VARCHAR(30),
	salary INT NOT NULL,
	department_id INT NOT NULL
);

CREATE TABLE employee (
    id  NOT NULL AUTO_INCREMENT INT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
	role_id 
	manager_id
    FOREIGN KEY (role_id))
    REFERENCES role(id)
    FOREIGN KEY (manager_id)
    REFERENCES employee (id)
    ON DELETE SET NULL
    );

