const mysql = require('mysql');
const inquirer = require('inquirer');
const table = require('console.table');
const Employee = require('../githubed-hws/team-profile-generator/lib/Employee');

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
      type: 'rawlist',
      message: 'What would you like to do with the tracker app?',
      choices: ['VIEW all employees', 'VIEW all employees by department', 'VIEW all employees by manager', 'ADD new employee', 'ADD new role', 'ADD new department', 'UPDATE employee role', 'UPDATE employee manager', 'DELETE employee record', 'DELETE role', 'DELETE department', 'VIEW the budget of a department', 'EXIT APP', new inquirer.Separator()],
      prefix: '-',

    })

    .then((answer) => {
      switch (answer.menu) {
        case 'VIEW all employees':
          viewAllEmployee();
          break;
        case 'VIEW all employees by department':
          viewAllEmployeeByDepartment();
          break;
        case 'VIEW all employees by manager':
          viewAllEmployeeByManager();
          break;
        case 'ADD new employee':
          addNewEmployee();
          break;
        case 'ADD new role':
          addNewRole();
          break;
        case 'ADD new department':
          addNewDepartment();
          break;
        case 'UPDATE employee role':
          updateEmployeeRole();
          break;
        case 'UPDATE employee manager':
          updateEmployeeManager();
          break;
        case 'DELETE employee record':
          deleteEmployeeRecord();
          break;
        case 'DELETE role':
          deleteRole();
          break;
        case 'DELETE department':
          deleteDepartment();
          break;
        case 'VIEW the budget of a department':
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
    // connection.end();
    trackerMenu();
  });
};

const viewAllEmployeeByDepartment = () => {
  console.log('Viewing all employees by department...\n');
  connection.query('SELECT first_name, last_name, dept_name FROM employees JOIN roles ON employees.role_id = roles.id JOIN departments ON departments.id =roles.dept_id ORDER BY dept_name', (err, res) => {
    if (err) throw err;
    console.table(res);
    trackerMenu();
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

      // TRY!****const {first_name, last_name, role_id, manager_id} = answer

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

const addNewRole = () => {
  console.log('Adding a new role...\n');
  inquirer
    .prompt([
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
      {
        name: 'dept_id',
        type: 'input',
        message: 'What is the new role deptartment id?',
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

const addNewDepartment = () => {
  console.log('Adding a new department...\n');
  inquirer
    .prompt([
      {
        name: 'dept_name',
        type: 'input',
        message: 'What is the new department name?',
      }
    ])
    .then((answer) => {
      connection.query('INSERT INTO departments SET ?',
        {
          dept_name: answer.dept_name
        },
        (err) => {
          if (err) throw err;
          console.log('New department was added successfully!');
          trackerMenu();
        }
      )
    });
};

const viewAllEmployeeRef = () => {
  console.log('Use this table to answer the questions:\n');
  connection.query('SELECT employees.id, first_name, last_name, dept_name, title, role_id FROM employees JOIN roles ON employees.role_id = roles.id JOIN departments ON departments.id =roles.dept_id ORDER BY dept_name', (err, res) => {
    if (err) throw err;
    console.table(res);
  });
};




const updateEmployeeRole = () => {
  console.log('Updating employee role...\n');

  viewAllEmployeeRef();

  const delay = () => {
  inquirer
    .prompt([
      {
        name: 'e_id',
        type: 'input',
        message: 'Id number of the employee whose role to be updated?',
      },
      {
        name: 'role_id',
        type: 'input',
        message: 'Id number of the new role?',
      },
    ])
    .then((answer) => {
      connection.query('UPDATE employees SET ? WHERE ?',
      [
        {
          role_id: answer.role_id,
        },
        {
          id: answer.e_id,
        },
      ],  
      (err, res) => {
          if (err) throw err;
          console.log(`${res.affectedRows} employee role updated successfully!\n`);
          trackerMenu();
        }
      )    
    });
  }
  setTimeout(delay, 250);
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
