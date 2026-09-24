const appState = {
    currentModal: null,
    currentMain: "preview",
    chatWith: null
};

const mainApp = document.getElementById("main-app");
if (!mainApp) {
    console.error("Fatal: #main-app not found in the DOM. Check Homepage.html.");
}

function openModal(modal) {
    const profileContainer = document.getElementById("profile-container");
    const settingsContainer = document.getElementById("settings-container");
    const contactsContainer = document.getElementById("contacts-container");
    const logoutContainer = document.getElementById("logout-container");
    if (profileContainer){
        profileContainer.classList.remove("show");
    }
    if (settingsContainer){
        settingsContainer.classList.remove("show");
    }
    if (contactsContainer){
        contactsContainer.classList.remove("show");
    }
    if (logoutContainer){
        logoutContainer.classList.remove("show");
    }
    void modal.offsetWidth; //ensure the browser compute the starting styles. if not, it will merge both class changes into one frame and skips transition    
    modal.classList.add("show");
}

function renderProfile() {
    const mainGlobalModal = document.getElementById("global-modal-root");
    mainGlobalModal.innerHTML = ` 
        <div id="profile-container" class="modal-overlay">
             <div id="modal-box-profile">
                <button class="modal-close-btn">&times</button>
                <div id="modal-profile-picture-container">
                    <img id="image-profile" src="/Images/profile-icon-design-free-vector.jpg"/>
                </div>
                <div class="profile-wrapper">
                    <h3 id="profile-name"></h3>
                    <h3 id="profile-email"></h3>
                    <h3 id="profile-number"></h3>
                </div>
             </div>
        </div>`;

    const currentUser = localStorage.getItem("currentUser") || "Guest";
    const profileName = document.getElementById("profile-name");
    profileName.textContent = currentUser;

    const storedUsers = JSON.parse(localStorage.getItem('usersInfo') || '[]');
    const profileEmail = document.getElementById("profile-email");

    let currentEmail = "";
    for (const users of storedUsers){
        if (users.name === currentUser){
          currentEmail = users.emailAddress_username;
        }
    }
    if (!currentEmail) {
    profileEmail.textContent = "Email not registered";
    } else {
        profileEmail.textContent = currentEmail;
    }

    const profileContainer = document.getElementById("profile-container");
    openModal(profileContainer);
}

function renderSettings(){
    const mainGlobalModal = document.getElementById("global-modal-root");
    mainGlobalModal.innerHTML = `<div id="settings-container" class="modal-overlay show">
          <button class="modal-close-btn">&times</button>
          <div id="modal-box-settings">
              <label for="brightness">
                  Brightness
                  <input type="range" id="brightness" min="0" max="100" value="30"/>
              </label>
              <label for="adaptive-theme">
                  Theme
                  <input type="range" id="adaptive-theme" min="0" max="100" value="30"/>
                  <label for="message-auto-delete">
              </label>
                  Set Message Auto Delete
                  <input type="range" id="message-auto-delete" min="0" max="100" value="30"/>
              </label>
              <label for="message-auto-hidden">
                  Set message auto hidden
                  <input type="range" id="message-auto-hidden" min="0" max="100" value="30"/>
              </label>
            </div>
      </div>`;
    const settingsContainer = document.getElementById("settings-container");
    openModal(settingsContainer); 
}

function renderContact(name) {
   const contactWrapperCurrent = document.getElementById("contacts-wrapper");
  contactWrapperCurrent.innerHTML +=
    `<div class="contacts-message-wrapper message-btn delete-btn" data-msg-user="${name}"><img id="image-contacts"src="/Images/profile-icon-design-free-vector.jpg"/><p class="contacts-name">${name}</p></div>`;
}

