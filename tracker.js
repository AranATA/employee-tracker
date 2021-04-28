const connection = require('./connect');
const mysql = require('mysql');
const inquirer = require('inquirer');
const chalk = require('chalk');
const table = require('console.table');
          
// MAIN MENU What would you like to do?
const trackerMenu = () => {
  
  const delay = () => {
    inquirer
    .prompt({
      name: 'menu',
      type: 'rawlist',
      message: 'What would you like to do with the tracker app?\n',
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
    })
  }
  setTimeout(delay, 250);

};

// VIEW ALL EMPLOYEES (complete)
const viewAllEmployee = () => {
  console.log('Viewing all employees...\n');
  connection.query('SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.dept_name, roles.salary, CONCAT(manager_name.first_name, " ", manager_name.last_name) AS manager_name FROM employees LEFT JOIN employees manager_name ON manager_name.id = employees.manager_id LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON departments.id = roles.dept_id ORDER BY employees.id', (err, res) => {
    if (err) throw err;
    // Table all results of the SELECT statement
    console.table(res);
    trackerMenu();
    // connection.end();
  });
};
// VIEW ALL EMPLOYEES BY DEPARTMENT (complete)
const viewAllEmployeeByDepartment = () => {
  console.log('Viewing all employees by department...\n');
  connection.query('SELECT dept_name, CONCAT(first_name, " ", last_name) AS employee_name FROM employees JOIN roles ON employees.role_id = roles.id JOIN departments ON departments.id =roles.dept_id ORDER BY dept_name', (err, res) => {
    if (err) throw err;
    console.table(res);
    trackerMenu();
  });
};
// VIEW ALL EMPLOYEES BY MANAGER (complete)
// NEW VERSION (JOIN)
const viewAllEmployeeByManager = () => {
  console.log('Viewing all employees by manager...\n');
  connection.query('SELECT CONCAT(manager_name.first_name, " ", manager_name.last_name) AS manager_name, CONCAT(employees.first_name, " ", employees.last_name) AS employee_name FROM employees LEFT JOIN employees manager_name ON manager_name.id = employees.manager_id ORDER BY manager_name', (err, res) => {
    if (err) throw err;
    console.table(res);
    trackerMenu();
  });
};
// ADD NEW EMPLOYEE (complete)
const addNewEmployee = () => {
  console.log('Adding a new employee...\n');
  const rolesArray = [];
  const managersArray = [];
  let chosenRole;
  let chosenRoleId;
  let chosenManager;
  let chosenManagerId;
  let firstName;
  let lastName;
  
  const dataSetA = () => {
    connection.query('SELECT * FROM roles', (err, results) => {
      results.forEach((res) => {
        rolesArray.push(res.title);
      });
      if (err) throw err;
      rolesArray.push(`${new inquirer.Separator()}`);
      inquirer
        .prompt([
          {
            name: 'first_name',
            type: 'input',
            message: 'First name of the new employee?'
          },
          {
            name: 'last_name',
            type: 'input',
            message: 'Last name of the new employee?'
          },
          {
            name: 'title',
            type: 'list',
            message: 'Title of the new employee?',
            choices: rolesArray,
          },
        ])
        .then((answer) => {
          results.forEach((role) => {
            if (role.title === answer.title) {
              chosenRole = role;
              chosenRoleId = role.id;
            }          
          });
          firstName = answer.first_name;
          lastName = answer.last_name;
          dataSetB();
        });  
    });
  }

  const dataSetB = () => {
    connection.query('SELECT DISTINCT manager_name.id, CONCAT(manager_name.first_name, " ", manager_name.last_name) AS manager_name FROM employees INNER JOIN employees manager_name ON manager_name.id = employees.manager_id', (err, results) => {
      results.forEach((res) => {
        managersArray.push(res.manager_name);
      });
      if (err) throw err;
      
      inquirer
        .prompt([
          {
            name: 'manager',
            type: 'list',
            message: 'Name of the new employee manager?',
            choices: managersArray,
          }
        ])
               
        .then((answer) => {
          results.forEach((man) => {
            if (man.manager_name === answer.manager) {
              chosenManager = man;
              chosenManagerId = man.id;
            }
          });
          insertData();
        });
    });
  }

 
  const insertData = () => {
    connection.query('INSERT INTO employees SET ?',
    {
      first_name: firstName,
      last_name: lastName,
      role_id: chosenRoleId,
      manager_id: chosenManagerId
    },
    (err) => {
    if (err) throw err;
      console.log(`${firstName} ${lastName} was added successfully!`);
      trackerMenu();
    }
  );
};

dataSetA();
};

// ADD NEW ROLE (complete)
const addNewRole = () => {
  console.log('Adding a new role...\n');
  const departmentsArray = [];
  let chosenDepartment;
  let chosenDepartmentId;
  let roleTitle;
  let roleSalary;
  
  const dataSet = () => {
    connection.query('SELECT * FROM departments', (err, results) => {
      results.forEach((res) => {
        departmentsArray.push(res.dept_name);
      });
      if (err) throw err;
      
      inquirer
        .prompt([
          {
            name: 'title',
            type: 'input',
            message: 'Title of the new role?'
          },
          {
            name: 'salary',
            type: 'input',
            message: 'Salary of the new role?'
          },
          {
            name: 'department',
            type: 'list',
            message: 'Department of the new role?',
            choices: departmentsArray,
          },
        ])
        .then((answer) => {
          results.forEach((dept) => {
            if (dept.dept_name === answer.department) {
              chosenDepartment = dept;
              chosenDepartmentId = dept.id;
            }          
          });
          roleTitle = answer.title;
          roleSalary = answer.salary;
          insertData();
        });  
    });
  }
  const insertData = () => {
    connection.query('INSERT INTO roles SET ?',
    {
      title: roleTitle,
      salary: roleSalary,
      dept_id: chosenDepartmentId,
    },
    (err) => {
    if (err) throw err;
      console.log(`${roleTitle} was added successfully!`);
      trackerMenu();
    }
  );
};

  dataSet();
};

