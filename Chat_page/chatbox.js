const sendBtn = document.getElementById("send-msg-btn");
const sendMsg = document.getElementById("message-send");

const messageWrapper = document.getElementById("message-wrapper");
const clearButton = document.getElementById("clear");

const currentUser = localStorage.getItem("currentUser") || "Guest";
const chatWith = localStorage.getItem("chatWith") || "";
const storageKey = `Msg:${currentUser}:${chatWith}`;

function captureMessage(side, text){
    const storedMsg = localStorage.getItem(storageKey);
    const newMsgArr = storedMsg ? JSON.parse(storedMsg) : [];
    const nextOrder = newMsgArr.length > 0 ? newMsgArr[newMsgArr.length - 1].order + 1 : 1;
    newMsgArr.push({order: nextOrder, side, message:text, createdAt: Date.now()});
    localStorage.setItem(storageKey, JSON.stringify(newMsgArr));
}

function scrollToBottom(){  
    messageWrapper.scrollTop = messageWrapper.scrollHeight;
}

function clearAllMessages(){
    messageWrapper.innerHTML = "";
}

function createElement(side, text){
    const newMsg = document.createElement("p");
    newMsg.style.border = "2px solid black";
    newMsg.style.padding = "20px";
    newMsg.style.width = "fit-content";
    newMsg.textContent = text;
    newMsg.style.fontSize = "20px";
    newMsg.style.borderRadius = "50px";
    if (side === "left"){
        newMsg.style.alignSelf = "flex-start";
    }
    else if (side === "right"){
        newMsg.style.alignSelf="flex-end";
    }
    messageWrapper.appendChild(newMsg);
    scrollToBottom();
}

sendBtn.addEventListener("click", () => {
    const text = sendMsg.value.trim();
    if (text === "") {
        return;
    }
    createElement("right", text);
    captureMessage("right", text);
    sendMsg.value = "";
});

clearButton.addEventListener('click',()=>{
    localStorage.removeItem(storageKey);
    clearAllMessages();
});

document.addEventListener("DOMContentLoaded", () => {
    const storedMsg = localStorage.getItem(storageKey);
    const newMsgArr = storedMsg ? JSON.parse(storedMsg) : [];
    
    const userNameProfile = document.getElementById("username");
    if (userNameProfile) userNameProfile.textContent = currentUser;
    
    const chatWithEl = document.getElementById("chat-with");
    if(chatWithEl && chatWith) chatWithEl.textContent = chatWith;

    for (const msgArr of newMsgArr) {
        createElement(msgArr.side, msgArr.message);
    }
    scrollToBottom();
});
