const loginBox = document.getElementById('loginBox');
const signupBox = document.getElementById('signupBox');
const dashBox = document.getElementById('dashBox');
const toggleText = document.getElementById('toggleText');
const toggleLink = document.getElementById('toggleLink');
const welcomeText = document.getElementById('welcomeText');

const suName = document.getElementById('suName');
const suUser = document.getElementById('suUser');
const suEmail = document.getElementById('suEmail');
const suPass = document.getElementById('suPass');
const suPass2 = document.getElementById('suPass2');
const signupMsg = document.getElementById('signupMsg');

const loginUser = document.getElementById('loginUser');
const loginPass = document.getElementById('loginPass');
const loginMsg = document.getElementById('loginMsg');

/* MULTI USER STORAGE */
function getUsers(){
  return JSON.parse(localStorage.getItem("users") || "[]");
}
function saveUsers(users){
  localStorage.setItem("users", JSON.stringify(users));
}

/* TOGGLE LOGIN/SIGNUP */
function toggle(){
  loginBox.classList.toggle('hidden');
  signupBox.classList.toggle('hidden');
  if(loginBox.classList.contains('hidden')){
    toggleText.textContent="Already have an account?";
    toggleLink.textContent="Log in";
  }else{
    toggleText.textContent="Don't have an account?";
    toggleLink.textContent="Sign up";
  }
}

/* SHOW/HIDE PASSWORD */
function togglePass(id){
  const el = document.getElementById(id);
  el.type = (el.type === "password") ? "text" : "password";
}

/* PASSWORD STRENGTH */
function strongPass(p){
  return p.length >= 6 &&
         /[a-z]/.test(p) &&
         /[A-Z]/.test(p) &&
         /[0-9]/.test(p) &&
         /[!@#$%^&*]/.test(p);
}

/* SIGNUP */
function signup(){
  const name = suName.value.trim();
  const user = suUser.value.trim();
  const email = suEmail.value.trim();
  const pass = suPass.value.trim();
  const pass2 = suPass2.value.trim();

  if(!name||!user||!email||!pass||!pass2){
    signupMsg.textContent="Fill all fields";
    return;
  }
  if(pass!==pass2){
    signupMsg.textContent="Passwords do not match";
    return;
  }
  if(!strongPass(pass)){
    signupMsg.textContent="Password must be 6+ chars with A-Z, a-z, 0-9 & symbol";
    return;
  }

  let users = getUsers();
  if(users.find(u=>u.user===user || u.email===email)){
    signupMsg.textContent="User already exists";
    return;
  }

  users.push({name,user,email,pass});
  saveUsers(users);

  signupMsg.textContent="Account created ✅";
  suName.value=suUser.value=suEmail.value=suPass.value=suPass2.value="";
}
setTimeout(()=>{
  toggle();
  signupMsg.textContent="";
},1000);

/* LOGIN */
function login(){
  const id = loginUser.value.trim();
  const pass = loginPass.value.trim();

  if(!id||!pass){
    loginMsg.textContent="Enter credentials";
    return;
  }

  const users = getUsers();
  const found = users.find(u => (u.user===id || u.email===id) && u.pass===pass);

  if(found){
    welcomeText.textContent = "Welcome, " + found.name + " 👋";
    loginBox.classList.add('hidden');
    signupBox.classList.add('hidden');
    dashBox.classList.remove('hidden');
    loginMsg.textContent="";
    loginUser.value=loginPass.value="";
  }else{
    loginMsg.textContent="Invalid credentials ❌";
  }
}

/* ENTER KEY LOGIN */
function enterLogin(e){
  if(e.key==="Enter") login();
}

/* LOGOUT */
function logout(){
  dashBox.classList.add('hidden');
  loginBox.classList.remove('hidden');
}