// ADD NEW DEPARTMENT (complete)
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

// UPDATE EMPLOYEE ROLE (complete)
const updateEmployeeRole = () => {
  console.log('Updating employee role...\n');
  const employeesArray = [];
  const rolesArray = [];
  const departmentsArray = [];
  let chosenEmployee;
  let chosenEmployeeId;
  let chosenRole;
  let chosenRoleId;
  let chosenDepartment;
  let chosenDepartmentId;
  let roleSalary;

  const dataSet = () => {
    connection.query('SELECT DISTINCT IFNULL(employees.id, "00") AS emps_id, IFNULL(CONCAT(first_name, " ", last_name), "empty") AS employee_name, IFNULL(roles.id, "00") AS roles_id, IFNULL(roles.title, "empty") AS title, departments.id AS depts_id, dept_name FROM roles LEFT JOIN employees ON employees.role_id = roles.id RIGHT JOIN departments ON roles.dept_id = departments.id ORDER BY employees.id;', (err, results) => {
      results.forEach((res) => {
        employeesArray.push(res.employee_name);
        rolesArray.push(res.title);
        departmentsArray.push(res.dept_name);
      });
      if (err) throw err;
      console.log('Use this table to review the current roles:\n');
      console.table(results);
      inquirer
        .prompt([
          {
            name: 'employeeNames',
            type: 'list',
            message: 'Name of the employee whose role to be updated?',
            choices: employeesArray,
          },
          {
            name: 'title',
            type: 'list',
            message: 'Title of the updated role?',
            choices: rolesArray
          },
          {
            name: 'salary',
            type: 'input',
            message: 'Salary of the updated role?'
          },
          {
            name: 'department',
            type: 'list',
            message: 'Department of the updated role?',
            choices: departmentsArray
          },
        ])
        .then((answer) => {
          results.forEach((field) => {
            if (field.employee_name === answer.employeeNames) {
              chosenEmployee = field;
              chosenEmployeeId = field.emps_id;
            };
          });
          results.forEach((field) => {
            if (field.title === answer.title) {
              chosenRole = field;
              chosenRoleId = field.roles_id;
            };
          });  
          results.forEach((field) => {
            if (field.dept_name === answer.department) {
              chosenDepartment = field;
              chosenDepartmentId = field.depts_id;
            };                
          });
          roleSalary = answer.salary;
          updateData();
        });  
    });
  };
  const updateData = () => {
    connection.query(`UPDATE employees, roles SET employees.role_id = ${chosenRoleId}, roles.salary = ${roleSalary}, roles.dept_id = ${chosenDepartmentId} WHERE employees.id = ${chosenEmployeeId} AND roles.id = ${chosenRoleId};`,
      
      (err) => {
      if (err) throw err;
        console.log(chalk.green(`${chosenEmployee.employee_name} was updated to a role of ${chosenRole.title} successfully!\n`));
        trackerMenu();
      }
    );
  };

  dataSet();
};  

// UPDATE EMPLOYEE MANAGER 
const updateEmployeeManager = () => {
  console.log('Updating employee manager...\n');
  // console.log('Use this table to answer the questions:\n');
  // viewAllEmployee();
  const employeesArray = [];
  let chosenEmployee;
  let chosenEmployeeId;
  let chosenManager;
  let chosenManagerId;

  const dataSet = () => {
    connection.query('SELECT employees.id, CONCAT(employees.first_name, " ", employees.last_name) AS employee_name, IFNULL(CONCAT(manager_name.first_name, " ", manager_name.last_name), "M") AS manager_name FROM employees LEFT JOIN employees manager_name ON manager_name.id = employees.manager_id ORDER BY employees.id;', (err, results) => {
      results.forEach((res) => {
        employeesArray.push(res.employee_name);
        
      });
      if (err) throw err;
     
      inquirer
        .prompt([
          {
            name: 'employeeNames',
            type: 'list',
            message: 'Name of the employee whose manager to be updated?',
            choices: employeesArray,
          },
          {
            name: 'managerNames',
            type: 'list',
            message: 'Name of the employee to be the manager?',
            choices: employeesArray,
          },
        ])
        .then((answer) => {
          results.forEach((emp) => {
            if (emp.employee_name === answer.employeeNames) {
              chosenEmployee = emp;
              chosenEmployeeId = emp.id;
            };
          });  
          results.forEach((emp) => {
            if (emp.employee_name === answer.managerNames) {
              chosenManager = emp;
              chosenManagerId = emp.id;
            };
          });
          updateData();
        });  
    });
  };
  const updateData = () => {
    connection.query('UPDATE employees SET ? WHERE ?',
    [
      {
        manager_id: chosenManagerId,
      },
      {
        id: chosenEmployeeId,
      },
    ],
      (err) => {
      if (err) throw err;
        console.log(chalk.green(`${chosenManager.employee_name} was appointed as the new manager of ${chosenEmployee.employee_name} successfully!\n`));
        trackerMenu();
      }
    );
  };

  dataSet();
};  

// DELETE EMPLOYEE RECORD
const deleteEmployeeRecord = () => {
  console.log('Deleting an employee record...\n');
  connection.query('SELECT * FROM employees', (err, results) => {
    // Alternatively, this time inside the inquirer: query the database for all employees, get the latest set and form an array with employee names.
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
            employeesArray.push(`${new inquirer.Separator()}`);
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
          if (role.title === (answer.title)) {
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
};
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
          if (department.dept_name === answer.dept_name) {
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
};
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

module.exports = trackerMenu;
