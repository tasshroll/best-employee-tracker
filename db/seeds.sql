
INSERT INTO role (id, title, salary, department_id)
VALUES 
(1,	"Sales Lead",		"Sales",		"100000"),
(2,	"Salesperson",		"Sales",		"80000"),
(3,	"Lead Engineer",	"Engineering",	"150000"),
(4,	"Software Engineer","Engineering",	"120000"),
(5,	"Account Manager",	"Finance",	    "160000"),
(6,	"Accountant",		"Finance",	    "125000"),
(7,	"Legal Team Lead",	"Legal",		"250000"),
(8,	"Lawyer",			"Legal",		"190000");



-- CREATE TABLE employee (
--     id  NOT NULL AUTO_INCREMENT INT PRIMARY KEY,
--     first_name VARCHAR(30) NOT NULL,
--     last_name VARCHAR(30) NOT NULL,
-- 	role_id INT NOT NULL,
-- 	manager_id INT NOT NULL,
--     FOREIGN KEY (role_id))
--     REFERENCES role(id)
--     FOREIGN KEY (manager_id)
--     REFERENCES employee (id)
--  ???? Manager ID ????

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES 
    (1, "John", "Doe", 1, 4), -- Sales Lead
    (2, "Mike", "Chan", 2, 4), -- Salesperson
    (3, "Ashley", "Rodriguez", 3, 4), -- Lead Engineer
    (4, "Kevin", "Tupik", 4, NULL), -- Software Engineer
    (5, "Kunal", "Singh", 5, 4), -- Account Manager
    (6, "Malia", "Brown", 6, NULL), -- Accountant
    (7, "Sarah", "Lourd", 7, NULL), -- Legal Team Lead
    (8, "Tom", "Allen", 8, NULL); -- Lawyer






