const leftSendBtn = document.getElementById("left-send");
const rightSendBtn = document.getElementById("right-send");
const leftMsg = document.getElementById("left-message");
const rightMsg = document.getElementById("right-message");
const messageWrapper = document.getElementById("message-wrapper");
const clearButton = document.getElementById("clear");

function scrollToBottom(){  
    messageWrapper.scrollTop = messageWrapper.scrollHeight;
}

function captureMessage(side, text){
    const storedMsg = localStorage.getItem('Msg');
    let newMsgArr = (storedMsg) ? JSON.parse(storedMsg) : [];
    const nextOrder = newMsgArr.length > 0 ? newMsgArr[newMsgArr.length  - 1].order + 1 : 1;
    newMsgArr.push({
        order: nextOrder,
        side: side,
        message: text,
        createdAt: Date.now(),
    });
    localStorage.setItem('Msg',JSON.stringify(newMsgArr))
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

leftSendBtn.addEventListener("click", () => {
    const text = leftMsg.value.trim();
    if (text === "") {
        return;
    }
    createElement("left", text);
    captureMessage("left", text);
    leftMsg.value = "";
});

rightSendBtn.addEventListener("click", () => {
    const text = rightMsg.value.trim();
    if (text === "") {
        return;
    }
    createElement("right", text);
    captureMessage("right", text);
    rightMsg.value = "";
});


clearButton.addEventListener('click',()=>{
    localStorage.clear();
    clearAllMessages();
});

document.addEventListener("DOMContentLoaded", () => {
    const storedMsg = localStorage.getItem("Msg");
    const newMsgArr = storedMsg ? JSON.parse(storedMsg) : [];
    for (const msgArr of newMsgArr) {
        createElement(msgArr.side, msgArr.message);
    }
    scrollToBottom();
});

