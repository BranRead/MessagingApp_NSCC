const express = require('express');
const router = express.Router();
const con = require('../database');
let user = '';
let sendTo = '';
let ID = 0; 
let friendID = 0;
const loginInfo = {
  action: 'login',
  username: '',
  id: 0,
  friendlist: [],
  requests: [],
}
let list = [];
let requests = [];


router.use(logger);

router
.route("/")
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
            login(res);
          } else {
            console.log("Problem logging in");
            res.redirect('index.html');
          }
  })
})

router.
route("/messages")
// Gets messages
.post((req, res, next) => {
  let userFriend = req.body.userF;
  con.query("SELECT ID FROM account WHERE username =?", userFriend, (err, data) => {
    if (err) {
      throw err;
    } else {
      friendID = data[0].ID
      con.query("SELECT * FROM messages WHERE (SentToID = " + friendID + " AND SentFromID = " + ID + ") OR (SentToID = " + ID + " AND SentFromID = " + friendID + ");",
      (err, messages) => {
        if(err){
          throw err;
        } else {
          res.render('home', 
            {
              action: 'receive',
              username: user,
              userFriend: userFriend,
              id: ID,
              friendID: friendID,
              messages: messages,
              friendlist: list
            });
            
        }
      }
  )}
  })
})

router.
route("/search")
.post((req, res) => {
  const added = req.body.username;
  console.log(1 + added + 1);
  con.query("SELECT ID FROM account where username='" + added + "';",
  (err, success) => {
    if (err) {
      console.log("User not found");
    } else {
      const addedID = success[0].ID;
      con.query("INSERT INTO friends(SentToID, SentFromID, Verified) VALUES(" + addedID + ", " + ID + ", 0);",
      (err, success) => {
        if (err) throw err;
        console.log("Request sent");
      })
    }
  })
})

router.
route("/send")
.post((req, res) => {
  con.query("INSERT INTO messages(SentToID, SentFromID, Message) VALUES(?, ?, ?)",
    [
      friendID,
      ID,
      req.body.message.toString()
    ],
    (err, result) => {
    if (err) throw err;
    console.log("Data added to Message table.");
    // res.render('home');    
  })
})

router
.route("/accept")
.post((req, res) => {
    let friendRequestID = req.body.reqID;
    con.query("UPDATE friends SET Verified = 1 WHERE FriReqID = " + friendRequestID, 
    (err, result) => {
      login(res);
  })
})

router
.route("/decline")
.post((req, res) => {
  let friendRequestID = req.body.reqID;
  con.query("DELETE FROM friends WHERE FriReqID = " + friendRequestID, 
  (err, result) => {
    login(res);
  })
})

function logger(req, res, next){
    next();
}


function login(res){
  con.query("SELECT SentToID, SentFromID FROM friends where ? = SentToID AND Verified = 1 OR ? = SentFromID AND Verified = 1 ;",
              [ID, ID], (err, result) => {
                if (err) throw err;
                if (result.length > 0) {
                  let query = "SELECT A.ID, A.username, P.fName, P.lName FROM account AS A INNER JOIN person AS P ON A.ID = P.ID WHERE ";
                  let flag = false;
                  result.forEach((value) => {
                    if(value.SentToID != ID){
                      if(!flag){
                        query += "A.ID = " + value.SentToID;
                        flag = true;
                      } else {
                        query += " OR A.ID = " + value.SentToID;
                      }
                    } else {

                      if(!flag){
                        query += "A.ID = " + value.SentFromID;
                        flag = true;
                      } else {
                        query += " OR A.ID = " + value.SentFromID;
                      }
                    }
                  })
                
                con.query(query, (err, result) => {
                  if (err) throw err;
                  list = result;

                  con.query("SELECT F.FriReqID, A.username FROM friends as F INNER JOIN account as A ON F.SentFromID=A.ID WHERE F.SentToID=" + ID + " AND F.Verified = 0",
                  (err, friendRequests) => {
                    if(err) throw err;

                    friendRequests = friendRequests;
                    loginInfo.username = user;
                    loginInfo.id = ID;
                    loginInfo.friendlist = list;
                    loginInfo.requests = friendRequests;

                    res.render('home', loginInfo)
                  });
                    
                    
                }) 
              } else {
                list = [];
                con.query("SELECT F.FriReqID, A.username FROM friends as F INNER JOIN account as A ON F.SentFromID=A.ID WHERE F.SentToID=" + ID + " AND F.Verified = 0",
                  (err, friendRequests) => {
                    if(err) throw err;

                    friendRequests = friendRequests;
                    loginInfo.username = user;
                    loginInfo.id = ID;
                    loginInfo.friendlist = list;
                    loginInfo.requests = friendRequests;

                    res.render('home', loginInfo)
              })
            }
          })
        }

module.exports = router; 