const authMainApp = document.getElementById("auth-app");
const recoverUser = document.getElementById("recover-user");

const recoverPassword = document.getElementById("recover-password");

const forgotUserModal = document.getElementById("forgot-user-modal");
const forgotPasswordModal = document.getElementById("forgot-password-modal");

function renderForgotUserModal(){
    if (!forgotUserModal){
        return;
    }
    forgotUserModal.classList.remove("show");
    forgotUserModal.classList.add("show");
}

function renderForgotPassModal(){
    if (!forgotPasswordModal){
        return;
    }
    forgotPasswordModal.classList.remove("show");
    forgotPasswordModal.classList.add("show");
}

recoverUser.addEventListener("click", ()=>{
    renderForgotUserModal();
});

recoverPassword.addEventListener("click", ()=>{ 
    renderForgotPassModal();
});

const closeBtn = document.querySelectorAll(".modal-close");
closeBtn.forEach((btn)=>{
    btn.addEventListener('click', (event)=>{
    if (!event.target.classList.contains("modal-close")){
        return;
    }
    const modal = event.target.closest(".modal-overlay");
    modal.classList.remove("show");
    });
})

function currentPage(){
    const selectedPage = window.location.search;
    const selectedHTML = new URLSearchParams(selectedPage);
    const view = selectedHTML.get("query");
    return (view === "login") ? "login" : "create";
}

const appState = {
    currentView: currentPage(),
}

function renderLogin(){
    authMainApp.innerHTML = "";
    authMainApp.innerHTML = `<div class="login-create-container">
        <div id="login-Account">
            <h2>Welcome back</h2>
            <p id="info">Login to continue</p>
        </div>        
        <label for="username">
            Username 
            <input id="username" type="email" placeholder="Enter username..."/></i>
        </label>
        <label for="password">
            Password Abcdef1!
            <span id="password-eye-container">
                <input id="password" type="password" placeholder="Enter password..."/><i class="fa-solid fa-eye" id="reveal-pw"></i>
            </span>
        </label>
        <button id="login">Log in</button>        
        <button id="recover-user">Recover User</button>
        <button id="recover-password">Recover Password</button>
        <span id="no-account-container">
            <p>Don't have an account?</p>
            <a href="/Create_account/Create_account.html">Create one</a>
        </span>
    </div>

    <div id="forgot-user-modal" class="modal-overlay">
            <div class="modal-box">
                <button id="closeBtn" class="modal-close">×</button>
                <label id="recovery-email-wrapper">
                    Input Email Address: 
                        <input id="email-address-recovery"/>
                        <button id="recovery-email-user-btn">Recover User</button>
                        <p id="recovery-user-msg"></p>
                </label>
            </div>
    </div>
    <div id="forgot-password-modal" class="modal-overlay">
         <div class="modal-box">
                <button id="closeBtn" class="modal-close">×</button>
                <label id="recovery-email-wrapper-email">
                    Input Email Address: 
                        <input id="email-address-recovery-email"/>
                </label>
                <label id="recovery-user-wrapper-password">
                    Input User:
                        <input id="email-address-recovery-user"/>
                </label>
                <button id="recovery-password-btn">Recover Password</button>                                
                <p id="recovery-password-msg"></p>
            </div>
    </div>`;
}
function handleCredentialResponse(response) {
    axios.post("/api/auth/google", {
        credential: response.credential
    })
    .then(({ data }) => {
        localStorage.setItem("currentUser", data.username);
        window.location.href = "/Home_page/Homepage.html";
    })
    .catch((err) => {
        console.error("Google auth failed:", err);
        const messageInfo = document.getElementById("info");
        if (messageInfo) {
            messageInfo.textContent = "Failed to sign in via Google. Please try again.";
        }
    });
}


function renderCreate(){
    
}

function navigateAuthMain(){
    
}

function renderAuthMain(){
    authMainApp.innerHTML = "";

}

