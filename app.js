/**********************
 UTILISATEUR
**********************/
function getUser() {
  return JSON.parse(localStorage.getItem("user"));
}

function setUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

// Récupérer la liste globale de tous les inscrits (pour le comptage)
function getAllUsers() {
  return JSON.parse(localStorage.getItem("all_users")) || [];
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

// Fonction pour générer un code unique (ex: DELL8492)
function generateInviteCode() {
  return "DELL" + Math.floor(1000 + Math.random() * 9000);
}

/**********************
 INSCRIPTION
**********************/
function registerUser() {
  const phone = document.getElementById("reg-phone").value;
  const pass = document.getElementById("reg-pass").value;
  const pass2 = document.getElementById("reg-pass2").value;
  
  // Récupérer le code du parrain (soit dans un champ, soit dans l'URL)
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

  // Création du nouvel utilisateur avec son code unique
  const newUser = {
    phone: phone,
    password: pass,
    solde: 0,
    myInviteCode: generateInviteCode(), // Son propre code
    referredBy: parrainCode // Qui l'a parrainé
  };

  // 1. Sauvegarder comme utilisateur actuel
  setUser(newUser);

  // 2. Ajouter à la liste globale (pour que les autres voient leur compteur augmenter)
  const allUsers = getAllUsers();
  allUsers.push(newUser);
  localStorage.setItem("all_users", JSON.stringify(allUsers));

  window.location.href = "dashboard.html";
}

/**********************
 PARRAINAGE & DASHBOARD
**********************/
function afficherInfosParrainage() {
  const user = getUser();
  if (!user) return;

  // 1. Afficher le code de l'utilisateur
  const codeEl = document.getElementById("mon-code");
  if (codeEl) codeEl.innerText = user.myInviteCode;

  // 2. Afficher le lien de parrainage
  const lienEl = document.getElementById("mon-lien");
  if (lienEl) {
    lienEl.value = "https://chiraandre-sketch.github.io/invest-platform/register.html?ref=" + user.myInviteCode;
  }

  // 3. COMPTEUR : Calculer le nombre de personnes parrainées
  const allUsers = getAllUsers();
  const mesFilleuls = allUsers.filter(u => u.referredBy === user.myInviteCode);
  
  const countEl = document.getElementById("compteur-fillieuls");
  if (countEl) countEl.innerText = mesFilleuls.length;
}

/**********************
 INITIALISATION
**********************/
function afficherSolde() {
  const user = getUser();
  if (!user) return;

  const el = document.getElementById("solde");
  if (el) el.innerText = user.solde + " CDF";
}

document.addEventListener("DOMContentLoaded", () => {
  afficherSolde();
  afficherInfosParrainage();
});
