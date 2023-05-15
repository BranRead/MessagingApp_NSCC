const express = require('express');
const router = express.Router();
const con = require('../database');
let user = '';
let sendTo = '';
 


router.use(logger);

router
.route("/")
// Gets messages
.get((req, res, next) => {
  sendTo = req.body.user;
  console.log(sendTo);
  con.query("SELECT * FROM messages", (err, data) => {
    if (err) {
      throw err;
    } else {
    res.render('home', 
      {
        action: 'receive',
        username: user,
        sendTo: sendTo,
        messages: data
      });
    }
  })
})
// Actually logs user in
.post((req, res) => {
  user = req.body.username;
  const friendsArray = [];
  let ID = 0; 
  
  con.query("SELECT * FROM account WHERE username = ?",
  user,
    (err, result) => {
      if (err) throw err;
      const userPass = req.body.password;
        if (userPass === result[0].password){
          ID = result[0].ID;
            con.query("SELECT F.PersonA_ID, F.PersonB_ID FROM account INNER JOIN friends AS F ON account.ID = F.PersonA_ID OR account.ID = F.PersonB_ID where account.ID = ?",
              ID, (err, result) => {
                if (err) throw err;
                console.log("Logged in!");
                if(result.length > 0){
                  result.forEach((connection, index, array, ID, friendsArray) => {

                    if (ID !== connection.PersonA_ID){
                      con.query("SELECT A.ID, A.username, P.fName, P.lName FROM account AS A INNER JOIN person AS P ON A.ID = P.ID WHERE A.ID = ?",
                      [connection.PersonA_ID],
                      (err, details) => {
                        if (err) throw err;
                        let account = {
                          "ID": details[0].ID, 
                          "Username": details[0].username,
                          "firstName": details[0].fName,
                          "lastName": details[0].lName
                        }
                        friendsArray.push(account);
                      })
                    } else {
                      con.query("SELECT A.ID, A.username, P.fName, P.lName FROM account AS A INNER JOIN person AS P ON A.ID = P.ID WHERE A.ID = ?",
                      [connection.PersonB_ID],
                      (err, details) => {
                        if (err) throw err;
                        let account = {
                          "ID": details[0].ID, 
                          "Username": details[0].username,
                          "firstName": details[0].fName,
                          "lastName": details[0].lName
                        }
                        friendsArray.push(account);
                      })
                    }
                  });
                }
                
                res.render('home',
                  {
                    action: 'login',
                    username: user,
                    id: ID,
                    friendlist: friendsArray
                  })
              })
          } else {
            console.log("Problem logging in");
            res.redirect('home.html');
          }
  })
})

router.
route("/messages")
.post((req, res) => {
  con.query("INSERT INTO messages(SentToID, SentFromID, Message) VALUES(?, ?, ?)",
    [
      2,
      1,
      req.body.message.toString()
    ],
    (err, result) => {
    if (err) throw err;
    console.log("Data added to Message table.");
    // res.render('home');    
  })
})

function logger(req, res, next){
    next();
}

module.exports = router; 