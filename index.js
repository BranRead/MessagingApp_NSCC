const express = require('express');
const path = require('path');
var mysql = require('mysql');
var bodyParser = require('body-parser');



const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
const publicPath = path.join(__dirname);

app.use(express.static(publicPath));

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "messaging"
  });

app.post('/add', function(req, res){
  con.query("INSERT INTO Person(fName, lName, Email) VALUES(?, ?, ?)",
    [
      req.body.fName.toString(),
      req.body.lName.toString(),
      req.body.email.toString()
    ],
     function (err, result) {
    if (err) throw err;
    console.log("Data added to Person table.");

    con.query("INSERT INTO Account(ID, username, password) VALUES(?, ?, ?)",
    [
      result.insertId,
      req.body.username.toString(),
      req.body.password.toString()
    ],
     function (err, result) {
    if (err) throw err;
    console.log("Data added to Account table.");
    res.redirect('home.html');
    
  })

  })
  
})

app.post('/login', function(req, res) {
  console.log("firing");
  con.query("SELECT * FROM account WHERE username = ?",
   [req.body.username],
    function (err, result) {
          if (err) throw err;
          const userPass = req.body.password;
          if (userPass === result[0].password){
            console.log("Logged in!");
            res.redirect('messaging.html')
          } else {
            console.log("Problem logging in");
            res.redirect('home.html');
          }
        });
})

app.post('/mes', function(req, res){
  con.query("INSERT INTO messages(SentToID, SentFromID, Message) VALUES(?, ?, ?)",
    [
      2,
      1,
      req.body.message.toString()
    ],
     function (err, result) {
    if (err) throw err;
    console.log("Data added to Message table.");

    res.redirect('messaging.html');    
  })

  })
  
app.post('/disp', function(){
  con.query("SELECT message FROM messages", function (err, result) {
    if (err) throw err;
    // console.log(result[0].message);
    for(let i = 0; i < result.length; i++){
    const li = document.createElement("li");
    const node = document.createTextNode(result[i].message);
    li.appendChild(node);
    const ul = document.getElementById("messageLog");
    ul.appendChild(li);
    }
  });
})

app.listen(8000);