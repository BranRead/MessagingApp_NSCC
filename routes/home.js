const express = require('express');
const router = express.Router();
const con = require('../database');
let user = '';
let sendTo = '';
let ID = 0; 
const loginInfo = {
  action: 'login',
  username: '',
  id: 0,
  friendlist: []
}
let list = [];


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
        id: ID,
        sendTo: sendTo,
        messages: data,
        friendlist: list
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
          ID = result[0].ID;
            con.query("SELECT PersonA_ID, PersonB_ID FROM friends where ? = PersonA_ID OR ? = PersonB_ID;",
              [ID, ID], (err, result) => {
                if (err) throw err;
                let query = "SELECT A.ID, A.username, P.fName, P.lName FROM account AS A INNER JOIN person AS P ON A.ID = P.ID WHERE ";
                let flag = false;
                result.forEach((value) => {
                  if(value.PersonA_ID != ID){
                    
                    if(!flag){
                      query += "A.ID = " + value.PersonA_ID;
                      flag = true;
                    } else {
                      query += " OR A.ID = " + value.PersonA_ID;
                    }
                  } else {
                    
                    if(!flag){
                      query += "A.ID = " + value.PersonB_ID;
                      flag = true;
                    } else {
                      query += " OR A.ID = " + value.PersonB_ID;
                    }
                  }
                })
                
                con.query(query, (err, result) => {
                  if (err) throw err;
                  list = result;
                  loginInfo.username = user;
                  loginInfo.id = ID;
                  loginInfo.friendlist = list;
                
                  res.render('home', loginInfo)
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

// function getDetails(connection){

//   if (ID !== connection.PersonA_ID){
//     con.query("SELECT A.ID, A.username, P.fName, P.lName FROM account AS A INNER JOIN person AS P ON A.ID = P.ID WHERE A.ID = ?;",
//     [connection.PersonA_ID],
//     (err, details) => {
//       if (err) throw err;
//       let account = {
//         ID: details[0].ID, 
//         Username: details[0].username,
//         firstName: details[0].fName,
//         lastName: details[0].lName
//       }
//       friendsArray.push(account);
//     })
//   } else {
//     con.query("SELECT A.ID, A.username, P.fName, P.lName FROM account AS A INNER JOIN person AS P ON A.ID = P.ID WHERE A.ID = ?;",
//     [connection.PersonB_ID],
//     (err, details) => {
//       if (err) throw err;
//       let account = {
//         ID: details[0].ID, 
//         username: details[0].username,
//         firstName: details[0].fName,
//         lastName: details[0].lName
//       }
//       friendsArray.push(account);
//       console.log("query");
//       console.log({friendsArray});
//     })
//   }
// }
  


module.exports = router; 