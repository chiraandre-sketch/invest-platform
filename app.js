/********************************GLOBAL********************************/
function getUser() { return JSON.parse(localStorage.getItem("user")); }
function setUser(user) { localStorage.setItem("user", JSON.stringify(user)); }
function getAllUsers() { return JSON.parse(localStorage.getItem("all_users")) || []; }

/********************************INSCRIPTION********************************/
function registerUser() {
    const phone = document.getElementById("reg-phone").value;
    const pass = document.getElementById("reg-pass").value;
    const pass2 = document.getElementById("reg-pass2").value;
    
    // Capture du code d'invitation comme dans ton exemplaire
    const urlParams = new URLSearchParams(window.location.search);
    const inviteCode = urlParams.get('inviteCode') || "DIRECT";

    if (!phone || !pass || !pass2) { alert("Tous les champs sont obligatoires"); return; }
    if (pass !== pass2) { alert("Les mots de passe ne correspondent pas"); return; }

    // Génération d'un code unique style exemplaire (Majuscules et Chiffres)
    const myNewCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    const newUser = {
        phone: phone,
        password: pass,
        solde: 0,
        myInviteCode: myNewCode,
        referredBy: inviteCode,
        date: new Date().toLocaleDateString()
    };

    // Sauvegarde
    let allUsers = getAllUsers();
    allUsers.push(newUser);
    localStorage.setItem("all_users", JSON.stringify(allUsers));
    setUser(newUser);

    window.location.href = "dashboard.html";
}

/********************************DASHBOARD********************************/
function initDashboard() {
    const user = getUser();
    const allUsers = getAllUsers();

    if (!user) return;

    // 1. Affichage du Solde
    const soldeEl = document.getElementById("solde");
    if (soldeEl) soldeEl.innerText = (user.solde || 0).toFixed(2) + " CDF";

    // 2. Affichage du Code Invitation
    const codeEl = document.getElementById("mon-code");
    if (codeEl) codeEl.innerText = user.myInviteCode;

    // 3. Lien de parrainage (Format exemplaire)
    const lienEl = document.getElementById("mon-lien");
    if (lienEl) {
        lienEl.value = "https://chiraandre-sketch.github.io/invest-platform/register.html?inviteCode=" + user.myInviteCode;
    }

    // 4. Compteur d'équipe (Dynamique)
    const countEl = document.getElementById("compteur-fillieuls");
    if (countEl) {
        const team = allUsers.filter(u => u.referredBy === user.myInviteCode);
        countEl.innerText = team.length;
    }
}

// Fonction de copie
function copyLink() {
    const input = document.getElementById("mon-lien");
    input.select();
    document.execCommand("copy");
    alert("Lien d'invitation copié !");
}

document.addEventListener("DOMContentLoaded", initDashboard);
