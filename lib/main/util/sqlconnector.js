const mysql = require("mysql");
const Config = require("../../config/config.js");
const connection = mysql.createConnection({
    host: Config.config.db.host, //connection parameter
    user: Config.config.db.user, // username
    password: Config.config.db.password, //password
    port:Config.config.db.port,
    database: Config.config.db.database
  });

//this.#connection.query(`CREATE TABLE INFOR (name VARCHAR(255) UNIQUE, age INTEGER, weight INTEGER ,height INTEGER, PRIMARY KEY (name));`);
module.exports = {
  connection
}