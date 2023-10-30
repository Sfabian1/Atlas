const mysql = require("mysql");
const connection = mysql.createConnection({
    host: "mysql-3d532cd0-testvapp.a.aivencloud.com", //connection parameter
    user: "avnadmin", // username
    password: "AVNS_rpXTNpZ2xrc8dNe-ih6", //password
    port:20550,
    database: "defaultdb"
  });

//this.#connection.query(`CREATE TABLE INFOR (name VARCHAR(255) UNIQUE, age INTEGER, weight INTEGER ,height INTEGER, PRIMARY KEY (name));`);
