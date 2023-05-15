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

// Display company foles
function displayRoles() {
    db.query('SELECT * FROM roles;', function (err, results) {
        console.table(results);
        promptUser();
    });
}

// Display company departments
function displayDepts() {
    db.query('SELECT * FROM department;', function (err, results) {
        if (err) {
            console.log("Could not read from db");
        }
        console.table(results);
        promptUser();
    });
}

// Retreive all employee data from the three tables
function getAllEmployeeData(results) {
    // console.log("inside getAllEmployeeData");
    const sql = `SELECT employee.id, CONCAT(employee.first_name,' ', employee.last_name) as Employee, 
                 roles.title, roles.salary, department.dept_name, CONCAT(manager.first_name, ' ', manager.last_name) AS Manager, 
                 employee.manager_id AS manager_id
                 FROM employee
                 LEFT JOIN roles ON employee.role_id = roles.id
                 LEFT JOIN department ON roles.department_id = department.id
                 LEFT JOIN employee AS manager ON manager.id = employee.manager_id`;
    // last JOIN above renamed 2nd instance of employee table as manager table
    // foreign key (employee.manager_id)
    // is set equal to primaary key (manager.id)

    return new Promise((resolve, reject) => {
        db.query(sql, function (err, results) {
            if (err) {
                console.log("Could not read from db to get all employee data");
                reject(err);
            } else {
                console.table(results);
                resolve(results);
            }
        });
    });
}

// Display employees
async function displayEmp() {
    const results = await getAllEmployeeData();
    //console.log("after calling function getAllEmployeeData, data is", results);
    promptUser();
}

// Update employee role
async function updateRole() {
    // get list of employees
    const results = await getAllEmployeeData();
    const empList = results.map(row => ({
        //Parse data from TABLE
        name: row.Employee,
        title: row.title,
        dept_name: row.dept_name,
        mgr: row.Manager,
        mgr_id: row.manager_id,
        value: row.id
    }));
    let roleList; // declare roleList outside of the callback function
    // Get list of existing roles
    db.query(`select * from roles;`, (err, result) => {
        if (err) {
            console.log("Cant access db", err);
            return;
        }
        roleList = result.map(row => ({
            name: row.title,
            value: row.id
        }));
    });

    const answers = await inquirer.prompt({
        type: "list",
        message: "Which employee do you want to update",
        name: "empToUpdate",
        choices: empList,
    });

    const empID = answers.empToUpdate;
    console.log("employee to udate is ", empID);

    // Display of exisitng roles for user to choose from
    const answ = await inquirer.prompt({
        type: "list",
        message: "Which role do you want them to have?",
        name: "newRole",
        choices: roleList
        //choices: roleList.map(role => role.name)
    });
    const roleID = answ.newRole;
    const sql = `UPDATE employee SET role_id = ? WHERE id = ?;`;
    const params = [roleID, empID];
    // upddate db with role ID for selected employee
    db.query(sql, params, (err, result) => {
        if (err) {
            console.log("Role not updated", err);
            return;
        }
        console.log(`Success. Updated role id ${roleID} for employee id of ${empID}`);
        promptUser();
    });
}

// Update an employee's manager
async function updateEmpManager() {

    // get list of employees
    const results = await getAllEmployeeData();
    const empList = results.map(row => ({
        //Parse data from TABLE
        name: row.Employee,
        title: row.title,
        dept_name: row.dept_name,
        mgr: row.Manager,
        mgr_id: row.manager_id,
        value: row.id
    }));

    inquirer.prompt({
        type: "list",
        message: "Which employee do you want to update",
        name: "empToUpdate",
        choices: empList,
    }).then((answers) => {
        //const { empToUpdate } = answers;
        // Get ID of empoyee
        const empID = answers.empToUpdate;
        console.log("employee to udate is ", empID);

        //console.log ("empList is ", empList);

        // Add a empty field for user to have the choice of no manager
        empList.push({
            f_name: 'None',
            l_name: '',
            id: null
        });


        inquirer.prompt({
            type: "list",
            message: "Who is this employee's new manager?",
            name: "mgrChosen",
            choices: empList,
        }).then((answ) => {
            const mgrID = answ.mgrChosen;

            //console.log(" mgr_id is", mgrID, "emp_id is, ", empID, );

            const sql = `UPDATE employee SET manager_id = ? WHERE id = ?;`;
            const params = [mgrID, empID];

            //console.log("Emp name is ", empToUpdate.name, "new mgr for this emp is ", mgrChosen.name );
            // Update the employee database with the new manager id

            db.query(sql, params, (err, result) => {
                if (err) {
                    console.log("Not added to db", err);
                    return;
                }
                console.log(`Success. Updated manager id ${mgrID} for employee id of ${empID}`);
                promptUser();
            });
        })
            .catch(() => {
                console.log("Inquirer prompt failed");
            });
    })
        .catch(() => {
            console.log("Inquirer prompt failed");
        });
} //END updateEmpManager