function renderContacts(){
    const currentUser = localStorage.getItem("currentUser") || "Guest";

    const userList =
        JSON.parse(localStorage.getItem("usersInfo") || "[]");

    let contactsByUser = JSON.parse(localStorage.getItem("contactsByUser") || "{}");
    if (Array.isArray(contactsByUser) || typeof contactsByUser !== "object" || contactsByUser === null) {
      contactsByUser = {};
    }
    const userContactListArr = contactsByUser[currentUser] || [];

    const mainGlobalModal = document.getElementById("global-modal-root");
    mainGlobalModal.innerHTML = `<div id="contacts-container" class="modal-overlay show">
            <div id="modal-box-contacts">
                <button class="modal-close-btn">&times</button>
                <div id="add-remove-contacts-wrapper">
                    <div id="contacts-wrapper">
                    </div>
                     <div id="current-contacts-wrapper">
                        <button class="button" id="add">Add Contacts</button>
                        <div id="input-outcome-wrapper">
                            <input id="search-function" type="text"/>
                            <p id="warning-msg"></p>
                        </div>
                    </div>   
                </div>
                    <i class="fa-solid fa-angles-down"></i>
                    <p id="swipe-add-contacts">Swipe down to add contacts</p>
            </div>
        </div>`;
    const addContacts = document.getElementById("add");
    const contactWrapperCurrent = document.getElementById("contacts-wrapper");
    for (const name of userContactListArr){
      contactWrapperCurrent.innerHTML +=
      `<div class="contacts-message-wrapper message-btn delete-btn" data-msg-user="${name}"><img id="image-contacts"src="/Images/profile-icon-design-free-vector.jpg"/><p class="contacts-name">${name}</p></div>`;
    }

    const paraWarning = document.getElementById("warning-msg");
    const userAdd = document.getElementById("search-function");

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

    const contactsContainer = document.getElementById("contacts-container");
    openModal(contactsContainer);

}

function renderLogout(){
    const mainGlobalModal = document.getElementById("global-modal-root");
    mainGlobalModal.innerHTML = `<div id="logout-container" class="modal-overlay show">
            <div id="modal-box-logout">
                <label for="logout-confirm">
                    Logout? 
                    <span id="logout-yes-no-container">
                        <button id="logout-confirm">yes</button>
                        <button id="logout-no" class="modal-close-btn">no</button>
                    </span>
                </label>
            </div>
        </div>`;
    const logoutContainer = document.getElementById("logout-container");
    openModal(logoutContainer); 
}

function renderModal(){
    const root = document.getElementById("global-modal-root");
    if (appState.currentModal === null) {
        root.innerHTML = "";
        return;
    }
    if (appState.currentModal === "profile") {
        renderProfile();
    }
    else if (appState.currentModal === "settings") {
        renderSettings();
    }
    else if (appState.currentModal === "contacts") {
        renderContacts();
    }
    else if (appState.currentModal === "logout") {
        renderLogout();
    }
}

function navigateModal(modal){
  appState.currentModal = modal;
  renderModal();
}

function globalModal(){
     const profileButton = document.getElementById("profile");
    const settingsButton = document.getElementById("settings");
    const contactsButton = document.getElementById("contacts");
    const logoutButton = document.getElementById("logout");

    profileButton.addEventListener("click", () => {
      navigateModal("profile");
    });

    settingsButton.addEventListener("click", () => {
       navigateModal("settings");
    });

    contactsButton.addEventListener("click", () => {
        navigateModal("contacts");
    });

    logoutButton.addEventListener("click", () => {
        navigateModal("logout");
    });

    const mainGlobalModal = document.getElementById("global-modal-root");

    mainGlobalModal.addEventListener('click', (e)=>{
        const closeButton = e.target.closest(".modal-close-btn");
        if (closeButton){
           navigateModal(null);
        }
        
        const logoutConfirm = e.target.closest("#logout-confirm");
        if (logoutConfirm){
            localStorage.removeItem("currentUser");
            window.location.href = "/login_account/login-account.html";
            return;
        }

        const contactRow = e.target.closest(".message-btn[data-msg-user]");
        if (contactRow){
            appState.chatWith = contactRow.dataset.msgUser;
            navigateModal(null);   // close the modal
            navigateMain("chat");  // open the chat
        }
    })
}

const navbarNavigate = document.getElementById("navbar");

function openNavbar(){
  navbarNavigate.classList.add("show");
}

function closeNavbar(){
  navbarNavigate.classList.remove("show");
}

navbarNavigate.addEventListener('click', (event)=>{
    if (event.target.closest("li")) {
      return;
    }
    if (navbarNavigate.classList.contains("show")){
      closeNavbar();
    }
    else if (!navbarNavigate.classList.contains("show")){
      openNavbar();
    }
});

