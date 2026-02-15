/**********************
  GESTION UTILISATEUR
**********************/
function getUser() {
  return JSON.parse(localStorage.getItem("user"));
}

function setUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

function getAllUsers() {
  return JSON.parse(localStorage.getItem("all_users")) || [];
}

/**********************
  INSCRIPTION & CONNEXION
**********************/
function registerUser() {
  const phone = document.getElementById("reg-phone").value;
  const pass = document.getElementById("reg-pass").value;
  const pass2 = document.getElementById("reg-pass2").value;
  
  const urlParams = new URLSearchParams(window.location.search);
  const parrainCode = urlParams.get('ref') || "DIRECT";

  if (!phone || !pass || !pass2) {
    alert("Tous les champs sont obligatoires");
    return;
  }
  if (pass !== pass2) {
    alert("Les mots de passe ne correspondent pas");
    return;
  }

  const myCode = "DELL" + Math.floor(1000 + Math.random() * 9000);
  const newUser = {
    phone: phone,
    password: pass,
    solde: 0,
    myInviteCode: myCode,
    referredBy: parrainCode
  };

  setUser(newUser);
  let allUsers = getAllUsers();
  allUsers.push(newUser);
  localStorage.setItem("all_users", JSON.stringify(allUsers));

  // REDIRECTION (Vérifie bien que le fichier s'appelle dashboard.html)
  window.location.href = "dashboard.html";
}

function loginUser() {
  const phone = document.getElementById("login-phone").value;
  const pass = document.getElementById("login-pass").value;
  const allUsers = getAllUsers();
  const user = allUsers.find(u => u.phone === phone && u.password === pass);

  if (!user) {
    alert("Identifiants incorrects");
    return;
  }

  setUser(user);
  window.location.href = "dashboard.html";
}

/**********************
  LOGIQUE DASHBOARD
**********************/
function initDashboard() {
  const user = getUser();
  if (!user) return;

  // Mise à jour du solde
  const soldeEl = document.getElementById("solde");
  if (soldeEl) soldeEl.innerText = user.solde + " CDF";

  // Infos parrainage
  if(document.getElementById("mon-code")) document.getElementById("mon-code").innerText = user.myInviteCode;
  
  if(document.getElementById("mon-lien")) {
    document.getElementById("mon-lien").value = "https://chiraandre-sketch.github.io/invest-platform/register.html?ref=" + user.myInviteCode;
  }

  // Calculateur de filleuls
  const allUsers = getAllUsers();
  const nombre = allUsers.filter(u => u.referredBy === user.myInviteCode).length;
  if(document.getElementById("compteur-fillieuls")) {
    document.getElementById("compteur-fillieuls").innerText = nombre;
  }
}

document.addEventListener("DOMContentLoaded", initDashboard);
