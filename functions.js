const inquirer = require('inquirer');
// MAIN MENU What would you like to do?

function trackerStatus() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "menu",
        message: "What would you like to do with app tracker?",
        choices: ["1. View all employees", "2. View all employees by department", "3. View all employees by manager", "4. Add new employee", "5. Add new role", "6. Add new department", "7. Update employee role", "8. Update employee manager", "9. Delete employee record", "10. Delete role", "11. Delete department", "12. View a department's budget", new inquirer.Separator()],
        prefix: "-",

      }
    ])

//     .then(function (data) {
//       switch (data.empRole) {

//         case "Engineer":
//           addEngineer();
//           break;

//         case "Intern":
//           addIntern();
//           break;

//         case "No, team has been built":
//           callTeam();
//           break;
//       }
//     });
// }
}
trackerStatus();