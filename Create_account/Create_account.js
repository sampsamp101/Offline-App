require('dotenv').config();

const axios = require('axios');
const resend = new Resend(process.env.RESEND_API_KEY);

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

const clearLocalStorage = document.getElementById("clearUsers");

function togglePasswordVisibility(inputElement, eyeElement) {
    const isHidden = inputElement.type === "password";
    inputElement.type = isHidden ? "text" : "password";
    eyeElement.classList.toggle("fa-eye", !isHidden);
    eyeElement.classList.toggle("fa-eye-slash", isHidden);
}

async function sendEmail(){
  const { data, error } = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: ['delivered@resend.dev'],
    subject: 'Hello World',
    html: '<strong>It works!</strong>',
  });
  if (error) {
    return console.error({ error });
  }
  console.log({ data });
};

if (revealPwEye) {
    revealPwEye.addEventListener("click", () => togglePasswordVisibility(passwordInput, revealPwEye));
}

if (revealConfirmPwEye) {
    revealConfirmPwEye.addEventListener("click", () => togglePasswordVisibility(confirmPasswordInput, revealConfirmPwEye));
}

submitBox.addEventListener('click', () => {

    const storedUsers = JSON.parse(localStorage.getItem('usersInfo') || '[]');

    if (emailInput.value === "" || userInput.value === "" || passwordInput.value === "" || confirmPasswordInput.value === "") {
        messageInfo.textContent = "Ensure all fields are filled in!";
        return;
    }
    if (!emailRegex.test(emailInput.value)) {
        messageInfo.textContent = "Ensure email is entered correctly!";
        return;
    }
    if (!passwordRegex.test(passwordInput.value)) {
        messageInfo.textContent = "Password must be at least 8 characters, include one uppercase letter, one lowercase letter, one number, and one special character!";
        return;
    }
    if (passwordInput.value !== confirmPasswordInput.value) {
        messageInfo.textContent = "Ensure confirmation password matches the password field!";
        return;
    }
    const existingEmail = storedUsers.some((user)=> (user.emailAddress_username === emailInput.value));
    if (existingEmail){
        messageInfo.textContent = "Account already registered with existing email address. Use another";
        return;
    }
    const existingUser = storedUsers.some((user)=> (user.user === userInput.value));

    if (existingUser){
        messageInfo.textContent = "Username already been used!";
        return;
    }

    storedUsers.push({
        emailAddress_username: emailInput.value,
        user: userInput.value,
        password: passwordInput.value,
    });
    
    try{
        localStorage.setItem('usersInfo', JSON.stringify(storedUsers));
        localStorage.setItem('currentUser', userInput.value);
        messageInfo.textContent = "Success! Account created. Logging in...";
        setTimeout(()=>{   
            window.location.href = "/Home_page/Homepage.html";
        }, 2000);
    }
    catch(err){
        messageInfo.textContent=`Failure! unable to create account in database. ${err}`;
    }
});

clearLocalStorage.addEventListener('click', ()=>{
    localStorage.removeItem('currentUser');
    messageInfo.textContent = "Session cleared.";
});