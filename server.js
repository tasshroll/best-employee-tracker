//const logo = require('./lib/logo.js');
const inquirer = require('inquirer');
const fs = require('fs');
const express = require('express');
const mysql = require('mysql');

const PORT = process.env.PORT || 3001;
const app = express();

//Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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

// Deffault response for any other request (Not Found)
app.use((req, res) => {
    console.log(`Server running on port ${PORT}`);
});

// Hardcoded query: DELETE FROM course_names WHERE id = 3;
// db.query(`DELETE FROM employee WHERE id = ?`, 3, (err, result) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(result);
// });


// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


const company_questions = [
    {
        type: "list",
        message: "What would you like to do? (Use arrow keys)",
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
            "(Move up and down to reveal more choices)",
        ]
    }
];


function init() {
    const promptUser = () => {

        inquirer
        .prompt(company_questions)
        .then((answers) => {
            // log the JSON object
            console.log("user choice received");
            console.log(JSON.stringify(answers, null, ' '));
            // ask more questions
                switch (answers.action) {
                case "View All Employees":
                    displayEmp();
                    promptUser();

                    break;
                case "Add Employee":
                    addEmployee();
                    //                     What is the employee’s first name? Sam
                    // What is the employee’s last name? Kash
                    // What is the employee’s rolle? Customer Service
                    // Who is the employee’s manager? Ashleigh Rodes
                    // Added Sam Kash to the database
                    break;
                case "Update Employee Role":
                    promptUser();

                    break;
                case "View All Roles":
                    db.query('SELECT * FROM roles;', function (err, results) {
                        console.table(results);
                    });
                    promptUser();

                    break;
                case "Add Role":
                    promptUser();

                    break;
                case "View All Departments":
                    db.query('SELECT * FROM department;', function (err, results) {
                        console.table(results);
                    });
                    promptUser();

                    break;
                case "Add Department":
                    promptUser();

                    break;
                case "Quit":
                    break;
                default:
                    promptUser();
        }

        })
        .catch(() => {
            console.log("Inquirer prompt failed")
        })
    }
    promptUser();
};


function displayEmp() {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, 
                 roles.title, roles.salary, department.dept_name
                 FROM employee
                 JOIN roles ON employee.role_id = roles.id
                 JOIN department ON roles.department_id = department.id`;
    db.query(sql, function (err, results) {
        console.table(results);
    });
}


function addEmployee() {
    db.query(`SELECT first_name, last_name FROM employee;`, function (err, results) {
        //console.log(results);
        const emp_list = results;
        console.table(emp_list);
        console.log (emp_list);
        //emp_list_to_display = 
          
          const formattedResults = results.map(row => `${row.first_name} ${row.last_name}`);
          
          console.log(formattedResults);
          // Output: ["John Doe", "Mike Chan", "Ashley Rodriguez", "Kevin Tupik", "Kunal Singh", "Malia Brown", "Sarah Lourd", "Tom Allen"]
          
   

    const emp_questions = [
        {
            type: "input",
            message: "What is the employee's first name?",
            name: "f_name",
        },
        {
            type: "input",
            message: "What is the employee's last name?",
            name: "l_name",
        },
        {
            type: "list",
            message: "What is the employee's role?",
            name: "role_title",
            choices: [
                "Sales Lead",
                "Sales Person",
                "Lead Engineer",
                "Software Engineer",
                "Account Manager",
                "Accountant",
                "Legal Team Lead",
                "Lawyer",
                "Use Arrow Keys to select"
            ]
        },
        {
            type: "list",
            message: "Who is the employee's manager?",
            name: "boss",
            choices: formattedResults
        },
    ];

    inquirer.prompt(emp_questions)

        .then((answers) => {
            // log the JSON object
            const { f_name, l_name, role_title, boss } = answers;
            // Check if manager is in database


            //INSERT INTO employee VALUES (first_name, last_name, #, #);
            // Added Sam Kash to the database
            //( "John", "Doe", 1, 4), -- Sales Lead
            const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
            const params = [f_name, l_name, role_title, boss];
            //db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (f_name, l_name, role_title, supervisor);`);
            db.query(sql, params, (err, result) => {
                if (err) {
                    console.log("Not added to db");
                    return;
                }
                console.log(`Added ${f_name} ${l_name} to the database as ${role_title} with manager ${boss}`);
                console.table(result);
                db.query("SELECT * FROM employee");
            })
        });
    });
}

init();