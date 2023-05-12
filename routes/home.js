const express = require('express');
const router = express.Router();
const con = require('../database');
let user = '';

router.use(logger);

router
.route("/")
// Gets messages
.get((req, res, next) => {
  con.query("SELECT * FROM messages", (err, data) => {
    if (err) {
      throw err;
    } else {
    res.render('home', 
      {
        action: 'receive',
        username: user,
        messages: data
      });
    }
  })
})
// Actually logs user in
.post((req, res) => {
  user = req.body.username;
  con.query("SELECT * FROM account WHERE username = ?",
  user,
    (err, result) => {
          if (err) throw err;
          const userPass = req.body.password;
          if (userPass === result[0].password){
            console.log("Logged in!");
            res.render('home',
              {
                action: 'login',
                username: user
                })
          } else {
            console.log("Problem logging in");
            res.redirect('home.html');
          }
        })
})
// .post((req, res) => {
//   con.query("INSERT INTO messages(SentToID, SentFromID, Message) VALUES(?, ?, ?)",
//     [
//       2,
//       1,
//       req.body.message.toString()
//     ],
//     (err, result) => {
//     if (err) throw err;
//     console.log("Data added to Message table.");
//     // res.render('home');    
//   })
// })

function logger(req, res, next){
    next();
  }

module.exports = router; 