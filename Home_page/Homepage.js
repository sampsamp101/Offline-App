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

function renderContact(name) {
  contactWrapperCurrent.innerHTML +=
    `<div class="contacts-message-wrapper"><p>${name}</p><button class="msg message-btn">Message</button><button class="msg delete-btn" data-user="${name}">Delete</button></div>`;
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
    localStorage.clear();
    for (const key in contactsByUser) delete contactsByUser[key];
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
    if(!e.target.classList.contains("delete-btn"))return;

    const name = e.target.dataset.user;
    contactsByUser[currentUser] = (contactsByUser[currentUser] || []).filter(contactName => contactName !== name);
    localStorage.setItem('contactsByUser', JSON.stringify(contactsByUser));
    e.target.closest(".contacts-message-wrapper").remove();
    paraWarning.textContent = `${name} removed from your contact list!`;
});
