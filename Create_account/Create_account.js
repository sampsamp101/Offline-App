const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const emailInput = document.getElementById("email");
const userInput = document.getElementById("user");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
const submitBox = document.getElementById("login");
const messageInfo = document.getElementById("info");
const revealPwEye = document.getElementById("reveal-pw");
const revealConfirmPwEye = document.getElementById("reveal-confirm-pw");

//modal popup email authentication  
const modal = document.getElementById("modal-popup-email-verification");
const closeBtn = document.getElementById("closeBtn");
const verifyDisplayMessage = document.getElementById("verify-text");
const verifyCode = document.getElementById("verify-code");
const verifyBtn = document.getElementById("verify-btn");
const resendBtn = document.getElementById("resend-btn");
const verifyMsg = document.getElementById("verify-msg");

const clearLocalStorage = document.getElementById("clearUsers");
let pending = null;   // { email, username, password, token }

const openModal = () => { modal.classList.add("show"); verifyCode.focus(); };
const closeModal = () => modal.classList.remove("show");

async function requestCode(email) {
    const { data } = await axios.post("/api/send-code", {email});
    return data.token;
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

clearLocalStorage.addEventListener('click', ()=>{
    localStorage.removeItem('currentUser');
    messageInfo.textContent = "Session cleared.";
});


 verifyBtn.addEventListener('click', async ()=>{
    const code = verifyCode.value.trim();
    if (!pending) return;
    if (!/^\d{6}$/.test(code)){
        verifyMsg.textContent = "Please enter 6 digits only";
        return;
    }
    verifyBtn.disabled = true;
    try{
        //await axios.post(url, userData) etc=axios.post("https://jsonplaceholder.typicode.com/posts", {title: "foo", body: "bar", userId: 1,})
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

resendBtn.addEventListener('click', async () =>{
    if (!pending){
        return;
    }
    resendBtn.disabled = true;
    try{
        pending.token = await requestCode(pending.email);
        verifyDisplayMessage.textContent = `six digits code sent to ${pending.email}`;
    }
    catch(err){
        messageInfo.textContent=`Failure! unable to send email${err}`;
    }finally{
        //set cooldown for resend button around ~3 seconds, disable it for 3 second;
        setTimeout(()=>{
            resendBtn.disabled = false;
        },3000);
    }
});

closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e)=>{
    if(e.target === modal){
        closeModal();
    }
});

document.addEventListener('keydown', (e)=>{
    if (e.key === "Escape"){
        closeModal();
    }
})

// function togglePasswordVisibility(inputElement, eyeElement) {
//     const isHidden = inputElement.type === "password";
//     inputElement.type = isHidden ? "text" : "password";
//     eyeElement.classList.toggle("fa-eye", !isHidden);
//     eyeElement.classList.toggle("fa-eye-slash", isHidden);
// }
// if (revealPwEye) {
//     revealPwEye.addEventListener("click", () => togglePasswordVisibility(passwordInput, revealPwEye));
// }

// if (revealConfirmPwEye) {
//     revealConfirmPwEye.addEventListener("click", () => togglePasswordVisibility(confirmPasswordInput, revealConfirmPwEye));
// }

// const modal = document.getElementById("modal-popup-email-verification");
// const openBtn = document.getElementById("openBtn");
// const closeBtn = document.getElementById("closeBtn");

// function openModal() {
//   modal.classList.add("show");
// }
// function closeModal() {
//   modal.classList.remove("show");
// }
// openBtn.addEventListener("click", openModal);
// closeBtn.addEventListener("click", closeModal);

// /* Close when clicking outside the modal box */
// modal.addEventListener("click", function (event) {
//   if (event.target === modal) {
//     closeModal();
//   }
// });

// /* Close when pressing Escape */
// document.addEventListener("keydown", function (event) {
//   if (event.key === "Escape") {
//     closeModal();
//   }
// });

// async function sendEmail() {
//   try {
//     const response = await axios.post("/api/send-email", {});
//     console.log(response.data.message);
//     return true;
//   } catch (error) {
//     console.error(
//       "Email error:",
//       error.response?.data?.error || error.message
//     );
//     return false;
//   }
// }