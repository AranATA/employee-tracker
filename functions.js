const mysql = require('mysql');
const inquirer = require('inquirer');
const table = require('console.table');
const Employee = require('../githubed-hws/team-profile-generator/lib/Employee');

// MAIN MENU What would you like to do?

function trackerMenu() {
  inquirer
    .prompt({
      type: 'list',
      name: 'menu',
      message: 'What would you like to do with app tracker?',
      choices: ['1. VIEW all employees', '2. VIEW all employees by department', '3. VIEW all employees by manager', '4. ADD new employee', '5. ADD new role', '6. ADD new department', '7. UPDATE employee role', '8. UPDATE employee manager', '9. DELETE employee record', '10. DELETE role', '11. DELETE department', '12. VIEW the budget of a department', 'EXIT APP', new inquirer.Separator()],
      prefix: '-',

    })

    .then((answer) => {
      switch (answer.menu) {
        case '1. VIEW all employees':
          viewAllEmployee();
          break;
        case '2. VIEW all employees by department':
          viewAllEmployeeByDepartment();
          break;
        case '3. VIEW all employees by manager':
          viewAllEmployeeByManager();
          break;
        case '4. ADD new employee':
          addNewEmployee();
          break;
        case '5. ADD new role':
          addNewRole();
          break;
        case '6. ADD new department':
          addNewDepartment();
          break;
        case '7. UPDATE employee role':
          updateEmployeeRole();
          break;
        case '8. UPDATE employee manager':
          updateEmployeeManager();
          break;
        case '9. DELETE employee record':
          deleteEmployeeRecord();
          break;
        case '10. DELETE role':
          deleteRole();
          break;
        case '11. DELETE department':
          deleteDepartment();
          break;
        case '12. VIEW the budget of a department':
          viewBudgetDepartment();
          break;
        case 'EXIT APP':
          connection.end();
          break;
        default:
          console.log(`Invalid action: ${answer.menu}`);
          break;             
      }
    });
};  
trackerMenu();

// VIEW ALL EMPLOYEES
const viewAllEmployee = () => {
  console.log('Viewing all employees...\n');
  connection.query('SELECT * FROM employees', (err, res) => {
    if (err) throw err;
    // Table all results of the SELECT statement
    console.table(res);
    // connection.end();
    trackerMenu();
  });
};  
// VIEW ALL EMPLOYEES BY DEPARTMENT
const viewAllEmployeeByDepartment = () => {
  console.log('Viewing all employees by department...\n');
  connection.query('SELECT dept_name, CONCAT(first_name, " ", last_name) AS employee_name FROM employees JOIN roles ON employees.role_id = roles.id JOIN departments ON departments.id =roles.dept_id ORDER BY dept_name', (err, res) => {
    if (err) throw err;
    console.table(res);
    trackerMenu();
  });
};
// VIEW ALL EMPLOYEES BY MANAGER
// OLD VERSION (CASE WHEN)
const viewAllEmployeeByManager = () => {
  console.log('Viewing all employees by manager...\n');
  connection.query('SELECT first_name, last_name, manager_id, CASE manager_id WHEN 1 THEN (SELECT last_name FROM employees WHERE id=1) WHEN 5 THEN (SELECT last_name FROM employees WHERE id=5) WHEN 9 THEN (SELECT last_name FROM employees WHERE id=9) WHEN 13 THEN (SELECT last_name FROM employees WHERE id=13) ELSE "M" END as manager_name FROM employees ORDER BY manager_id', (err, res) => {
    if (err) throw err;
    console.table(res);
    trackerMenu();
  });
};
// NEW VERSION (JOIN)
const viewAllEmployeeByManager = () => {
  console.log('Viewing all employees by manager...\n');
  connection.query('SELECT employees.manager_id, CONCAT(manager_name.first_name, " ", manager_name.last_name) AS manager_name, CONCAT(employees.first_name, " ", employees.last_name) AS employee_name FROM employees JOIN employees manager_name ON manager_name.id = employees.manager_id', (err, res) => {
    if (err) throw err;
    // Table all results of the SELECT statement
    console.table(res);
    trackerMenu();
  });
};
// ADD NEW EMPLOYEE WIP

// ADD NEW ROLE
const addNewRole = () => {
  console.log('Adding a new role...\n');
  connection.query('SELECT * FROM departments ORDER BY departments.id', (err, res) => {
    if (err) throw err;
    console.log('Use this table to answer the questions:\n');
    console.table(res);
  });
  const delayedPrompt = () => {
    inquirer
      .prompt([
        {
          name: 'dept_id',
          type: 'input',
          message: 'What department id number does the new role has?',
        },
        {
          name: 'title',
          type: 'input',
          message: 'What is the new role title?',
        },
        {
          name: 'salary',
          type: 'input',
          message: 'What is the new role salary?',
        },        
      ])
      .then((answer) => {
        connection.query('INSERT INTO roles SET ?',
          {
            title: answer.title,
            salary: answer.salary,
            dept_id: answer.dept_id,
          },
          (err) => {
            if (err) throw err;
            console.log('New role was added successfully!');
            trackerMenu();
          }
        )
      });
  };
  setTimeout(delayedPrompt, 250);
};