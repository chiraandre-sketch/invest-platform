/***********************
 INSCRIPTION
***********************/
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const phone = document.getElementById("regPhone").value;
    const pass = document.getElementById("regPassword").value;
    const confirm = document.getElementById("regConfirm").value;

    if (pass !== confirm) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    localStorage.setItem("user_phone", phone);
    localStorage.setItem("user_pass", pass);
    localStorage.setItem("connected", "no");

    alert("Inscription réussie. Connectez-vous.");
    window.location.href = "index.html";
  });
}

/***********************
 CONNEXION
***********************/
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const phone = document.getElementById("loginPhone").value;
    const pass = document.getElementById("loginPassword").value;

    if (
      phone === localStorage.getItem("user_phone") &&
      pass === localStorage.getItem("user_pass")
    ) {
      localStorage.setItem("connected", "yes");
      window.location.href = "dashboard.html";
    } else {
      alert("Numéro ou mot de passe incorrect");
    }
  });
}

/***********************
 PROTECTION DASHBOARD
***********************/
if (window.location.pathname.includes("dashboard.html")) {
  if (localStorage.getItem("connected") !== "yes") {
    window.location.href = "index.html";
  }
}
