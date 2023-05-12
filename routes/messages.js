const express = require('express');
const router = express.Router();
const con = require('../databasee');

router.use(logger);

router
.route("/")
.get((request, response, next) => {
  con.query("SELECT message FROM messages", (err, result) => {
    if (err) throw err;
    response.render('home', 
      {
        title: 'Messages',
        action: 'list',
        messages: result
      })
  });
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