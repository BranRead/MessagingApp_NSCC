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
  friendRequests: [],
}
let list = [];
let requests = [];


router.use(logger);

router
.route("/accept")
.post((req, res) => {
    let friendRequestID = req.body.reqID;
    con.query("UPDATE friend SET Verified = 1 WHERE FriReqID = " + friendRequestID, 
    (err, result) =>
        
    )
})

router
.route("/decline")


function logger(req, res, next){
    next();
}

module.exports = router; 