const sendBtn = document.getElementById("send-msg-btn");
const sendMsg = document.getElementById("message-send");

const messageWrapper = document.getElementById("message-wrapper");
const clearButton = document.getElementById("clear");

const currentUser = localStorage.getItem("currentUser") || "Guest";
const chatWith = localStorage.getItem("chatWith") || "";
const storageKey = `Msg:${currentUser}:${chatWith}`;
const receivingMessageKey = `Msg:${chatWith}:${currentUser}`;

function captureMessage(side, text, createdAt = Date.now()){
    const storedMsg = localStorage.getItem(storageKey);
    const newMsgArr = storedMsg ? JSON.parse(storedMsg) : [];
    const nextOrder = newMsgArr.length > 0 ? newMsgArr[newMsgArr.length - 1].order + 1 : 1;
    newMsgArr.push({order: nextOrder, side, message:text, createdAt});
    localStorage.setItem(storageKey, JSON.stringify(newMsgArr));
}

function scrollToBottom(){  
    messageWrapper.scrollTop = messageWrapper.scrollHeight;
}

function clearAllMessages(){
    messageWrapper.innerHTML = "";
}

function createElement(side, text, createdAt = Date.now()){
    const newMsg = document.createElement("p");
    newMsg.style.border = "2px solid black";
    newMsg.style.padding = "20px";
    newMsg.style.width = "fit-content";
    newMsg.textContent = text;
    newMsg.style.fontSize = "20px";
    newMsg.style.borderRadius = "50px";
    const newDate = document.createElement("p")
    newMsg.style.border = "1px solid black";
    newMsg.style.padding = "20px";
    newMsg.style.width = "fit-content";
    newMsg.style.fontSize = "20px";
    newMsg.style.borderRadius = "50px";
    const timestamp = createdAt;
    const date = new Date(timestamp);
    const hours = String(date.getHours()).padStart(2, "0");        
    const minutes = String(date.getMinutes()).padStart(2,"0");  
    const seconds = String(date.getSeconds()).padStart(2,"0");  

    newDate.textContent = `${hours}:${minutes}:${seconds}`;
    if (side === "incoming"){
        newMsg.style.alignSelf = "flex-start";
        newDate.style.alignSelf = "flex-start";
    }
    else if (side === "user"){
        newMsg.style.alignSelf="flex-end";
        newDate.style.alignSelf = "flex-end";
    }
    messageWrapper.appendChild(newMsg);
    messageWrapper.appendChild(newDate);
    scrollToBottom();
}

sendBtn.addEventListener("click", () => {
    const text = sendMsg.value.trim();
    if (text === "") {
        return;
    }
    const now = Date.now();
    createElement("user", text, now);
    captureMessage("user", text, now);
    sendMsg.value = "";
});

clearButton.addEventListener('click',()=>{
    localStorage.removeItem(storageKey);
    clearAllMessages();
});

document.addEventListener("DOMContentLoaded", () => {
    const storedMsg = localStorage.getItem(storageKey);
    const newMsgArr = storedMsg ? JSON.parse(storedMsg) : [];
    
    const receivingMsg = localStorage.getItem(receivingMessageKey);
    const receivingMsgArr = receivingMsg ? JSON.parse(receivingMsg) : [];

    const userNameProfile = document.getElementById("username");
    if (userNameProfile) userNameProfile.textContent = currentUser;

    const chatWithEl = document.getElementById("chat-with");
    if(chatWithEl && chatWith) chatWithEl.textContent = chatWith;

    for (const receivingMsg of receivingMsgArr){
        createElement("incoming", receivingMsg.message, receivingMsg.createdAt);
    }

    for (const msgArr of newMsgArr) {
        createElement(msgArr.side, msgArr.message, msgArr.createdAt);
    }
    scrollToBottom();
});
