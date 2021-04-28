<br>

## **employee tracker**<br>
<br>

[https://github.com/AranATA/employee-tracker](https://github.com/AranATA/employee-tracker)<br>
<br>
<br>

## description

***
This application aims to create a Content Management System (CMS) for managing a company's employees using nodeJS, inquirer, and MySQL. So that a business owner is able to view and manage the departments, roles, and employees in her/his company to organize and plan.
<br>
<br>

## acceptance criteria

***

The codebase achieves the following criteria:<br>

![Database Schema](assets/images/schema.png)

* **department**:

  * **id** - INT PRIMARY KEY
  * **name** - VARCHAR(30) to hold department name

* **role**:

  * **id** - INT PRIMARY KEY
  * **title** -  VARCHAR(30) to hold role title
  * **salary** -  DECIMAL to hold role salary
  * **department_id** -  INT to hold reference to department role belongs to

* **employee**:

  * **id** - INT PRIMARY KEY
  * **first_name** - VARCHAR(30) to hold employee first name
  * **last_name** - VARCHAR(30) to hold employee last name
  * **role_id** - INT to hold reference to role employee has
  * **manager_id** - INT to hold reference to another employee that manages the employee being Created. This field may be null if the employee has no manager
  
Build a command-line application that at a minimum allows the user to:

  * Add departments, roles, employees

  * View departments, roles, employees

  * Update employee roles

Bonus points if you're able to:

  * Update employee managers

  * View employees by manager

  * Delete departments, roles, and employees

  * View the total utilized budget of a department -- ie the combined salaries of all employees in that department

<br>
<br>

## usage

***

Under the link below you will find a walkthrough video that demonstrates; how a user would invoke the application from the command line, how a user would enter responses to all of the prompts in the application.<br>
If the video appears out of focus please hit the space bar twice.

[https://drive.google.com/file/d/1RJl4hiV1N2NAj54aiJzsfiLY-gF4zjpT/view](https://drive.google.com/file/d/1RJl4hiV1N2NAj54aiJzsfiLY-gF4zjpT/view)


Several screenshots that show the different prompts and displayed data:<br>
<br

![alt text](/assets/images/scrshot01.png)

<br>

![alt text](/assets/images/scrshot02.png)

<br>

![alt text](/assets/images/scrshot03.png)

<br>
<br>
## some valuable references

***

These notes and links are listing some valuable references among others that I used doing this project:<br>
<br>

[https://nodejs.dev/](https://nodejs.dev/)

[https://dev.mysql.com/](https://dev.mysql.com/)

[https://sqlbolt.com/](https://sqlbolt.com/)

[https://www.sqlteaching.com/](https://www.sqlteaching.com/)

[https://www.npmjs.com/package/console.table](https://www.npmjs.com/package/console.table)

[https://shields.io/category/dependencies/](https://shields.io/category/dependencies/)

[https://www.screencastify.com/](https://www.screencastify.com/)

<br>
<br>

## credits

***

Stephen Woosley - Bootcamp Instructor<br>
Patrick Haberern - Bootcamp TA<br>
Tim Nagorski - Bootcamp TA<br>
Sean Walmer - Bootcamp TA<br>
Alexis San Javier - Bootcamp Tutor<br>
<br>
<br>

## license

***

This is an assigment done under a bootcamp program, it is public but please contact the publisher before you use or
change any content.<br>
ghibli.github@gmail.com
<br>
<br>

## badges

***

![GitHub all releases](https://img.shields.io/github/downloads/AranATA/accessible-horiseon/total)

![GitHub language count](https://img.shields.io/github/languages/count/AranATA/accessible-horiseon)
<br>
<br>
