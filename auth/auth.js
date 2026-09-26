const authMainApp = document.getElementById("auth-app");

const forgotUserModal = document.getElementById("forgot-user-modal");
const forgotPasswordModal = document.getElementById("forgot-password-modal");


let pending = null;   // { email, username, password, token }

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

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

async function requestCode(email) {
    const { data } = await axios.post("/api/send-code", {email});
    return data.token;
}

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
    authMainApp.innerHTML = `
    <header>
        <nav id="navbar">
            <h2 id="logo">
                <a href="/index.html" id="logo-text">OFFLINE</a>
            </h2>
            <ul>
                <li><a href="/auth/auth.html?query=create">Sign Up</a></li>
            </ul>
        </nav>
    </header>   

    <div class="login-create-container">
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
            <a href="/auth/auth.html?Query=create"">Create one</a>
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

    const recoverUser = document.getElementById("recover-user");
    const recoverPassword = document.getElementById("recover-password");

    recoverUser.addEventListener("click", ()=>{
        renderForgotUserModal();
    });

    recoverPassword.addEventListener("click", ()=>{ 
        renderForgotPassModal();
    });
    const userInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const submitBox = document.getElementById("login");
    const messageInfo = document.getElementById("info");
    const revealPwEye = document.getElementById("reveal-pw");

    revealPwEye.addEventListener("click", () => {
        passwordInput.type = "text";    
        revealPwEye.classList.remove("fa-eye");
        revealPwEye.classList.add("fa-eye-slash");
        setTimeout(() => {
            passwordInput.type="password";
            revealPwEye.classList.remove("fa-eye-slash");
            revealPwEye.classList.add("fa-eye");
        }, 5000);
    });

    submitBox.addEventListener('click', ()=>{
        if (userInput.value === "" || passwordInput.value === ""){      
            messageInfo.textContent = "Ensure user and password is filled in!";
            return;
        }
        else{
            const storedUsers = JSON.parse(localStorage.getItem('usersInfo') || '[]');
            const userExists = storedUsers.some(user =>
                user.user === userInput.value && user.password === passwordInput.value
            );
            if (!userExists) {
                messageInfo.textContent = "No matching account found. Please create an account first.";
                return;
            }
            localStorage.setItem('currentUser', userInput.value);
            messageInfo.textContent = "Success Login! Login in....";
            setTimeout(() => {
                window.location.href = "/Home_page/Homepage.html";
            }, 1500);
        }
    });

    function recoverUserFunction(){
        const modal = document.getElementById("modal");
        const recoverUser = document.getElementById("recover-user");
        const closeBtn = document.getElementById("closeBtn");
        const emailAddressRecovery = document.getElementById("email-address-recovery");
        const recoverUserConfirm = document.getElementById("recovery-email-user-btn");
        const recoveryUserMsg = document.getElementById("recovery-user-msg");
        recoverUser.addEventListener('click', ()=>{
            modal.classList.add("show");
        });
        closeBtn.addEventListener('click', ()=>{
            modal.classList.remove("show");
        });
        recoverUserConfirm.addEventListener('click', ()=>{
            const storedUsers = JSON.parse(localStorage.getItem('usersInfo') || '[]');
            const emailExists = storedUsers.some(user => (user.emailAddress_username === emailAddressRecovery.value));
            if (!emailAddressRecovery.value){
                recoveryUserMsg.textContent = `Recovery field is empty!`;
                return;
            }
            if (!emailExists){
                recoveryUserMsg.textContent = `Registered email is not registered yet!`;
                return;
            }
            for (const usersInfo of storedUsers){
                if (usersInfo.emailAddress_username === emailAddressRecovery.value){
                    recoveryUserMsg.textContent = `Registered User found! Recovered user: ${usersInfo.user}`;
                    return;
                }
            }
        });
    }
    recoverUserFunction();
}

function renderCreate(){
    authMainApp.innerHTML = `
    <header>
        <nav id="navbar">
            <h2 id="logo">
                OFFLINE
            </h2>
            <ul>
                <li><a href="/auth/auth.html?query=login">Login</a></li>
            </ul>
        </nav>
    </header>
    <div class="login-create-container">
        <div id="login-Account">
            <h2>Welcome</h2>
            <p id="info">Sign up to continue</p>
        </div>       
        <label for="email">
            Email 
            <input id="email" type="email" placeholder="Enter Email Address..."/>
        </label>
        <label for="user">
            UserName
            <input id="user" type="text" placeholder="Enter New User..."/>
        </label>
        <label for="password">
            Password Abcdef1!
            <span id="password-eye-container">
                <input id="password" type="password" placeholder="Password" />
                <i class="fa-solid fa-eye" id="reveal-pw"></i>
            </span>
        </label>
        <label for="confirm-password">
            Confirm Password
            <span id="confirm-password-eye-container">
                <input id="confirm-password" type="password" placeholder="Confirm Password" />
                <i class="fa-solid fa-eye" id="reveal-confirm-pw"></i>
            </span>
        </label>
        <span id="have-account-container">
            <p>Already a user?</p>
            <a href="/auth/auth.html?query=login">Login</a>
        </span>
        <button id="create">Create Account</button>
        <button id="clearUsers">Clear local storage</button>
    </div>`;
    
    const emailInput = document.getElementById("email");
    const userInput = document.getElementById("user");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const revealPwEye = document.getElementById("reveal-pw");
    const revealConfirmPwEye = document.getElementById("reveal-confirm-pw");

    const messageInfo = document.getElementById("info");
    const submitBox = document.getElementById("create");
        
    const verifyDisplayMessage = document.getElementById("verify-text");
    const verifyCode = document.getElementById("verify-code");
    const verifyMsg = document.getElementById("verify-msg");
    const modal = document.getElementById("modal-popup-email-verification");

    function togglePasswordVisibility(inputElement, eyeElement) {
        const isHidden = inputElement.type === "password";
        inputElement.type = isHidden ? "text" : "password";
        eyeElement.classList.toggle("fa-eye", !isHidden);
        eyeElement.classList.toggle("fa-eye-slash", isHidden);
    }
    if (revealPwEye) {
        revealPwEye.addEventListener("click", () => togglePasswordVisibility(passwordInput, revealPwEye));
    }

    if (revealConfirmPwEye) {
        revealConfirmPwEye.addEventListener("click", () => togglePasswordVisibility(confirmPasswordInput, revealConfirmPwEye));
    }


    submitBox.addEventListener('click', async () => {
        const email = emailInput.value.trim();
        const username = userInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        if (!email || !username || !password || !confirmPassword) {
            messageInfo.textContent = "Ensure all fields are filled in!";
            return;
        }
        if (!emailRegex.test(email)) {
            messageInfo.textContent = "Ensure email is entered correctly!";
            return;
        }
        if (!passwordRegex.test(password)) {
            messageInfo.textContent = "Password must be at least 8 characters, include one uppercase letter, one lowercase letter, one number, and one special character!";
            return;
        }
        if (password !== confirmPassword){
            messageInfo.textContent = "Ensure confirmation password matches the password field!";
            return;
        }
        const storedUsers = JSON.parse(localStorage.getItem('usersInfo') || '[]');
        const existingEmail = storedUsers.some((user)=> (user.emailAddress_username === emailInput.value));
        if (existingEmail){
            messageInfo.textContent = "Account already registered with existing email address. Use another";
            return;
        }
        const existingUser = storedUsers.some((user)=> (user.user === username));
        if (existingUser){
            messageInfo.textContent = "Username already been used!";
            return;
        }
        
        submitBox.disabled = true;
        const openModal = () => { modal.classList.add("show"); verifyCode.focus(); };
        try{
            messageInfo.textContent = "Sending verification code...";
            const token = await requestCode(email);
            pending = {email, username, password, token};
            verifyDisplayMessage.textContent = `We sent a 6-digit code to ${email}.`;
            verifyCode.value = "";
            verifyMsg.textContent = "";
            messageInfo.textContent = "";
            openModal();
        }
        catch(err){
            messageInfo.textContent=`Failure! unable to send email${err}`;
        }finally{
            submitBox.disabled = false;
        }
    });
    const clearLocalStorage = document.getElementById("clearUsers");  
    clearLocalStorage.addEventListener('click', ()=>{
        localStorage.removeItem('currentUser');
        messageInfo.textContent = "Session cleared.";
    });
    
    const verifyBtn = document.getElementById("verify-btn");
    verifyBtn.addEventListener('click', async () => {
        const code = verifyCode.value.trim();
        if (!pending) return;
        if (!/^\d{6}$/.test(code)){
            verifyMsg.textContent = "Please enter 6 digits only";
            return;
        }
        verifyBtn.disabled = true;
        try{
            await axios.post("/api/verify-code", {
                email: pending.email,
                code,
                token: pending.token
            });
 
            const storedUsers = JSON.parse(localStorage.getItem('usersInfo') || '[]');
            storedUsers.push({
                emailAddress_username: pending.email,
                user: pending.username,
                password: pending.password,
            });
            localStorage.setItem('usersInfo', JSON.stringify(storedUsers));
            localStorage.setItem('currentUser', pending.username);
 
            verifyMsg.textContent = "Verified! logging in....";
            setTimeout(()=>{
                window.location.href = "/Home_page/Homepage.html";
            }, 1000);
        }
        catch(error){
            verifyMsg.textContent = `Error! facing ${error}, stopping...`;
            verifyBtn.disabled = false;
        }
    });

    const resendBtn = document.getElementById("resend-btn");
     resendBtn.addEventListener('click', async () => {
        if (!pending){
            return;
        }
        resendBtn.disabled = true;
        try{
            pending.token = await requestCode(pending.email);
            verifyDisplayMessage.textContent = `Six digit code sent to ${pending.email}`;
        }
        catch(err){
            messageInfo.textContent = `Failure! unable to send email ${err}`;
        }
        finally{
            setTimeout(()=>{
                resendBtn.disabled = false;
            }, 3000);
        }
    });
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

function navigateAuthMain(){
    if (appState.currentView === "login"){
        renderLogin();
    }
    if (appState.currentView === "create"){
        renderCreate();
    }
}

document.addEventListener('click', (event)=>{
    const link = event.target.closest("a[href*='auth.html?query=']");
    if (!link) return;
 
    event.preventDefault();
 
    const url = new URL(link.href);
    const view = url.searchParams.get("query");
 
    appState.currentView = (view === "login") ? "login" : "create";
    history.pushState({}, "", link.getAttribute("href"));
    navigateAuthMain();
});

document.addEventListener('DOMContentLoaded',()=>{
    navigateAuthMain();
})
