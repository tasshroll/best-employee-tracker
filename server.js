//const logo = require('./lib/logo.js');
const inquirer = require('inquirer');
const mysql = require('mysql');
require('console.table')

// Connect to database
const db = mysql.createConnection(
    {
        host: '127.0.0.1', // *localhost gives an error
        // MySQL username
        user: 'root',
        password: '',
        database: 'company_db'
    },
    console.log(`Connected to the company_db ddatabase.`)
);

const main_questions = [
    {
        type: "list",
        message: "What would you like to do?",
        name: "action",
        choices: [
            "View All Employees",
            "Add Employee",
            "Update Employee Role",
            "View All Roles",
            "Add Role",
            "View All Departments",
            "Add Department", ,
            "Quit",
        ]
    }
];


const promptUser = () => {
    inquirer
        .prompt(main_questions)
        .then((answers) => {
            switch (answers.action) {
                case "View All Employees":
                    displayEmp();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Update Employee Role":
                    break;
                case "View All Roles":
                    displayRoles();
                    break;
                case "Add Role":
                    createNewRole()
                    break;
                case "View All Departments":
                    displayDepts();
                    break;
                case "Add Department":

                    break;

                default:
                    process.exit()
            }

        })
        .catch(() => {
            console.log("Inquirer prompt failed")
        })
}
function init() {
    promptUser();
};


function displayEmp() {
    const sql = `SELECT employee.id, CONCAT(employee.first_name,' ', employee.last_name) as Employee, 
                 roles.title, roles.salary, department.dept_name, CONCAT(manager.first_name, ' ', manager.last_name) AS Manager
                 FROM employee
                 LEFT JOIN roles ON employee.role_id = roles.id
                 LEFT JOIN department ON roles.department_id = department.id
                 LEFT JOIN employee AS manager ON manager.id = employee.manager_id`;
    // last JOIN above renamed 2nd instance of employee table as manager table
    // foreign key (employee.manager_id)
    // is set equal to primaary key (manager.id)

    db.query(sql, function (err, results) {
        console.table(results);
        promptUser()
    });
}


function addEmployee() {
    db.query(`SELECT first_name, last_name, id FROM employee;`, (err, results) => {
        console.table(results)
        // Parse out the data
        const empList = results.map(row => ({
            f_name: row.first_name,
            l_name: row.last_name,
            id: row.id
        }));
        console.log(empList);

        db.query(`SELECT * from ROLES`, (err, results) => {
            console.table(results);
            // Parse out data
            const roleList = results.map(row => ({
                name: row.title,
                salary: row.salary,
                value: row.id
            }));

            const emp_questions = [
                {
                    type: "input",
                    message: "What is the new employee's first name?",
                    name: "f_name",
                },
                {
                    type: "input",
                    message: "What is the new employee's last name?",
                    name: "l_name",
                },
                {
                    type: "list",
                    message: "What is the employee's role?",
                    name: "role_title",
                    choices: roleList.map(role => role.name)
                },
                {
                    type: "list",
                    message: "Who is the employee's manager?",
                    name: "boss",
                    choices: empList.map(emp => emp.f_name + ' ' + emp.l_name)
                },
            ];

            inquirer.prompt(emp_questions)
                .then((answers) => {
                    const { f_name, l_name, role_title, boss } = answers;
                    const role = roleList.find(role => role.name === role_title);
                    const bossId = empList.find(emp => emp.f_name + ' ' + emp.l_name === boss).id;
                    const params = [f_name, l_name, role.value, bossId];
                    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
                    db.query(sql, params, (err, result) => {
                        if (err) {
                            console.log("Not added to db");
                            return;
                        }
                        console.log(`Added ${f_name} ${l_name} to the database as ${role_title} with manager_id ${bossId}`);
                        promptUser();
                    });
                })
                .catch(() => {
                    console.log("Inquirer prompt failed");
                });
        });
    });
}
function displayRoles() {
db.query('SELECT * FROM roles;', function (err, results) {
    console.table(results);
    promptUser();
});
}

function displayDepts () {
    db.query('SELECT * FROM department;', function (err, results) {
        if (err) {
            console.log("Could not read from db");
        }
        console.table(results);
        promptUser();
    });
}

function createNewRole() {
    // The callback function will receive an error object if the query failed, or the results of the query if it succeeded.
    db.query('select * from department', (err, res) => {
        // Create an array deptList, used as choices for a list prompt in Inquirer below
        const deptList = res.map((dept) => ({
            name: dept.dept_name,
            value: dept.id
        })
        )

        inquirer.prompt([
            {
                name: 'new_role',
                type: 'input',
                message: 'Enter name of new Role'
            },
            {
                name: 'salary',
                type: 'input',
                message: 'Enter salary for this role'
            },
            {
                name: 'department_id',
                type: 'list',
                message: "What department does this role belong to?",
                choices: deptList
            }
        ]).then((res) => {
            // After user enters role, salary, and chooses a department, 
            // insert role, salary, and department id into roles table
            console.log(res);
            const params = [res.new_role, res.salary, res.department_id];
            const sql = "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)";

            db.query(sql, params, function (err, results) {
              if (err) {
                console.error("Error inserting data into database:", err);
                return;
              }
              console.log("Data inserted successfully:");
              promptUser(); // Ask user for next action
            });
        })
    }) // end of db.query
}  //END of createNewRole

init();