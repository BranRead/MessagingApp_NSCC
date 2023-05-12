const express = require('express');
const router = express.Router();
const con = require('../database');

router.use(logger);

router
.route("/")
.post((req, res) => {
  con.query("SELECT * FROM account WHERE username = ?",
   [req.body.username],
    (err, result) => {
          if (err) throw err;
          const userPass = req.body.password;
          if (userPass === result[0].password){
            console.log("Logged in!");
            res.render('home')
          } else {
            console.log("Problem logging in");
            res.redirect('home.html');
          }
        })
})

function logger(req, res, next){
    next();
  }

module.exports = router; 