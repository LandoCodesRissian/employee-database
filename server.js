// Include required modules
require('dotenv').config();
const mysql = require('mysql2');
const inquirer = require('inquirer');

// Connect to the database
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
    }
    console.log('Connected to the MySQL server.');
    start();
});

// Start Inquirer interface
function start() {
    inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Exit'
        ]
    })
    .then(answer => {
        switch (answer.action) {
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employees role':
                updateRole();
                break;
            case 'Exit':
                connection.end();
                break;
            default:
                console.log(`Invalid action: ${answer.action}`);
                break;
        }
    });
}

// Placeholder functions for database operations
function viewDepartments() {
    // SQL query to view all departments
}

function viewRoles() {
    // SQL query to view all roles
}

function viewEmployees() {
    // SQL query to view all employees
}

function addDepartment() {
    // SQL query to view add a derpartment
}

function addRole() {
    // SQL query to view add roles
}

function addEmployee() {
    // SQL query to add an employee
}

function updateRole() {
    // SQL query to update an employee role
}
