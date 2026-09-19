const passwordRegex= /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const userInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const submitBox = document.getElementById("login");
const messageInfo = document.getElementById("info");
const revealPwEye = document.getElementById("reveal-pw");


document.addEventListener('DOMContentLoaded',()=>{
    const userName = localStorage.getItem('currentUser');
    profileUsername.textContent = userName
});

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

function recoverPasswordFunction(){

    



}

