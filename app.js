/**********************
  GESTION UTILISATEUR
**********************/
function getUser() {
  return JSON.parse(localStorage.getItem("user"));
}

function setUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

// Liste de TOUS les inscrits pour le calcul du parrainage
function getAllUsers() {
  return JSON.parse(localStorage.getItem("all_users")) || [];
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

// Génère un code unique (ex: DELL5293)
function generateInviteCode() {
  return "DELL" + Math.floor(1000 + Math.random() * 9000);
}

/**********************
  INSCRIPTION (CORRIGÉE)
**********************/
function registerUser() {
  const phone = document.getElementById("reg-phone").value;
  const pass = document.getElementById("reg-pass").value;
  const pass2 = document.getElementById("reg-pass2").value;
  
  // Récupère le parrain via l'URL (?ref=DELLxxxx)
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

  // Création du profil avec code unique
  const newUser = {
    phone: phone,
    password: pass,
    solde: 0,
    myInviteCode: generateInviteCode(),
    referredBy: parrainCode
  };

  // Sauvegarde session actuelle
  setUser(newUser);

  // Ajout à la base de données globale
  const allUsers = getAllUsers();
  allUsers.push(newUser);
  localStorage.setItem("all_users", JSON.stringify(allUsers));

  alert("Compte créé ! Bienvenue chez DELL INVEST");
  window.location.href = "dashboard.html";
}

/**********************
  CONNEXION
**********************/
function loginUser() {
  const phone = document.getElementById("login-phone").value;
  const pass = document.getElementById("login-pass").value;
  const allUsers = getAllUsers();

  // Chercher l'utilisateur dans la liste globale
  const user = allUsers.find(u => u.phone === phone && u.password === pass);

  if (!user) {
    alert("Identifiants incorrects ou compte inexistant");
    return;
  }

  setUser(user);
  window.location.href = "dashboard.html";
}

/**********************
  MISE À JOUR DASHBOARD
**********************/
function initDashboard() {
  const user = getUser();
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // 1. Affichage du Solde
  const soldeEl = document.getElementById("solde");
  if (soldeEl) soldeEl.innerText = user.solde + " CDF";

  // 2. Affichage du Code de parrainage
  const codeEl = document.getElementById("mon-code");
  if (codeEl) codeEl.innerText = user.myInviteCode;

  // 3. Génération du Lien de parrainage
  const lienInput = document.getElementById("mon-lien");
  if (lienInput) {
    lienInput.value = "https://chiraandre-sketch.github.io/invest-platform/register.html?ref=" + user.myInviteCode;
  }

  // 4. CALCUL DU COMPTEUR (Combien de personnes m'ont choisi comme parrain)
  const allUsers = getAllUsers();
  const mesFilleuls = allUsers.filter(u => u.referredBy === user.myInviteCode);
  
  const countEl = document.getElementById("compteur-fillieuls");
  if (countEl) countEl.innerText = mesFilleuls.length;
}

// Fonction pour copier le lien
function copyLink() {
  const copyText = document.getElementById("mon-lien");
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(copyText.value);
  alert("Lien de parrainage copié !");
}

document.addEventListener("DOMContentLoaded", initDashboard);