// Add a new employee
function addEmployee() {
    // Query DB for a list of existing employees
    // These will be manager choices for new employee being added
    db.query(`SELECT first_name, last_name, id FROM employee;`, (err, results) => {
        //console.table(results)

        const managerChoices = results.map(row => ({
            // Parse data from TABLE employee
            f_name: row.first_name,
            l_name: row.last_name,
            id: row.id
        }));
        //console.log(managerChoices);
        // Add a 'none' selection to end of managerChoices Array in case
        // the newly added employee will NOT have a manager
        managerChoices.push({
            f_name: 'None',
            l_name: '',
            id: null
        });
        //console.log(managerChoices);


        // Query DB for a list of all the exisiting roles in the company. 
        // This will be the list to choose from for the new employee.
        db.query(`SELECT * from ROLES`, (err, results) => {
            const roleList = results.map(row => ({
                // Parse data from TABLE ROLE
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
                    choices: managerChoices.map(emp => emp.f_name + ' ' + emp.l_name)
                },
            ];

            inquirer.prompt(emp_questions)
                .then((answers) => {
                    const { f_name, l_name, role_title, boss } = answers;
                    const role = roleList.find(role => role.name === role_title);
                    const bossId = managerChoices.find(emp => emp.f_name + ' ' + emp.l_name === boss).id;
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

// Add a new department
function addNewDept() {

    inquirer.prompt({
        type: 'input',
        name: 'departmentName',
        message: "What department do you want to add?"
    }).then((answer) => {
        // After user enters role, salary, and chooses a department, 
        // insert role, salary, and department id into roles table
        const params = [answer.departmentName];
        const sql = "INSERT INTO department (dept_name) VALUES (?)";
        db.query(sql, params, function (err, results) {
            if (err) {
                console.error("Error inserting data into database:", err);
                return;
            }
            console.log("New Department addded successfully:");
            promptUser(); // Ask user for next action
        });
    }); // end of inquirer
} // end of addNewDept


// Add a new role
function createNewRole() {
    // The callback function will receive an error object if the query failed, or the results of the query if it succeeded.
    db.query('select * from department', (err, res) => {
        // Use MAP to create an array deptList, used as choices for a list prompt in Inquirer below
        // 'name' - is what the user sees in the dropdown but when they select something, 
        // 'value' is what is passed as the answer
        const deptList = res.map((dept) => ({
            name: dept.dept_name,
            value: dept.id
        })
        )
        // Use map() method to iterate over each object in the DB res array and create a new object with name and value properties. 
        // The resulting deptList array will display the dropdown menu of inquirer propt so the user can select a department name.
        // The name property is displayed to the user but the value property is used as the selected value when an option is chosen.

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
        ]).then((answer) => {
            // After user enters role, salary, and chooses a department, 
            // insert role, salary, and department id into roles table
            console.log(answer);
            const params = [answer.new_role, answer.salary, answer.department_id];
            const sql = "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)";

            db.query(sql, params, function (err, results) {
                if (err) {
                    console.error("Error inserting data into database:", err);
                    return;
                }
                console.log("Data inserted successfully:");
                promptUser(); // Ask user for next action
            });
        }) // end of inquirer
    }) // end of db.query
}  //END of createNewRole

// Main prompt function
const promptUser = () => {
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
                "Add Department",
                "Update Employee's Manager",
                "Quit"
            ]
        }
    ];

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
                    updateRole();
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
                    addNewDept();
                    break;
                case "Update Employee's Manager":
                    updateEmpManager();
                    break;
                default:
                    process.exit()
            }

        })
        .catch(() => {
            console.log("Inquirer prompt failed")
        })
} // END promptUser()


// prompt user with selections
function init() {
    promptUser();
};
// call init to display the user prompts
init();