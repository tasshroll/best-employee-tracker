SELECT employee.id, employee.first_name, employee.last_name, 
       roles.title, roles.salary, department.dept_name
FROM employee
JOIN roles ON employee.role_id = roles.id
JOIN department ON roles.department_id = department.id;