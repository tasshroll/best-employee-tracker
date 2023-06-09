INSERT INTO department (dept_name)
VALUES 
    ("Sales"),
    ("Engineering"),
    ("Accounting"),
    ("Legal");


INSERT INTO roles (title, salary, department_id)
VALUES 
( "Sales Manager", 100000, 1),
( "Salesperson", 80000, 1),
( "Lead Engineer", 150000, 2),
( "Software Engineer", 120000, 2),
( "Account Manager", 160000, 3),
( "Accountant", 125000, 3),
( "Legal Team Lead", 250000, 4),
( "Lawyer", 190000, 4);

-- Insert employees without specifying manager_id
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ("John", "Doe", 1, NULL), -- Sales Lead
    ("Mike", "Chan", 2, 1), -- Salesperson
    ("Ashley", "Rodriguez", 3, NULL), -- Lead Engineer
    ("Kevin", "Tupik", 4, 3), -- Software Engineer
    ("Kunal", "Singh", 5, NULL), -- Account Manager
    ("Malia", "Brown", 6, 5), -- Accountant
    ("Sarah", "Lourd", 7, NULL), -- Legal Team Lead
    ("Tom", "Allen", 8, 7); -- Lawyer

-- Update manager_id for each employee

-- UPDATE employee SET manager_id = 4 WHERE id IN (1,2,3,5,6,7,8);
-- UPDATE employee SET manager_id = NULL WHERE id = 4;



-- INSERT INTO employee (first_name, last_name, role_id, manager_id)
-- VALUES 
--     ("John", "Doe", 1, NULL), -- Sales Lead
--     ("Mike", "Chan", 2, 1), -- Salesperson
--     ("Ashley", "Rodriguez", 3, 4), -- Lead Engineer
--     ("Kevin", "Tupik", 4, NULL), -- Software Engineer
--     ("Kunal", "Singh", 5, 4), -- Account Manager
--     ("Malia", "Brown", 6, 4), -- Accountant
--     ("Sarah", "Lourd", 7, NULL), -- Legal Team Lead
--     ("Tom", "Allen", 8, 7); -- Lawyer


-- SELECT * FROM employee;


-- SELECT * FROM employee JOIN roles ON employee.role_id = roles.id;
-- SELECT * FROM roles JOIN department ON roles.department_id = department.id;


-- JOIN department_id