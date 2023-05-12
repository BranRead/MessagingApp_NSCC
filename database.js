const mysql = require('mysql');

var connection = mysql.createConnection({
    host : 'localhost',
    database : 'messaging',
    user : 'root',
    password : ''
});

connection.connect(function(error){
    if(error){
        console.log("ERROR");
        throw error;
    } else {
        console.log('MySQL Database is connected!');
    }
});

module.exports = connection;