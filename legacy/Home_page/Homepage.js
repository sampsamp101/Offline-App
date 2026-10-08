const appState = {
    currentModal: null,
    currentMain: "preview",
    chatWith: null
};

const mainApp = document.getElementById("main-app");
if (!mainApp) {
    throw new Error("Fatal: #main-app not found in the DOM. Check Homepage.html.");
}

function openModal(modal) {
    document.querySelectorAll(".modal-overlay").forEach((m) => m.classList.remove("show"));
    void modal.offsetWidth; 
    modal.classList.add("show");
}


const userName = (u) => u.name ?? u.user ?? "";

const getCurrentUser = () => localStorage.getItem("currentUser") || "Guest";

function readJSON(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return v ?? fallback;
  } 
  catch {return fallback;}
}


function renderProfile() {
    const mainGlobalModal = document.getElementById("global-modal-root");
    mainGlobalModal.innerHTML = ` 
        <div id="profile-container" class="modal-overlay">
             <div id="modal-box-profile">
                <button class="modal-close-btn">&times;</button>
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

    openModal(document.getElementById("profile-container"));
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
    openModal(document.getElementById("settings-container")); 
}

function renderContact(name) {
   const contactWrapperCurrent = document.getElementById("contacts-wrapper");
  contactWrapperCurrent.innerHTML +=
    `<div class="contacts-message-wrapper message-btn delete-btn" data-msg-user="${name}"><img id="image-contacts"src="/Images/profile-icon-design-free-vector.jpg"/><p class="contacts-name">${name}</p></div>`;
}

function renderContacts(){
    const currentUser = getCurrentUser();
    const userList = readJSON("usersInfo", []);

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
      let count = 0;
      contactWrapperCurrent.innerHTML +=
      `<div class="contacts-message-wrapper message-btn delete-btn" data-msg-user="${name}" dataset-user-id="${count}"><img id="image-contacts"src="/Images/profile-icon-design-free-vector.jpg"/><p class="contacts-name">${name}</p></div>`;
      count++;
    }

    const paraWarning = document.getElementById("warning-msg");
    const userAdd = document.getElementById("search-function");

    addContacts.addEventListener('click', () => {
        const typed = userAdd.value.trim().toLowerCase();
        if (typed === "") {
            paraWarning.textContent = "Type in user to add to your contact list!";
            return;
        }
        if (typed === currentUser.toLowerCase()) {
            paraWarning.textContent = "You can't add yourself to the contact list";
            return;
        }

        const currentUserContactsNetwork = contactsByUser[currentUser] || [];
        if (currentUserContactsNetwork.some(user => typed === user.toLowerCase())) {
            paraWarning.textContent = `${userAdd.value} is already in your contact list!`;
            return;
        }

        const userExists = userList.find((user)=> userName(user).toLowerCase() === typed);
        if (!userExists){
            paraWarning.textContent = `The user is not registered!`;
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
    });
    openModal(document.getElementById("contacts-container"));
}

function renderLogout(){
    const mainGlobalModal = document.getElementById("global-modal-root");
    mainGlobalModal.innerHTML = `<div id="logout-container" class="modal-overlay show">
            <div id="modal-box-logout">
                <p id="logout-text">Logout?</p>
                <span id="logout-yes-no-container">
                    <button id="logout-confirm">yes</button>
                    <button id="logout-no" class="modal-close-btn">no</button>
                </span>
            </div>
        </div>`;
    openModal(document.getElementById("logout-container"));
}


function renderModal() {
  const root = document.getElementById("global-modal-root");
  switch (appState.currentModal) {
    case null:       root.innerHTML = ""; break;
    case "profile":  renderProfile(); break;
    case "settings": renderSettings(); break;
    case "contacts": renderContacts(); break;
    case "logout":   renderLogout(); break;
  }
}

function navigateModal(modal){
  appState.currentModal = modal;
  renderModal();
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

function globalModal(){
    document.getElementById("profile").addEventListener("click", () => navigateModal("profile"));
    document.getElementById("settings").addEventListener("click", () => navigateModal("settings"));
    document.getElementById("contacts").addEventListener("click", () => navigateModal("contacts"));
    document.getElementById("logout").addEventListener("click", () => navigateModal("logout"));

    const mainGlobalModal = document.getElementById("global-modal-root");
    mainGlobalModal.addEventListener('click', (e)=>{
        if (e.target.closest(".modal-close-btn")){
           navigateModal(null);
           return;
        }
        if (e.target.closest("#logout-confirm")){
            localStorage.removeItem("currentUser");
            window.location.href = "http://localhost:3000/index.html";
        }
        const contactRow = e.target.closest(".message-btn[data-msg-user]");
        if (contactRow){
            appState.chatWith = contactRow.dataset.msgUser;
            navigateModal(null);   // close the modal
            navigateMain("chat");  // open the chat
        }
    })
}
globalModal();


function renderChat() {
    const mainApp = document.getElementById("main-app");
    mainApp.innerHTML = `
         <div class="chat-popup-modal">
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
            </div>`;
    document.getElementById("chat-with").textContent = appState.chatWith;
    renderMessages();
    setupChatEvents();
}

function formatDate(timestamp) {
    const d = new Date(timestamp);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    return `${day}/${month}/${d.getFullYear()}`;
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
    let lastDay = "";
    wrapper.innerHTML = all.map(m => {
        let html = "";
        const day = formatDate(m.createdAt);
         
        if (day !== lastDay) {
            html += `<p class="newDate">${day}</p>`;
            lastDay = day;
        }
        const d = new Date(m.createdAt);
        const time = `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}:${String(d.getSeconds()).padStart(2,"0")}`;
        const side = m.mine ? "sending" : "receiving";
        html += `<p class="chat-bubble ${side}">${m.message}</p><p class="chat-time ${side}">${time}</p>`;
        return html;
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

mainApp.addEventListener("click", (e) => {
    const deleteBtn = e.target.closest(".delete-btn[data-user]");
    if (deleteBtn) {
        const currentUser = localStorage.getItem("currentUser") || "Guest";
        localStorage.removeItem(`Msg:${currentUser}:${deleteBtn.dataset.user}`);
        renderPreview();
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

function setupSwipeActions(){
    const rows = document.querySelectorAll(".swipe-row");
    rows.forEach(row=>{
        const message = row.querySelector(".contacts-messages-container");
        let startX = 0;
        let currentY = 0;
        let drag = false;
        message.addEventListener('pointerdown', (e)=>{
            drag = true;
            startX = e.startX;
            startY = e.startY;
            message.style.transition = "none";
            message.setPointerCapture(e.pointerId);
        });
        message.addEventListener('pointermove', (e)=>{
            if (!dragging) return;
            currentX = e.clientX;
            const distance = currentX - startX;
            const limitedDistance = Math.max(-100, Math.min(100, distance));
            message.style.transform = translateX(`${limitedDistance}`);
        });
        message.addEventListener("pointerup", (e)=>{
            if (!dragging)return;
            const distance = currentX -startX;
            message.style.transition = "transform 0.2s ease";
            if (distance < -60){
                archiveMessage(row);
            }
            else if (distance > 60){
                deleteMessage(row)
            }
            else{
                message.style.transform = "translateX(0)";
            }
        });
        message.addEventListener("pointercancel", ()=>{
            dragging = false;
            message.style.transition = "transform 0.2 ease";
            message.style.transform = "translateX(0)";
        });
    })
}

function setupSwipeDivider() {
    const container = document.getElementById("swipe-container");
    const chatPanel = document.getElementById("chat-panel");
    const divider = document.getElementById("swipe-divider");

    if (!container || !chatPanel || !divider) return;

    let dragging = false;

    function setChatWidth(percent) {
        percent = Math.max(20, Math.min(100, percent));
        chatPanel.style.flexBasis = percent + "%";
    }

    function positionFromClientX(clientX) {
        const rect = container.getBoundingClientRect();
        return ((clientX - rect.left) / rect.width) * 100;
    }

    divider.addEventListener("mousedown", () => {
        dragging = true;
    });
    
    window.addEventListener("mouseup", () => {
        dragging = false;
    });

    window.addEventListener("mousemove", (e) => {
        if (!dragging) return;
        const percent = positionFromClientX(e.clientX);
        setChatWidth(percent);
    });

    divider.addEventListener("touchstart", () => {
        dragging = true;
    });

    window.addEventListener("touchend", () => {
        dragging = false;
    });

    window.addEventListener("touchmove", (e) => {
        if (!dragging) return;

        const percent = positionFromClientX(e.touches[0].clientX);
        setChatWidth(percent);
    });
}
function renderPreview() {
    const mainApp = document.getElementById("main-app");
    mainApp.innerHTML = `
    <div class="outer-container">
        <div class="inner-container">
            <div class="swipe-container" id="swipe-container">
                <div class="swipe-panel chat-panel" id="chat-panel">
                    <div id="preview-message-wrapper"></div>
                </div>
                <div class="swipe-divider" id="swipe-divider"></div>
                <div class="swipe-panel widgets-panel">
                    <div id="side-widget-panel"></div>
                </div>
            </div>
        </div>
    </div>`;

    setupSwipeDivider();

    const messageHistory = document.getElementById("preview-message-wrapper");
    if (!messageHistory) return;

    messageHistory.innerHTML = "";

    const currentUser = localStorage.getItem("currentUser") || "Guest";
    let contactsByUser = JSON.parse(localStorage.getItem("contactsByUser") || "{}");
    if (Array.isArray(contactsByUser) || typeof contactsByUser !== "object" || contactsByUser === null) {
        contactsByUser = {};
    }
    const userContactListArr = contactsByUser[currentUser] || [];

    for (const contactName of userContactListArr) {
        const storageKey = `Msg:${currentUser}:${contactName}`;
        const receivingMessageKey = `Msg:${contactName}:${currentUser}`;
        const storedMsg = JSON.parse(localStorage.getItem(storageKey) || "[]");
        const receivingMsg = JSON.parse(localStorage.getItem(receivingMessageKey) || "[]");
        const msgArray = [...storedMsg, ...receivingMsg];
        msgArray.sort((a, b) => a.createdAt - b.createdAt);
        const lastMessage = msgArray.at(-1);
        if (!lastMessage) continue;

        const date = new Date(lastMessage.createdAt);
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
                // <div class="swipe-action delete-action">
                //     Delete
                // </div>
                // <div class="swipe action archive-action">
                //     Archive
                // </div>
        messageHistory.innerHTML += `
            <div class="swipe-row">
                <div class="contacts-messages-container preview-message" data-preview-user="${contactName}">
                    <div class="message-container">
                        <p>${hours}:${minutes}:${seconds}</p>
                        <span id="name-message-container">
                            <p>${contactName}:</p>
                            <p>${lastMessage.message}</p>
                        </span>
                    </div>
                    <button class="msg delete-btn" data-user="${contactName}">Delete</button>
                </div>
            </div>
            <hr class="preview-divider"/>
        `;
    }
}

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
renderMain();
