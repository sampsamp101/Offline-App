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
    
    const currentDate = new Date(createdAt);
    
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    
    const currentDay = `${day}/${month}/${year}`;

    newMsgArr.push({order: nextOrder, side, message:text, createdAt, currentDay});
    localStorage.setItem(storageKey, JSON.stringify(newMsgArr));
}

function scrollToBottom(){  
    messageWrapper.scrollTop = messageWrapper.scrollHeight;
}

function clearAllMessages(){
    messageWrapper.innerHTML = "";
}

function createElement(side, text, createdAt = Date.now(), messageSideOrder){
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

    if (messageSideOrder === "receiving"){
        newMsg.style.alignSelf = "flex-start";
        newDate.style.alignSelf = "flex-start";
    }

    else if (messageSideOrder === "sending"){
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
    createElement("user", text, now, "sending");
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
    
    for (let arrObj of newMsgArr){
        arrObj.messageSideOrder = "sending";
    }

    const receivingMsg = localStorage.getItem(receivingMessageKey);
    const receivingMsgArr = receivingMsg ? JSON.parse(receivingMsg) : [];

    for (let arrObj of receivingMsgArr){
        arrObj.messageSideOrder = "receiving";
    }

    const userNameProfile = document.getElementById("username");
    if (userNameProfile) userNameProfile.textContent = currentUser;
    
    const msgArray = [...newMsgArr,...receivingMsgArr];

    const chatWithEl = document.getElementById("chat-with");
    if(chatWithEl && chatWith) chatWithEl.textContent = chatWith;

    msgArray.sort((a,b) => a.createdAt - b.createdAt);

    const currentDateArr = [...new Set(msgArray.map(msg => msg.currentDay))];

    for (const currentDate of currentDateArr){
        const newDate = document.createElement("p");
        newDate.classList.add("newDate");
        newDate.textContent = currentDate;
        newDate.style.fontSize = "20px";
        newDate.style.borderRadius = "50px";
        messageWrapper.append(newDate);  

        const msgFilterTodayDateArr = msgArray.filter((msg) => msg.currentDay === currentDate);

        for (const msg of msgFilterTodayDateArr){
            if (msg.messageSideOrder === "sending"){
                createElement("user", msg.message, msg.createdAt, msg.messageSideOrder);
            }
            else if (msg.messageSideOrder === "receiving"){
                createElement("incoming", msg.message, msg.createdAt, msg.messageSideOrder);
            }
        }
    }
    scrollToBottom();
});
