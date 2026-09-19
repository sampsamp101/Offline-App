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
const contactsByUser = JSON.parse(localStorage.getItem("contactsByUser") || "{}");
const userContactListArr =  contactsByUser[currentUser] || [];  

addContacts.addEventListener('click', ()=>{
  if(userAdd.value === ""){
    paraWarning.textContent = "Type in user to add to your contact list!";    
    return;
  } 
  else if(userAdd.value.toLowerCase() === currentUser.toLowerCase()){
    paraWarning.textContent = "You can't add yourself to the contact list";
    return;
  }
  else{
    const usersExistingContacts = JSON.parse(localStorage.getItem('contactsByUser') || "{}"); 
    if (!usersExistingContacts[currentUser]){
      usersExistingContacts[currentUser] = [userAdd.value];
      localStorage.setItem('contactsByUser', JSON.stringify(usersExistingContacts));
      paraWarning.textContent = `user ${userAdd.value} added to your contact list!`;
     contactWrapperCurrent.innerHTML +=`<div id="contacts-message-wrapper"><p>${userAdd.value}</p><button class="msg">Message</button></div>`;
      return;
    }
    else{
     const currentUserContactsNetwork = usersExistingContacts[currentUser] || [];
      if (currentUserContactsNetwork.includes(userAdd.value)){
        paraWarning.textContent = `${userAdd.value} is already in your contact list!`;
        return;
      }
      currentUserContactsNetwork.push(userAdd.value);
      localStorage.setItem('contactsByUser', JSON.stringify(usersExistingContacts));
      paraWarning.textContent = `${userAdd.value} added to your contact list!`;
      contactWrapperCurrent.innerHTML +=`<div id="contacts-message-wrapper"><p>${userAdd.value}</p><button class="msg">Message</button></div>`;
    }
  } 
});

logout.addEventListener('click', (event) => {
  event.preventDefault();
  localStorage.removeItem("currentUser");
  window.location.href = "/login_account/login-account.html";
});


clearLocalStorage.addEventListener('click',()=>{
    localStorage.clear();
    paraWarning.innerHTML = "";
    contactWrapperCurrent.innerHTML = "";
});

document.addEventListener('DOMContentLoaded',()=>{
  if (logout){
    userName.textContent = currentUser;
  }
  for (const existingContacts of userContactListArr){
    contactWrapperCurrent.innerHTML +=`<p>${existingContacts}</p>`;
  }
});
