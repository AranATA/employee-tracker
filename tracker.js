const mysql = require('mysql');
const inquirer = require('inquirer');
const table = require('console.table');

// create the connection information for the sql database
const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Your password
  password: 'LQSyM(_Ghibli)',
  database: 'org_chart',
});

// MAIN MENU What would you like to do?

function trackerMenu() {
  inquirer
    .prompt({
      name: 'menu',
      type: 'list',
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
          console.log('Exiting the app...\n');
          connection.end();
          break;
        default:
          console.log(`Invalid action: ${answer.menu}`);
          break;             
      }
    });
};  

const viewAllEmployee = () => {
  console.log('Viewing all employees...\n');
  connection.query('SELECT * FROM employees ORDER BY first_name', (err, res) => {
    if (err) throw err;
    // Table all results of the SELECT statement
    console.table(res);
    trackerMenu();
  });
};

const viewAllEmployeeByDepartment = () => {
  console.log('Viewing all employees by department...\n');
  connection.query('SELECT first_name, last_name, dept_name FROM employees JOIN roles ON employees.role_id = roles.id JOIN departments ON departments.id =roles.dept_id ORDER BY dept_name', (err, res) => {
    if (err) throw err;
    // Table all results of the SELECT statement
    console.table(res);
    trackerMenu();
    // connection.end();
  });
};

const viewAllEmployeeByManager = () => {
  console.log('Viewing all employees by manager...\n');
  connection.query('SELECT first_name, last_name, manager_id,CASE manager_id WHEN 1 THEN (SELECT last_name FROM employees WHERE id=1) WHEN 5 THEN (SELECT last_name FROM employees WHERE id=5) WHEN 9 THEN (SELECT last_name FROM employees WHERE id=9) WHEN 13 THEN (SELECT last_name FROM employees WHERE id=13) ELSE "M" END as manager_name FROM employees ORDER BY manager_id', (err, res) => {
    if (err) throw err;
    // Table all results of the SELECT statement
    console.table(res);
    trackerMenu();
  });
}

const addNewEmployee = () => {
  console.log('Adding a new employee...\n');
  inquirer
  .prompt([
    {
      name: 'first_name',
      type: 'input',
      message: 'First name of the new employee?',
    },
    {
      name: 'last_name',
      type: 'input',
      message: 'Last name of the new employee?',
    },
    {
      name: 'role_id',
      type: 'list',
      message: 'What is the role of the new employee?',
      choices: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', new inquirer.Separator()],
      suffix: ' 1 - backend_lead, 2 - developer, 3 - engineer, 4 - cloud-man, 5 - architect, 6 - admin, 7 - qa_lead, 8 - qa_analyst, 9 - tester, 10 - ux_lead, 11 - ux_designer, 12 - researcher' 
    },
    {
      name: 'manager_id',
      type: 'list',
      message: 'What is the id of the new employee manager?',
      choices: ['1', '2', '3', '4'],
      suffix: ' 1 - back_end, 2 - dex_ops, 3 - qa, 4 - ux',
    },
  ])
  .then((answer) => {
    // when finished prompting, insert a new item into the db with that info
    // INSERT INTO someTable VALUES ...
    // const {first_name, last_name, role_id, manager_id} = answer

    connection.query('INSERT INTO employees SET ?', 
      {
        first_name: answer.first_name,
        last_name: answer.last_name,
        role_id: answer.role_id,
        manager_id: answer.manager_id,
      },
      (err) => {
        if (err) throw err;
        console.log('New employee was added successfully!');
        trackerMenu();
      }
    )
  });
};


// validate(value) {
//   if (isNaN(value) === false) {
//     return true;
//   }
//   return false;
// },
// const start = () => {
//   connection.query('SELECT * FROM roles', (err, res) => {
//     if (err) throw err;
//     console.log(`connected as id ${connection.threadId}`);
//     console.table(res);
//     connection.end();
//   });
// };

// connect to the mysql server and sql database
connection.connect((err) => {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  trackerMenu();
});


