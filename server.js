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
    inquirer.prompt(company_questions)

        .then((answers) => {
            // log the JSON object
            console.log("user choice received");
            console.log(JSON.stringify(answers, null, ' '));
            // ask more questions
            switch (answers.action) {
                case "View All Employees":
                    // code block
                    db.query('SELECT * FROM roles;', function (err, results) {
                        console.log(results);
                    });
                    break;
                case "Add Employee":
                    addEmployee();
                    //                     What is the employee’s first name? Sam
                    // What is the employee’s last name? Kash
                    // What is the employee’s rolle? Customer Service
                    // Who is the employee’s manager? Ashleigh Rodes
                    // Added Sam Kash to the database

                    // code block
                    break;
                case "Update Employee Role":
                    // code block
                    break;
                case "View All Roles":
                    // code block
                    break;
                case "Add Role":
                    // code block
                    break;
                case "View All Departments":
                    // code block
                    break;
                case "Add Department":
                    // code block
                    break;
                case "Quit":
                    // code block
                    break;
                default:
                // code block
            }

        })
        .catch(() => {
            console.log("Inquirer prompt failed")
        })
};

function addEmployee() {
    const emp_questions = [
        {
            type: "input",
            message: "What is the employee's first name?",
            name: "first_name",
        },
        {
            type: "input",
            message: "What is the employee's last name?",
            name: "last_name",
        },
        {
            type: "list",
            message: "What is the employee's role?",
            name: "role",
            choices: [
                "1 = Sales Lead",
                "2 = Sales Person",
                "3 = Lead Engineer",
                "4 = Software Engineer",
                "5 = Account Manager",
                "6 = Accountant",
                "7 = Legal Team Lead",
                "8 = Lawyer",
                "Use Arrow Keys to select"
            ]
        },
        {
            type: "input",
            message: "Who is the employee's manager?",
            name: "manager",
        },
    ];

    inquirer.prompt(emp_questions)

    .then((answers) => {
        // log the JSON object
        const { first_name, last_name, role, manager } = answers;
        console.log(`Added ${first_name} ${last_name} to the database as ${role} with manager ${manager}`);
        //INSERT INTO employee VALUES (first_name, last_name, #, #);
    // Added Sam Kash to the database
    //( "John", "Doe", 1, 4), -- Sales Lead

    })
};

init();
