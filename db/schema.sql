DROP DATABASE IF EXISTS emp_chart;
CREATE DATABASE emp_chart;

USE emp_chart;
-- departments table
CREATE TABLE departments(
  id INTEGER(11) AUTO_INCREMENT NOT NULL,
  dept_name VARCHAR(30),
  PRIMARY KEY (id)
);
-- roles table
CREATE TABLE roles(
  id INTEGER(11) AUTO_INCREMENT NOT NULL,
  title VARCHAR(30),
  salary DECIMAL(10,2),
  dept_id INTEGER(11),
  PRIMARY KEY (id),
  FOREIGN KEY (dept_id) REFERENCES departments(id)
);
-- employees table
CREATE TABLE employees(
  id INTEGER(11) AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INTEGER(11),
  manager_id INTEGER(11) NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (roles_id) REFERENCES roles(id),
  FOREIGN KEY (manager_id) REFERENCES employees (id)
);

-- To view departments, roles, employees:

USE emp_chart;

SELECT * FROM departments;
SELECT * FROM roles;
SELECT * FROM employees;

-- To view employees by departments:

SELECT
	first_name,
    last_name,
    dept_name
FROM employees
JOIN roles
	ON employees.role_id = roles.id
JOIN departments
	ON departments.id = roles.dept_id;

-- To view employees by managers:

SELECT first_name, last_name, manager_id,
	CASE manager_id
		WHEN 1 THEN (SELECT last_name FROM employees WHERE id=1)
    WHEN 5 THEN (SELECT last_name FROM employees WHERE id=5)
    WHEN 9 THEN (SELECT last_name FROM employees WHERE id=9)
    WHEN 13 THEN (SELECT last_name FROM employees WHERE id=13)
		ELSE "M"
	END
	as manager_name
FROM employees;

-- To add new employees:


