const logout = document.getElementById("log-out");
const userName = document.getElementById("username");
const addContacts = document.getElementById("add");
const removeContacts = document.getElementById("remove");
const userAdd = document.getElementById("search-function");
const paraWarning = document.getElementById("warning-msg");
const contactWrapperCurrent = document.getElementById("contacts-wrapper");

const clearLocalStorage = document.getElementById("clear-localStorage");

const userList = JSON.parse(localStorage.getItem("usersInfo") || "[]");
const currentUser = localStorage.getItem("currentUser") || "Guest";

let contactsByUser = JSON.parse(localStorage.getItem("contactsByUser") || "{}");
if (Array.isArray(contactsByUser) || typeof contactsByUser !== "object" || contactsByUser === null) {
  contactsByUser = {};
}
const userContactListArr = contactsByUser[currentUser] || [];

function renderContact(name) {
  contactWrapperCurrent.innerHTML +=
    `<div class="contacts-message-wrapper"><p>${name}</p><button class="msg message-btn" data-Msg-User="${name}">Message</button><button class="msg delete-btn" data-user="${name}">Delete</button></div>`;
}

addContacts.addEventListener('click', ()=>{
  const typed = userAdd.value.trim().toLowerCase();
  if(typed === ""){
    paraWarning.textContent = "Type in user to add to your contact list!";    
    return;
  } 
  else if(typed === currentUser.toLowerCase()){
    paraWarning.textContent = "You can't add yourself to the contact list";
    return;
  }
  else{
    const currentUserContactsNetwork = contactsByUser[currentUser] || [];
    if (currentUserContactsNetwork.some(user=> typed === user.toLowerCase())){
      paraWarning.textContent = `${userAdd.value} is already in your contact list!`;
      return;
    }
    for (const userRegisteredObj of userList){
      if (userRegisteredObj.user.toLowerCase() === typed){
        currentUserContactsNetwork.push(userRegisteredObj.user);
        contactsByUser[currentUser] = currentUserContactsNetwork;
        localStorage.setItem('contactsByUser', JSON.stringify(contactsByUser));
        paraWarning.textContent = `${userRegisteredObj.user} added to your contact list!`;
        renderContact(userRegisteredObj.user);
        return;
      }
    }
    paraWarning.textContent = `The user is not registered!`;
    return;
  } 
});

logout.addEventListener('click', (event) => {
  event.preventDefault();
  localStorage.removeItem("currentUser");
  window.location.href = "/login_account/login-account.html";
});

clearLocalStorage.addEventListener('click',()=>{
    localStorage.removeItem("contactByUser");
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith("Msg:")) localStorage.removeItem(key);
    }

    contactsByUser = {};
    paraWarning.innerHTML = "";
    contactWrapperCurrent.innerHTML = "";
});

document.addEventListener('DOMContentLoaded',()=>{
  if (logout){
    userName.textContent = currentUser;
  }
  contactWrapperCurrent.innerHTML = "";
  for (const existingContacts of userContactListArr){
    renderContact(existingContacts);
  }
});

contactWrapperCurrent.addEventListener('click', (e) => {
    if(e.target.classList.contains("delete-btn")){
      const name = e.target.dataset.user;
      contactsByUser[currentUser] = (contactsByUser[currentUser] || []).filter(contactName => contactName !== name);
      localStorage.setItem('contactsByUser', JSON.stringify(contactsByUser));
      e.target.closest(".contacts-message-wrapper").remove();
      paraWarning.textContent = `${name} removed from your contact list!`;
    }
      else if (e.target.classList.contains("message-btn")) {
      const name = e.target.dataset.msgUser;
      localStorage.setItem("chatWith", name);
      window.location.href = "/Chat_page/chatbox.html";
    }

});




