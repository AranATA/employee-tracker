const mysql = require('mysql');
const chalk = require('chalk');
require('dotenv').config();

// create the connection information for the sql database
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  // MySQL password from .env
  password: process.env.CLIENT_PASS,
  database: 'org_chart',
});

// connect to the mysql server and sql database
connection.connect((err) => {
  if (err) throw err;
  console.log(chalk.green(`Successfully connected to org_chart as id: ${connection.threadId}\n`));
});

module.exports = connection;