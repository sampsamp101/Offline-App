const logout = document.getElementById("log-out");
const userName = document.getElementById("username");
const addContacts = document.getElementById("add");
const removeContacts = document.getElementById("remove");
const userAdd = document.getElementById("search-function");
const paraWarning = document.getElementById("warning-msg");
const contactWrapperCurrent = document.getElementById("contacts-wrapper");
const messageHistory = document.getElementById("message-wrapper");

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

addContacts.addEventListener('click', () => {
  const typed = userAdd.value.trim().toLowerCase();
  if (typed === "") {
    paraWarning.textContent = "Type in user to add to your contact list!";
    return;
  }
  else if (typed === currentUser.toLowerCase()) {
    paraWarning.textContent = "You can't add yourself to the contact list";
    return;
  }
  else {
    const currentUserContactsNetwork = contactsByUser[currentUser] || [];
    if (currentUserContactsNetwork.some(user => typed === user.toLowerCase())) {
      paraWarning.textContent = `${userAdd.value} is already in your contact list!`;
      return;
    }
    for (const userRegisteredObj of userList) {
      if (userRegisteredObj.user.toLowerCase() === typed) {
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

clearLocalStorage.addEventListener('click', () => {
  localStorage.removeItem("contactsByUser");
  for (const key of Object.keys(localStorage)) {
    if (key.startsWith("Msg:")) localStorage.removeItem(key);
  }
  contactsByUser = {};
  paraWarning.innerHTML = "";
  contactWrapperCurrent.innerHTML = "";
});

document.addEventListener('DOMContentLoaded', () => {
  if (logout) {
    userName.textContent = currentUser;
  }
  contactWrapperCurrent.innerHTML = "";
  for (const existingContacts of userContactListArr) {
    renderContact(existingContacts);
  }

  // const receivingMessageKey = `Msg:${chatWith}:${currentUser}`;
  for (const contactNames of userContactListArr) {
    const storageKey = `Msg:${currentUser}:${contactNames}`;
    const receivingMessageKey = `Msg:${contactNames}:${currentUser}`;
   
    const storedMsg = localStorage.getItem(storageKey);
    const newMsgArr = storedMsg ? JSON.parse(storedMsg) : [];

    const receivingMsg = localStorage.getItem(receivingMessageKey);
    const receivingMsgArr = receivingMsg ? JSON.parse(receivingMsg) : [];

    const msgArray = [...newMsgArr, ...receivingMsgArr];
    msgArray.sort((a, b) => a.createdAt - b.createdAt);

    const lastPreviewMessage = msgArray.at(-1);
    if (lastPreviewMessage) {
      const timestamp = lastPreviewMessage.createdAt;
      const date = new Date(timestamp);
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");

      messageHistory.innerHTML += `<div class="contacts-messages-container preview-message" data-preview-user="${contactNames}"><div class="message-container"><p>${hours}:${minutes}:${seconds}</p><span id="name-message-container"><p>${contactNames}:</p><p>${lastPreviewMessage.message}</p></span></div><button class="msg delete-btn" data-user="${contactNames}">Delete</button></div>`;
    }
  }
});


messageHistory.addEventListener('click', (event)=>{
  const row = event.target.closest(".preview-message");
  if (!row){
    return;
  }

  localStorage.setItem("chatWith", row.dataset.previewUser);
  window.location.href="/Chat_page/chatbox.html";
    
});


contactWrapperCurrent.addEventListener('click', (e) => {
  if (e.target.classList.contains("delete-btn")) {
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