function renderChat() {
    const mainApp = document.getElementById("main-app");
    mainApp.innerHTML = `
        <div class="outer-chat-popup-modal">
            <div class="inner-chat-popup-modal">
                <div class="top-header">
                    <button id="close-chat">
                        <i class="fa-solid fa-angles-left"></i>
                    </button>
                    <div class="name" id="chat-with"></div>
                </div>
                <div id="message-wrapper"></div>
                <div id="message-wrapper-container">
                    <div id="input-buttons-wrapper">
                        <input
                            type="text"
                            id="message-send"
                            placeholder="Key in your desired chat"
                        >
                        <button
                            class="button"
                            id="send-msg-btn"
                        >
                            Send
                        </button>
                        <button
                            class="button"
                            id="clear"
                        >
                            Clear Messages
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.getElementById("chat-with").textContent =
        appState.chatWith;
    renderMessages();
    setupChatEvents();
}

function renderPreview() {
    const mainApp = document.getElementById("main-app");

    mainApp.innerHTML = `
        <div class="outer-container">
            <div class="inner-container">
                <div id="preview-message-wrapper"></div>
            </div>
        </div>
    `;

    renderMessagePreviews();
}

function renderMessagePreviews() {
    const messageHistory =
        document.getElementById("preview-message-wrapper");

    if (!messageHistory) return;

    messageHistory.innerHTML = "";

    const currentUser =
        localStorage.getItem("currentUser") || "Guest";

    let contactsByUser =
        JSON.parse(localStorage.getItem("contactsByUser") || "{}");

    if (
        Array.isArray(contactsByUser) ||
        typeof contactsByUser !== "object" ||
        contactsByUser === null
    ) {
        contactsByUser = {};
    }

    const userContactListArr =
        contactsByUser[currentUser] || [];

    for (const contactName of userContactListArr) {

        const storageKey =
            `Msg:${currentUser}:${contactName}`;

        const receivingMessageKey =
            `Msg:${contactName}:${currentUser}`;

        const storedMsg =
            JSON.parse(localStorage.getItem(storageKey) || "[]");

        const receivingMsg =
            JSON.parse(
                localStorage.getItem(receivingMessageKey) || "[]"
            );

        const msgArray = [
            ...storedMsg,
            ...receivingMsg
        ];

        msgArray.sort(
            (a, b) => a.createdAt - b.createdAt
        );

        const lastMessage =
            msgArray.at(-1);

        if (!lastMessage) continue;

        const date =
            new Date(lastMessage.createdAt);

        const hours =
            String(date.getHours()).padStart(2, "0");

        const minutes =
            String(date.getMinutes()).padStart(2, "0");

        const seconds =
            String(date.getSeconds()).padStart(2, "0");

        messageHistory.innerHTML += `
            <div
                class="contacts-messages-container preview-message"
                data-preview-user="${contactName}"
            >
                <div class="message-container">
                    <p>${hours}:${minutes}:${seconds}</p>

                    <span id="name-message-container">
                        <p>${contactName}:</p>
                        <p>${lastMessage.message}</p>
                    </span>
                </div>

                <button
                    class="msg delete-btn"
                    data-user="${contactName}"
                >
                    Delete
                </button>
            </div>

            <hr/>
        `;
    }
}

function renderMessages() {
    const wrapper = document.getElementById("message-wrapper");
    if (!wrapper) return;

    const currentUser = localStorage.getItem("currentUser") || "Guest";
    const chatWith = appState.chatWith;

    const mine = JSON.parse(localStorage.getItem(`Msg:${currentUser}:${chatWith}`) || "[]")
        .map(m => ({ ...m, mine: true }));
    const theirs = JSON.parse(localStorage.getItem(`Msg:${chatWith}:${currentUser}`) || "[]")
        .map(m => ({ ...m, mine: false }));

    const all = [...mine, ...theirs].sort((a, b) => a.createdAt - b.createdAt);

    wrapper.innerHTML = all.map(m => {
        const d = new Date(m.createdAt);
        const time = `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}:${String(d.getSeconds()).padStart(2,"0")}`;
        const side = m.mine ? "sending" : "receiving";
        return `<p class="chat-bubble ${side}">${m.message}</p><p class="chat-time ${side}">${time}</p>`;
    }).join("");
    
    wrapper.scrollTop = wrapper.scrollHeight;
}


function sendMessage() {
    const currentUser = localStorage.getItem("currentUser") || "Guest";
    const chatWith = appState.chatWith;
    if (!chatWith) return;

    const input = document.getElementById("message-send");
    const text = input.value.trim();
    if (text === "") return;

    const key = `Msg:${currentUser}:${chatWith}`;
    const arr = JSON.parse(localStorage.getItem(key) || "[]");
    const nextOrder = arr.length ? arr[arr.length - 1].order + 1 : 1;
    arr.push({ order: nextOrder, message: text, createdAt: Date.now() });
    localStorage.setItem(key, JSON.stringify(arr));

    input.value = "";
    renderMessages();
}

function clearMessages() {
    const currentUser = localStorage.getItem("currentUser") || "Guest";
    const chatWith = appState.chatWith;
    if (!chatWith) return;
    localStorage.removeItem(`Msg:${currentUser}:${chatWith}`);
    renderMessages();
}

function navigateMain(screen) {
    appState.currentMain = screen;
    renderMain();
}

function renderMain() {
    const mainApp = document.getElementById("main-app");

    mainApp.innerHTML = "";

    switch (appState.currentMain) {
        case "preview":
            renderPreview();
            break;

        case "chat":
            renderChat();
            break;

        default:
            renderPreview();
    }
}

mainApp.addEventListener("click", (e) => {
    const deleteBtn = e.target.closest(".delete-btn[data-user]");
    if (deleteBtn) {
        const currentUser = localStorage.getItem("currentUser") || "Guest";
        localStorage.removeItem(`Msg:${currentUser}:${deleteBtn.dataset.user}`);
        renderMessagePreviews();
        return;
    }

    const previewRow = e.target.closest(".preview-message");
    if (previewRow) {
        appState.chatWith = previewRow.dataset.previewUser;
        navigateMain("chat");
    }
});

document.getElementById("clear-localStorage").addEventListener("click", () => {
    localStorage.removeItem("contactsByUser");
    for (const key of Object.keys(localStorage)) {
        if (key.startsWith("Msg:")) localStorage.removeItem(key);
    }
    renderMain();
});

function setupChatEvents() {

    document
        .getElementById("close-chat")
        .addEventListener("click", () => {
            navigateMain("preview");
        });

    document
        .getElementById("send-msg-btn")
        .addEventListener("click", sendMessage);

    document
        .getElementById("clear")
        .addEventListener("click", clearMessages);
}

globalModal();
renderMain();


// messageHistory.addEventListener('click', (event)=>{
//   const row = event.target.closest(".preview-message");
//   if (!row){
//     return;
//   }
//   localStorage.setItem("chatWith", row.dataset.previewUser);
//   openChat();
// });

// contactWrapperCurrent.addEventListener('click', (e) => {
//   if (e.target.classList.contains("message-btn")) {
//     const name = e.target.dataset.msgUser;
//     localStorage.setItem("chatWith", name);
//     openChat();
//   }
// });

// function closeModal(modal) {
//     modal.classList.remove("show");
// }

// const logout = document.getElementById("logout");
// const userName = document.getElementById("username");
// const addContacts = document.getElementById("add");
// const removeContacts = document.getElementById("remove");
// const userAdd = document.getElementById("search-function");
// const paraWarning = document.getElementById("warning-msg");
// const contactWrapperCurrent = document.getElementById("contacts-wrapper");
// 
// const clearLocalStorage = document.getElementById("clear-localStorage");
// const userList = JSON.parse(localStorage.getItem("usersInfo") || "[]");
// const currentUser = localStorage.getItem("currentUser") || "Guest";

// const chatMessageBox = document.querySelector(".outer-chat-popup-modal");
// const mainApp = document.getElementById("main-app");

// let contactsByUser = JSON.parse(localStorage.getItem("contactsByUser") || "{}");
// if (Array.isArray(contactsByUser) || typeof contactsByUser !== "object" || contactsByUser === null) {
//   contactsByUser = {};
// }
// const userContactListArr = contactsByUser[currentUser] || [];

// function renderContact(name) {
//   contactWrapperCurrent.innerHTML +=
//     `<div class="contacts-message-wrapper message-btn delete-btn" data-msg-user="${name}"><img id="image-contacts"src="/Images/profile-icon-design-free-vector.jpg"/><p id="contacts-name">${name}</p></div>`;
// }
// {/* <button class="msg delete-btn" data-user="${name}">Delete</button> */}

// addContacts.addEventListener('click', () => {
//   const typed = userAdd.value.trim().toLowerCase();
//   if (typed === "") {
//     paraWarning.textContent = "Type in user to add to your contact list!";
//     return;
//   }
//   else if (typed === currentUser.toLowerCase()) {
//     paraWarning.textContent = "You can't add yourself to the contact list";
//     return;
//   }
//   else {
//     const currentUserContactsNetwork = contactsByUser[currentUser] || [];
//     if (currentUserContactsNetwork.some(user => typed === user.toLowerCase())) {
//       paraWarning.textContent = `${userAdd.value} is already in your contact list!`;
//       return;
//     }
//     for (const userRegisteredObj of userList) {
//       if (userRegisteredObj.user.toLowerCase() === typed) {
//         currentUserContactsNetwork.push(userRegisteredObj.user);
//         contactsByUser[currentUser] = currentUserContactsNetwork;
//         localStorage.setItem('contactsByUser', JSON.stringify(contactsByUser));
//         paraWarning.textContent = `${userRegisteredObj.user} added to your contact list!`;
//         renderContact(userRegisteredObj.user);
//         return;
//       }
//     }
//     paraWarning.textContent = `The user is not registered!`;
//     return;
//   }
// });

// logout.addEventListener('click', (event) => {
//   event.preventDefault();
//   localStorage.removeItem("currentUser");
//   window.location.href = "/login_account/login-account.html";
// });

// clearLocalStorage.addEventListener('click', () => {
//   localStorage.removeItem("contactsByUser");
//   for (const key of Object.keys(localStorage)) {
//     if (key.startsWith("Msg:")) localStorage.removeItem(key);
//   }
//   contactsByUser = {};
//   paraWarning.innerHTML = "";
//   contactWrapperCurrent.innerHTML = "";
// });

// const profileName = document.getElementById("profile-name");
// document.addEventListener('DOMContentLoaded', () => {
//   if (logout) {
//     profileName.textContent = currentUser;
//   }
//   const storedUsers = JSON.parse(localStorage.getItem('usersInfo') || '[]');
//   const profileEmail = document.getElementById("profile-email");
//   let currentEmail = "";
//   for (const users of storedUsers){
//       if (users.name === currentUser){
//         currentEmail = users.emailAddress_username;
//       }
//   }
//   if (!currentEmail){
//     profileEmail.textContent = "Email not registered";
//   }
//   else{
//     profileName.textContent = currentEmail;
//   }
//   contactWrapperCurrent.innerHTML = "";
//   for (const existingContacts of userContactListArr) {
//     renderContact(existingContacts);
//   }
//   for (const contactNames of userContactListArr) {
//     const storageKey = `Msg:${currentUser}:${contactNames}`;
//     const receivingMessageKey = `Msg:${contactNames}:${currentUser}`;
//     const storedMsg = localStorage.getItem(storageKey);
//     const newMsgArr = storedMsg ? JSON.parse(storedMsg) : [];
//     const receivingMsg = localStorage.getItem(receivingMessageKey);
//     const receivingMsgArr = receivingMsg ? JSON.parse(receivingMsg) : [];
//     const msgArray = [...newMsgArr, ...receivingMsgArr];
//     msgArray.sort((a, b) => a.createdAt - b.createdAt);
//     const lastPreviewMessage = msgArray.at(-1);
//     if (lastPreviewMessage) {
//       const timestamp = lastPreviewMessage.createdAt;
//       const date = new Date(timestamp);
//       const hours = String(date.getHours()).padStart(2, "0");
//       const minutes = String(date.getMinutes()).padStart(2, "0");
//       const seconds = String(date.getSeconds()).padStart(2, "0");

//       messageHistory.innerHTML += `<div class="contacts-messages-container preview-message" data-preview-user="${contactNames}"><div class="message-container"><p>${hours}:${minutes}:${seconds}</p><span id="name-message-container"><p>${contactNames}:</p><p>${lastPreviewMessage.message}</p></span></div><button class="msg delete-btn" data-user="${contactNames}">Delete</button></div><hr/>`;
//     }
//   }
// });

// function openChat(){
//   if (!chatMessageBox){
//     return;
//   }
//   chatMessageBox.classList.add("show");
// }

// function closeChat(){
//   if (!chatMessageBox){
//     return;
//   }
//   chatMessageBox.classList.remove("show");
// }

// messageHistory.addEventListener('click', (event)=>{
//   const row = event.target.closest(".preview-message");
//   if (!row){
//     return;
//   }
//   localStorage.setItem("chatWith", row.dataset.previewUser);
//   openChat();
// });

// contactWrapperCurrent.addEventListener('click', (e) => {
//   if (e.target.classList.contains("message-btn")) {
//     const name = e.target.dataset.msgUser;
//     localStorage.setItem("chatWith", name);
//     openChat();
//   }
// });

// contactWrapperCurrent.addEventListener('touchstart', (event)=>{
//   touchstartX = event.changedTouches[0].screenX;
//   touchstartY = event.changedTouches[0].screenY;
//   handleGestures(event);
// });
// contactWrapperCurrent.addEventListener('touchend', (event)=>{
//   touchendX = event.changedTouches[0].screenX;
//   touchendY = event.changedTouches[0].screenY;
//   handleGestures(event);
// });

// function handleGestures(e){
//   if (touchendX > touchstartX){
//     if (e.target.classList.contains("delete-btn")) {
//       const name = e.target.dataset.msgUser;
//       contactsByUser[currentUser] = (contactsByUser[currentUser] || []).filter(contactName => contactName !== name);
//       localStorage.setItem('contactsByUser', JSON.stringify(contactsByUser));
//       e.target.closest(".contacts-message-wrapper").remove();
//       paraWarning.textContent = `${name} removed from your contact list!`;
//     }
//   }
// }


// const sendBtn = document.getElementById("send-msg-btn");
// const sendMsg = document.getElementById("message-send");

// const messageWrapper = document.getElementById("message-wrapper");
// const clearButton = document.getElementById("clear");
// const chatWith = localStorage.getItem("chatWith") || "";
// const storageKey = `Msg:${currentUser}:${chatWith}`;
// const receivingMessageKey = `Msg:${chatWith}:${currentUser}`;

// function captureMessage(side, text, createdAt = Date.now()){
//     const storedMsg = localStorage.getItem(storageKey);
//     const newMsgArr = storedMsg ? JSON.parse(storedMsg) : [];
//     const nextOrder = newMsgArr.length > 0 ? newMsgArr[newMsgArr.length - 1].order + 1 : 1;
//     const currentDate = new Date(createdAt);
//     const year = currentDate.getFullYear();
//     const month = String(currentDate.getMonth() + 1).padStart(2, "0");
//     const day = String(currentDate.getDate()).padStart(2, "0");
//     const currentDay = `${day}/${month}/${year}`;
//     newMsgArr.push({order: nextOrder, side, message:text, createdAt, currentDay});
//     localStorage.setItem(storageKey, JSON.stringify(newMsgArr));
// }

// function scrollToBottom(){  
//     messageWrapper.scrollTop = messageWrapper.scrollHeight;
// }

// function clearAllMessages(){
//     messageWrapper.innerHTML = "";
// }

// function createElement(side, text, createdAt = Date.now(), messageSideOrder){
//     const newMsg = document.createElement("p");
//     newMsg.style.border = "2px solid black";
//     newMsg.style.padding = "20px";
//     newMsg.style.width = "fit-content";
//     newMsg.textContent = text;
//     newMsg.style.fontSize = "20px";
//     newMsg.style.borderRadius = "50px";
//     const newDate = document.createElement("p")
//     newMsg.style.border = "1px solid black";
//     newMsg.style.padding = "20px";
//     newMsg.style.width = "fit-content";
//     newMsg.style.fontSize = "20px";
//     newMsg.style.borderRadius = "50px";
//     const timestamp = createdAt;
//     const date = new Date(timestamp);
//     const hours = String(date.getHours()).padStart(2, "0");        
//     const minutes = String(date.getMinutes()).padStart(2,"0");  
//     const seconds = String(date.getSeconds()).padStart(2,"0");  

//     newDate.textContent = `${hours}:${minutes}:${seconds}`;

//     if (messageSideOrder === "receiving"){
//         newMsg.style.alignSelf = "flex-start";
//         newDate.style.alignSelf = "flex-start";
//     }

//     else if (messageSideOrder === "sending"){
//         newMsg.style.alignSelf="flex-end";
//         newDate.style.alignSelf = "flex-end";
//     }

//     messageWrapper.appendChild(newMsg);
//     messageWrapper.appendChild(newDate);
//     scrollToBottom();
// }

// sendBtn.addEventListener("click", () => {
//     const text = sendMsg.value.trim();
//     if (text === "") {
//         return;
//     }
//     const now = Date.now();
//     createElement("user", text, now, "sending");
//     captureMessage("user", text, now);
//     sendMsg.value = "";
// });

// clearButton.addEventListener('click',()=>{
//     localStorage.removeItem(storageKey);
//     clearAllMessages();
// });

// document.addEventListener("DOMContentLoaded", () => {
//     const storedMsg = localStorage.getItem(storageKey);
//     const newMsgArr = storedMsg ? JSON.parse(storedMsg) : [];
    
//     for (let arrObj of newMsgArr){
//         arrObj.messageSideOrder = "sending";
//     }

//     const receivingMsg = localStorage.getItem(receivingMessageKey);
//     const receivingMsgArr = receivingMsg ? JSON.parse(receivingMsg) : [];

//     for (let arrObj of receivingMsgArr){
//         arrObj.messageSideOrder = "receiving";
//     }

//     const userNameProfile = document.getElementById("username");
//     if (userNameProfile) userNameProfile.textContent = currentUser;
    
//     const msgArray = [...newMsgArr,...receivingMsgArr];

//     const chatWithEl = document.getElementById("chat-with");
//     if(chatWithEl && chatWith) chatWithEl.textContent = chatWith;

//     msgArray.sort((a,b) => a.createdAt - b.createdAt);

//     const currentDateArr = [...new Set(msgArray.map(msg => msg.currentDay))];

//     for (const currentDate of currentDateArr){
//         const newDate = document.createElement("p");
//         newDate.classList.add("newDate");
//         newDate.textContent = currentDate;
//         newDate.style.fontSize = "20px";
//         newDate.style.borderRadius = "50px";
//         messageWrapper.append(newDate);  

//         const msgFilterTodayDateArr = msgArray.filter((msg) => msg.currentDay === currentDate);

//         for (const msg of msgFilterTodayDateArr){
//             if (msg.messageSideOrder === "sending"){
//                 createElement("user", msg.message, msg.createdAt, msg.messageSideOrder);
//             }
//             else if (msg.messageSideOrder === "receiving"){
//                 createElement("incoming", msg.message, msg.createdAt, msg.messageSideOrder);
//             }
//         }
//     }

//     mainApp.innerHTML = `<div class="outer-container">
//                         <div class="inner-container">
//                             <div id="preview-message-wrapper">
//                             </div>
//                         </div>
//                     </div>`;
  
