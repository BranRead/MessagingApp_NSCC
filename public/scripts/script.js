const addFriendBtn = document.getElementById("addFriend");
const friendSearch = document.querySelector(".popup-add");
const friendReqBtn = document.getElementById("notif");
const friendReqScreen = document.getElementById(".friend-requests");

// popupWindow(addFriendBtn, friendSearch);
// popupWindow(friendReqBtn, friendReqScreen);

// function popupWindow (btn, popupWindow){
//   btn.addEventListener("click", () => {
//     if(popupWindow.style.opacity == 0){
//       popupWindow.style.opacity = 1
//     } else {
//       popupWindow.style.display = 'none'
//       popupWindow.style.opacity = 0
//     }
//   })
// }




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

//   const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
// const appendAlert = (message, type) => {
//   const wrapper = document.createElement('div')
//   wrapper.innerHTML = [
//     `<div class="alert alert-${type} alert-dismissible" role="alert">`,
//     `   <div>${message}</div>`,
//     '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
//     '</div>'
//   ].join('')

//   alertPlaceholder.append(wrapper)
// }

// const alertTrigger = document.getElementById('liveAlertBtn')
// if (alertTrigger) {
//   alertTrigger.addEventListener('click', () => {
//     appendAlert('Nice, you triggered this alert message!', 'success')
//   })
// }
