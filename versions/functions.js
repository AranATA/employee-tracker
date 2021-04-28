// const mysql = require('mysql');
// const inquirer = require('inquirer');
// const table = require('console.table');
// const Employee = require('../githubed-hws/team-profile-generator/lib/Employee');

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

// VIEW ALL EMPLOYEES (complete)
const viewAllEmployee = () => {
  console.log('Viewing all employees...\n');
  connection.query('SELECT employees.id, first_name, last_name, title, dept_name, CONCAT(manager_name.first_name, " ", manager_name.last_name) AS manager_name FROM employees JOIN employees manager_name ON manager_name.id = employees.manager_id LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON departments.id = roles.dept_id ORDER BY employees.id', (err, res) => {
    if (err) throw err;
    // Table all results of the SELECT statement
    console.table(res);
    // connection.end();
    // trackerMenu();
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
// ADD NEW DEPARTMENT
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
          console.log('New department was added successfully!\n');
          trackerMenu();
        }
      )
    });
};
// reference table function for UPDATE
const viewToUpdateRef = () => {
  connection.query('SELECT employees.id, CONCAT(employees.first_name, " ", employees.last_name) AS employee_name, CONCAT(roles.title, ", id:", roles.id) AS title_and_role_id, dept_name, CONCAT(manager_name.first_name, " ", manager_name.last_name) AS manager_name FROM employees LEFT JOIN employees manager_name ON manager_name.id = employees.manager_id RIGHT JOIN roles ON employees.role_id = roles.id RIGHT JOIN departments ON departments.id = roles.dept_id ORDER BY employees.id', (err, res) => {
    if (err) throw err;
    console.table(res);
  });
};
// UPDATE EMPLOYEE ROLE
const updateEmployeeRole = () => {
  console.log('Updating employee role...\n');
  console.log('Use this table to answer the questions:\n');
  viewToUpdateRef();

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
// UPDATE EMPLOYEE MANAGER
const updateEmployeeManager = () => {
  console.log('Updating employee manager...\n');
  console.log('Use this table to answer the questions:\n');
  viewToUpdateRef();

  const delay = () => {
    inquirer
      .prompt([
        {
          name: 'e_id',
          type: 'input',
          message: 'Id number of the employee whose manager to be updated?',
        },
        {
          name: 'manager_id',
          type: 'input',
          message: 'Id number of the employee who will be the new manager?',
        },
      ])
      .then((answer) => {
        connection.query('UPDATE employees SET ? WHERE ?',
          [
            {
              manager_id: answer.manager_id,
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
}
// UPDATE EMPLOYEE MANAGER
const updateEmployeeManager = () => {
  console.log('Updating employee manager...\n');
  console.log('Use this table to answer the questions:\n');
  viewToUpdateRef();

  const delay = () => {
    inquirer
      .prompt([
        {
          name: 'e_id',
          type: 'input',
          message: 'Id number of the employee whose manager to be updated?',
        },
        {
          name: 'manager_id',
          type: 'input',
          message: 'Id number of the employee who will be the new manager?',
        },
      ])
      .then((answer) => {
        connection.query('UPDATE employees SET ? WHERE ?',
          [
            {
              manager_id: answer.manager_id,
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
}
// DELETE EMPLOYEE RECORD
const deleteEmployeeRecord = () => {
  console.log('Deleting an employee record...\n');

  // const dynamicEmployees = () => {

    // 1. query the database for all employees, get the latest set and form an array with employee names.
    connection.query('SELECT * FROM employees', (err, results) => {
      const employeesArray = [];
      results.forEach((res) => {
        employeesArray.push(`${res.first_name} ${res.last_name}`);
      });
      if (err) throw err;
      employeesArray.push(`${new inquirer.Separator()}`);

      // 2. start the inquirer function, use the array of employees as choices and get an answer for the employee name.
      inquirer
        .prompt([
          {
            name: 'employee_name',
            type: 'list',
            message: 'Name of the employee whose record is to be deleted?',
            choices() {
              const employeesArray = [];
              results.forEach((res) => {
                employeesArray.push(`${res.first_name} ${res.last_name}`)
              });
              return employeesArray;
            },
          },
        ])
        .then((answer) => {
          // get the information of the chosen item
          let chosenEmployee;
          console.log(answer.employee_name);
          results.forEach((employee) => {
            if ((`${employee.first_name} ${employee.last_name}`) === (answer.employee_name)) {
              chosenEmployee = employee;
            }
          });
       
          connection.query('DELETE FROM employees WHERE employees.id = ?',
          chosenEmployee.id,            
          (error) => {
            if (error) throw err;
            console.log('Record was deleted successfully!\n');
            trackerMenu();
          }
          );
        });
    });
};
// DELETE ROLE
const deleteRole = () => {
  console.log('Deleting role...\n');
  connection.query('SELECT * FROM roles', (err, results) => {
    inquirer
      .prompt([
        {
          name: 'title',
          type: 'list',
          message: 'Title of the role to be deleted?',
          choices() {
            const rolesArray = [];
            results.forEach((res) => {
              rolesArray.push(res.title);
            });
            rolesArray.push(`${new inquirer.Separator()}`);
            return rolesArray;
          },
        },
      ])
      .then((answer) => {
        // get the information of the chosen item
        let chosenTitle;
        results.forEach((role) => {
          if (role.title === answer.title) {
            chosenTitle = role;
          }
        });

        connection.query('DELETE FROM roles WHERE roles.id = ?',
          chosenTitle.id,
          (error) => {
            if (error) throw err;
            console.log('Role was deleted successfully!\n');
            trackerMenu();
          }
        );
      });
  });
}
// DELETE DEPARTMENT
const deleteDepartment = () => {
  console.log('Deleting department...\n');
  connection.query('SELECT * FROM departments', (err, results) => {
    inquirer
      .prompt([
        {
          name: 'dept_name',
          type: 'list',
          message: 'Name of the department to be deleted?',
          choices() {
            const departmentsArray = [];
            results.forEach((res) => {
              departmentsArray.push(res.dept_name);
            });
            departmentsArray.push(`${new inquirer.Separator()}`);
            return departmentsArray;
          },
        },
      ])
      .then((answer) => {
        // get the information of the chosen item
        let chosenDepartment;
        results.forEach((department) => {
          if (department.dept_name === (answer.dept_name)) {
            chosenDepartment = department;
          }
        });

        connection.query('DELETE FROM departments WHERE departments.id = ?',
          chosenDepartment.id,
          (error) => {
            if (error) throw err;
            console.log('Department was deleted successfully!\n');
            trackerMenu();
          }
        );
      });
  });
}
// VIEW BUDGET OF A DEPARTMENT
const viewBudgetDepartment = () => {
  console.log('Viewing the department budget...\n');
  connection.query('SELECT * FROM departments', (err, results) => {
    const departmentsArray = [];
    results.forEach((res) => {
      departmentsArray.push(res.dept_name);
    });
    if (err) throw err;
console.log(departmentsArray);
    inquirer
      .prompt([
        {
          name: 'dept_name',
          type: 'list',
          message: 'Which department budget is to be viewed?',
          choices: departmentsArray,
        }
      ])
      .then((answer) => {
        let chosenDepartment;
        results.forEach((department) => {
          if (department.dept_name === answer.dept_name) {
            chosenDepartment = department;
          }
        });
      
        connection.query('SELECT CONCAT(first_name, " ", last_name) AS employee_name, salary FROM employees INNER JOIN roles ON employees.role_id = roles.id INNER JOIN departments ON departments.id = roles.dept_id WHERE dept_id = ? UNION ALL SELECT "Total:" employee_name, sum(salary) FROM employees INNER JOIN roles ON employees.role_id = roles.id INNER JOIN departments ON departments.id = roles.dept_id WHERE dept_id = ?',
        [chosenDepartment.id, chosenDepartment.id],
        (err, res) => {
          if (err) throw err;
          console.log('Department budget was calculated successfully!\n');
          console.table(res);
          trackerMenu();
        });
      });  
  });
};


// Extra departments search 
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
          if (department.dept_name === answer.dept_name) {
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

