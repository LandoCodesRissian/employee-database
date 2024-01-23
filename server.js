// Bring in required modules
require('dotenv').config();
const mysql = require('mysql2');
const inquirer = require('inquirer');

// Connect to the db
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

// functions for database operations
function viewDepartments() {
    connection.query('SELECT * FROM department', (err, results) => {
        if (err) throw err;
        console.table(results);
        start();
    });
}

function viewRoles() {
    const query = 'SELECT role.id, role.title, department.name AS department, role.salary FROM role INNER JOIN department ON role.department_id = department.id';
    connection.query(query, (err, results) => {
        if (err) throw err;
        console.table(results);
        start();
    });
}

function viewEmployees() {
    const query = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id';
    connection.query(query, (err, results) => {
        if (err) throw err;
        console.table(results);
        start();
    });
}

function addDepartment() {
    inquirer.prompt({
        name: 'departmentName',
        type: 'input',
        message: 'What is the name of the department?'
    }).then(answer => {
        connection.query('INSERT INTO department (name) VALUES (?)', [answer.departmentName], (err) => {
            if (err) throw err;
            console.log('Department added successfully!');
            start();
        });
    });
}

function addRole() {
    getDepartments().then(departments => {
        inquirer.prompt([
            {
                name: 'title',
                type: 'input',
                message: 'What is the title of the role?'
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What is the salary of the role?',
                validate: value => !isNaN(value) || 'Please enter a number'
            },
            {
                name: 'department',
                type: 'list',
                message: 'Which department does the role belong to?',
                choices: departments
            }
        ]).then(answers => {
            const departmentId = departments.find(dept => dept.name === answers.department).id;
            connection.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [answers.title, answers.salary, departmentId], (err) => {
                if (err) throw err;
                console.log('Role added successfully!');
                start();
            });
        });
    });
}

function addEmployee() {
    Promise.all([getRoles(), getEmployees()]).then(values => {
        const [roles, employees] = values;

        inquirer.prompt([
            {
                name: 'firstName',
                type: 'input',
                message: "What is the employee's first name?"
            },
            {
                name: 'lastName',
                type: 'input',
                message: "What is the employee's last name?"
            },
            {
                name: 'role',
                type: 'list',
                message: "What is the employee's role?",
                choices: roles.map(role => ({ name: role.title, value: role.id }))
            },
            {
                name: 'manager',
                type: 'list',
                message: "Who is the employee's manager?",
                choices: employees.map(employee => ({ name: employee.name, value: employee.id })).concat([{ name: 'None', value: null }])
            }
        ]).then(answers => {
            connection.query(
                'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
                [answers.firstName, answers.lastName, answers.role, answers.manager],
                err => {
                    if (err) throw err;
                    console.log("Employee added successfully!");
                    start();
                }
            );
        });
    }).catch(err => {
        console.error(err);
        start();
    });
}

function updateRole() {
    Promise.all([getEmployees(), getRoles()]).then(values => {
        const [employees, roles] = values;

        inquirer.prompt([
            {
                name: 'employeeId',
                type: 'list',
                message: "Which employee's role do you want to update?",
                choices: employees.map(emp => ({ name: emp.name, value: emp.id }))
            },
            {
                name: 'roleId',
                type: 'list',
                message: "What is the new role of the employee?",
                choices: roles.map(role => ({ name: role.title, value: role.id }))
            }
        ]).then(answers => {
            connection.query(
                'UPDATE employee SET role_id = ? WHERE id = ?',
                [answers.roleId, answers.employeeId],
                err => {
                    if (err) throw err;
                    console.log("Employee's role updated successfully!");
                    start();
                }
            );
        });
    }).catch(err => {
        console.error(err);
        start();
    });
}


function getDepartments() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT id, name FROM department', (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}

function getRoles() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT id, title FROM role', (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}

function getEmployees() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee', (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}

