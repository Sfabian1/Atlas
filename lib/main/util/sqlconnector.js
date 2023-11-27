const mysql = require("mysql");
const Config = require("../../config/config.js");
const connection = mysql.createPool({
    connectionLimit : 100,
    connectTimeout  : 60 * 60 * 1000,
    acquireTimeout  : 60 * 60 * 1000,
    timeout         : 60 * 60 * 1000,
    host: Config.config.db.host, //connection parameter
    user: Config.config.db.user, // username
    password: Config.config.db.password, //password
    port:Config.config.db.port,
    database: Config.config.db.database
  });

//this.#connection.query(`CREATE TABLE INFOR (name VARCHAR(255) UNIQUE, age INTEGER, weight INTEGER ,height INTEGER, PRIMARY KEY (name));`);
module.exports = {
  connection,
  mysql
}