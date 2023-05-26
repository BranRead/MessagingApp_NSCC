var express = require('express');
var router = express.Router();
const con = require('../database');
router.use(logger);

router
.route("/")
.get((req, res) => {
  res.render("signup", {message: ""});
})
.post((req, res) => {
  if(req.body.password == req.body.passwordConfirm) {
    con.query("INSERT INTO Person(fName, lName, Email) VALUES(?, ?, ?)",
    [
      req.body.fName,
      req.body.lName,
      req.body.email
    ],
    (err, result) => {
    if (err) throw err;
    console.log("Data added to Person table.");
    con.query("INSERT INTO Account(ID, username, password) VALUES(?, ?, ?)",
    [
      result.insertId,
      req.body.username.toString(),
      req.body.password.toString()
    ],
    (err, result) => {
    if (err) throw err;
    console.log("Data added to Account table.");
    res.redirect('index.html');
      })
    })
  } else {
    res.render("signup", {message: "Passwords didn't match"})
  }
})

function logger(req, res, next){
  next();
}

module.exports = router;