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
// VIEW ALL EMPLOYEES
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
// ADD NEW EMPLOYEE
// *********WIP************
const addNewEmployee = () => {
  console.log('Adding a new employee...\n');


  const dynamicDepartments = () => {

    // 1. query the database for all departments, get the latest set and form an array with department names.
    connection.query('SELECT * FROM departments', (err, results) => {
      const departmentsArray = [];
      results.forEach((res) => {
        departmentsArray.push(res.dept_name);
      });
      if (err) throw err;
      // }
      // 2. start the inquirer function, use the array of departments as choices and get an answer for the department name.
      inquirer
        .prompt([
          {
            name: 'dept_name',
            type: 'list',
            message: 'Department name of the new employee?',
            choices: departmentsArray
          },
        ])
        .then((answer) => {
          let chosenDepartment;
          let chosenDepartmentId;
          results.forEach((department) => {
            if (department.dept_name === answer.choice) {
              chosenDepartment = department;
            }
            chosenDepartmentId = chosenDepartment.id;
          });
         
            connection.query('SELECT roles.id, title, manager_id FROM employees RIGHT JOIN roles ON employees.role_id = roles.id JOIN departments ON roles.dept_id = departments.id WHERE dept_id = ?',
            chosenDepartmentId,            
            (err, res) => {
              if (err) throw err;
              console.log('Department was picked successfully!');
              console.log('Use this table to answer the questions:\n');
              console.table(res);
              // trackerMenu();
            }
            );
          
        });

    });
  
  
  };

  dynamicDepartments();
 
  
  // const delay = () => {
  //   inquirer
  //     .prompt([
  //       {
  //         name: 'role_id',
  //         type: 'input',
  //         message: 'Title id of the new employee?',
  //       },
  //       {
  //         name: 'manager_id',
  //         type: 'input',
  //         message: 'Manager id of the new employee?',
  //       },
  //       {
  //         name: 'first_name',
  //         type: 'input',
  //         message: 'First name of the new employee?',
  //       },
  //       {
  //         name: 'last_name',
  //         type: 'input',
  //         message: 'Last name of the new employee?',
  //       },
  //     ])
  //     .then((answer) => {
  //       // when finished prompting, insert a new item into the db with that info
  //       connection.query('INSERT INTO employees SET ?',
  //         {
  //           first_name: answer.first_name,
  //           last_name: answer.last_name,
  //           role_id: answer.role_id,
  //           manager_id: answer.manager_id,
  //         },
  //         (err) => {
  //           if (err) throw err;
  //           console.log('New employee was added successfully!');
  //           trackerMenu();
  //         }
  //       );
  //     });
  // };
  // setTimeout(delay, 250);
};


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

  connection.query('SELECT employees.id, roles.id, first_name, last_name, dept_name, title, role_id FROM employees RIGHT JOIN roles ON employees.role_id = roles.id RIGHT JOIN departments ON departments.id =roles.dept_id ORDER BY dept_name', (err, res) => {
    if (err) throw err;
    console.table(res);
  });
};

const updateEmployeeRole = () => {
  console.log('Updating employee role...\n');
  console.log('Use this table to answer the questions:\n');
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

// const updateEmployeeManager = () => {
//   console.log('Updating employee manager...\n');
//   console.log('Use this table to answer the questions:\n');

//   viewAllEmployeeByManager ()

//   const delay = () => {










//   setTimeout(delay, 250); 
// };

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
