const inquirer = require('inquirer');

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

const viewAllEmployee = () => {
  console.log('Viewing all employees...\n');
  connection.query('SELECT * FROM employees', (err, res) => {
    if (err) throw err;
    // Table all results of the SELECT statement
    console.table(res);
    connection.end();
  });
};  
