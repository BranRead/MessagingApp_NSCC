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
const accountInfo = {
  ID: 0,
  Username: '',
  FirstName: '',
  LastName: '', 
  Email: '',
  Password: ''
}


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
      user = result[0].username;
      const userPass = req.body.password;
        accountInfo.Password = result[0].password;
        if (userPass === result[0].password){
          // exports.var1 = user;
          ID = result[0].ID;
            login(res);
          } else {
            console.log("Problem logging in");
            res.redirect('index.html');
          }
  })
})

router
.route("/return")
.post((req, res) => {
  login(res);
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

router.route("/delete").post((req, res) => {
  console.log("Working")
  con.query("DELETE FROM friends WHERE FriReqID = " + req.body.ReqID,
  (err, result) => {
    if (err) throw err;
    login(res);
  })
})

router
.route("/search")
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

router
.route("/account")
.post((req, res) => {
  con.query("SELECT * FROM person WHERE ID = " + ID, 
  (err, result) => {
    console.log(ID);
    accountInfo.FirstName = result[0].fName;
    accountInfo.LastName = result[0].lName;
    accountInfo.Email = result[0].Email;
    con.query("SELECT * FROM account WHERE ID = " + ID,
    (err, result) => {
      accountInfo.Username = result[0].username;
      accountInfo.Password = result[0].password;
      res.render('account', accountInfo);
    })
  })
})

router
.route("/account/username")
.post((req, res) => {
  let newUsername = req.body.username;
  if(newUsername != " "){
    con.query("UPDATE account SET username = '" + newUsername + "' WHERE ID = " + ID,
    (err, result) => {
      if(err) throw err;
      accountInfo.Username = newUsername;
      res.render('account', accountInfo)
    })
  } else {
    res.render('account', accountInfo);
  }
})

router
.route("/account/name")
.post((req, res) => {
  let newFName = req.body.fName;
  let newLName = req.body.lName;

  if(newFName != " " && newFName.length > 0){
    con.query("UPDATE person SET fName = '" + newFName + "' WHERE ID = " + ID,
    (err, result) => {
      if(err) throw err;
      accountInfo.FirstName = newFName;
    })
  }
  
  if(newLName != " " && newLName.length > 0){
    con.query("UPDATE person SET lName = '" + newLName + "' WHERE ID = " + ID,
    (err, result) => {
      if(err) throw err;
      accountInfo.LastName = newLName;
      res.render('account', accountInfo)
    })
  } else {
    res.render('account', accountInfo);
  }
})

router
.route("/account/email")
.post((req, res) => {
  let newEmail = req.body.email;
  if(newEmail != " ") {
    con.query("UPDATE person SET email = '" + newEmail + "' WHERE ID = " + ID,
    (err, result) => {
      if(err) throw err;
      accountInfo.Email = newEmail;
      res.render('account', accountInfo)
    })
  } else {
    res.render('account');
  }
})

router
.route("/account/password")
.post((req, res) => {
  let oldPassword = req.body.oldPassword;
  let newPassword = req.body.newPassword;
  let confirmNewPassword = req.body.confirmNewPassword;

  if(accountInfo.Password === oldPassword) {
    if(newPassword === confirmNewPassword) {
      con.query("UPDATE account SET password = '" + newPassword + "' WHERE ID = " + ID,
    (err, result) => {
      if(err) throw err;
      accountInfo.Password = newPassword;
      res.render('account', accountInfo)
    })
    } else {
      console.log("Wrong new password")
      res.render('account', accountInfo);
    }
  } else {
    console.log("Wrong old password")
    res.render('account', accountInfo);
  }

  
})

function logger(req, res, next){
    next();
}


function login(res){
  con.query("SELECT FriReqID, SentToID, SentFromID FROM friends where ? = SentToID AND Verified = 1 OR ? = SentFromID AND Verified = 1 ;",
              [ID, ID], (err, friend) => {
                if (err) throw err;
                list = [];
                if (friend.length > 0) {
                  friend.forEach((person) => {
                    let FriendID = 0;
                    if(person.SentToID != ID) {
                      FriendID = person.SentToID
                    } else {
                      FriendID = person.SentFromID
                    }
                    list.push({
                      ReqID: person.FriReqID,
                      FriID: FriendID,
                      FriUsername: ''

                    })
                  })
                  let query = "SELECT username FROM account WHERE ID = " +
                   list[0].FriID;

                   for(let i=1; i < list.length; i++){
                    query += " OR ID = " + list[i].FriID
                   }
                  
                  // friend.forEach((value) => {
                  //   if(value.SentToID != ID){
                  //     if(!flag){
                  //       query += "A.ID = " + value.SentToID;
                  //       flag = true;
                  //     } else {
                  //       query += " OR A.ID = " + value.SentToID;
                  //     }
                  //   } else {

                  //     if(!flag){
                  //       query += "A.ID = " + value.SentFromID;
                  //       flag = true;
                  //     } else {
                  //       query += " OR A.ID = " + value.SentFromID;
                  //     }
                  //   }
                  // })
                
                con.query(query, (err, result) => {
                  if (err) throw err;
                  // list = result;
                  for(let i = 0; i < result.length; i++){
                    
                    list[i].FriUsername = result[i].username
                  }

                  con.query("SELECT F.FriReqID, A.username FROM friends as F INNER JOIN account as A ON F.SentFromID=A.ID WHERE F.SentToID=" + ID + " AND F.Verified = 0",
                  (err, friendRequests) => {
                    if(err) throw err;

                    

                    friendRequests = friendRequests;
                    loginInfo.username = user;
                    accountInfo.Username = user;
                    loginInfo.id = ID;
                    accountInfo.ID = ID;
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