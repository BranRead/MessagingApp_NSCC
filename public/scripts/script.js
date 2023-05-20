const addFriendBtn = document.getElementById("addFriend");
const popup = document.querySelector(".popup-add");

addFriendBtn.addEventListener("click", () => {
  if(popup.style.opacity == 0){
    popup.style.visibility = 'visible'
    popup.style.opacity = 1
  } else {
    popup.style.visibility = 'hidden'
    popup.style.opacity = 0
  }
})

function getDetails(connection){

    if (ID !== connection.PersonA_ID){
      con.query("SELECT A.ID, A.username, P.fName, P.lName FROM account AS A INNER JOIN person AS P ON A.ID = P.ID WHERE A.ID = ?;",
      [connection.PersonA_ID],
      (err, details) => {
        if (err) throw err;
        let account = {
          ID: details[0].ID, 
          Username: details[0].username,
          firstName: details[0].fName,
          lastName: details[0].lName
        }
        friendsArray.push(account);
      })
    } else {
      con.query("SELECT A.ID, A.username, P.fName, P.lName FROM account AS A INNER JOIN person AS P ON A.ID = P.ID WHERE A.ID = ?;",
      [connection.PersonB_ID],
      (err, details) => {
        if (err) throw err;
        let account = {
          ID: details[0].ID, 
          username: details[0].username,
          firstName: details[0].fName,
          lastName: details[0].lName
        }
        friendsArray.push(account);
        console.log("query");
        console.log({friendsArray});
      })
    }
  }
