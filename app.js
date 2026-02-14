/**********************
 UTILISATEUR
**********************/
function getUser() {
  return JSON.parse(localStorage.getItem("user"));
}

function setUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

/**********************
 INSCRIPTION
**********************/
function registerUser() {
  const phone = document.getElementById("reg-phone").value;
  const pass = document.getElementById("reg-pass").value;
  const pass2 = document.getElementById("reg-pass2").value;

  if (!phone || !pass || !pass2) {
    alert("Tous les champs sont obligatoires");
    return;
  }

  if (pass !== pass2) {
    alert("Les mots de passe ne correspondent pas");
    return;
  }

  setUser({
    phone: phone,
    password: pass,
    solde: 0
  });

  window.location.href = "dashboard.html";
}

/**********************
 CONNEXION
**********************/
function loginUser() {
  const phone = document.getElementById("login-phone").value;
  const pass = document.getElementById("login-pass").value;

  const user = getUser();

  if (!user) {
    alert("Aucun compte trouvé");
    return;
  }

  if (user.phone !== phone || user.password !== pass) {
    alert("Identifiants incorrects");
    return;
  }

  window.location.href = "dashboard.html";
}

/**********************
 PROTECTION DASHBOARD
**********************/
function protectDashboard() {
  const user = getUser();
  if (!user) {
    window.location.href = "login.html";
  }
}

/**********************
 SOLDE
**********************/
function afficherSolde() {
  const user = getUser();
  if (!user) return;

  const el = document.getElementById("solde");
  if (el) el.innerText = user.solde + " CDF";
}

document.addEventListener("DOMContentLoaded", afficherSolde);
