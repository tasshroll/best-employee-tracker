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
db.query(`DELETE FROM company_db WHERE id = ?`, 3, (err, result) => {
    if (err) {
        console.log(err);
    }
    console.log(result);
});

// Query database
db.query('SELECT * FROM company_db', function (err, results) {
    console.log(results);
});

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
]


function init() {
    inquirer.prompt(company_questions)

        .then((answers) => {
            // log the JSON object
            console.log(JSON.stringify(answers, null, ' '));
            // generate the SVG code 
            const svgCode = logo.generate(answers);
            // write code to logo.svg file
            fs.writeFile('./examples/logo.svg', svgCode, (err) =>
                err ? console.log(err) : console.log('Success! Generated logo.svg!')
            );
        })
        .catch(() => {
            console.log("Inquirer prompt failed")
        })
};

init();
