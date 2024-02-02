const mysql = require('mysql');

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "employmentdash"
});
module.exports = db;