//     scrollToBottom();
// });

// function renderHome() {
//     mainApp.innerHTML = `
//         <div class="outer-container">
//             <div class="inner-container">
//                 <div id="preview-message-wrapper">
//                 </div>
//             </div>
//         </div>
//     `;
//     renderMessagePreviews();
// }

// function renderMessagePreviews() {
//     const wrapper =
//         document.getElementById("preview-message-wrapper");
//     wrapper.innerHTML = "";
//     const contacts =
//         contactsByUser[currentUser] || [];
//     for (const contact of contacts) {
//         const messages =
//             getMessages(contact);
//         if (messages.length === 0) {
//             continue;
//         }
//         messages.sort(
//             (a, b) => a.createdAt - b.createdAt
//         );
//         const lastMessage =
//             messages[messages.length - 1];

//         const date =
//             new Date(lastMessage.createdAt);

//         const hours =
//             String(date.getHours()).padStart(2, "0");

//         const minutes =
//             String(date.getMinutes()).padStart(2, "0");

//         const seconds =
//             String(date.getSeconds()).padStart(2, "0");

//         wrapper.innerHTML += `
//             <div
//                 class="contacts-messages-container preview-message"
//                 data-user="${contact}"
//             >

//                 <div class="message-container">

//                     <p>
//                         ${hours}:${minutes}:${seconds}
//                     </p>

//                     <span>
//                         <p>${contact}:</p>
//                         <p>${lastMessage.message}</p>
//                     </span>

//                 </div>

//             </div>

//             <hr>
//         `;
//     }
// function getMessages(contact) {

//     const sendingKey =
//         `Msg:${currentUser}:${contact}`;

//     const receivingKey =
//         `Msg:${contact}:${currentUser}`;

//     const sending =
//         JSON.parse(
//             localStorage.getItem(sendingKey) || "[]"
//         );

//     const receiving =
//         JSON.parse(
//             localStorage.getItem(receivingKey) || "[]"
//         );

//     const messages = [
//         ...sending.map(message => ({
//             ...message,
//             direction: "sending"
//         })),

//         ...receiving.map(message => ({
//             ...message,
//             direction: "receiving"
//         }))
//     ];
//     messages.sort(
//         (a, b) => a.createdAt - b.createdAt
//     );
//     return messages;
// }




