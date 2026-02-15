// --- FONCTIONS DE BASE ---
function getUser() { return JSON.parse(localStorage.getItem("user")); }
function setUser(user) { localStorage.setItem("user", JSON.stringify(user)); }
function getAllUsers() { return JSON.parse(localStorage.getItem("all_users")) || []; }

// --- GÉNÉRATEUR AUTOMATIQUE DE CODE ---
// Cette fonction crée un code unique comme DELL-8429
function generateAutoCode() {
    const num = Math.floor(1000 + Math.random() * 9000);
    return "DELL-" + num;
}

// --- INSCRIPTION AUTOMATIQUE ---
function registerUser() {
    const phone = document.getElementById("reg-phone").value;
    const pass = document.getElementById("reg-pass").value;
    const pass2 = document.getElementById("reg-pass2").value;
    
    // On récupère le code du parrain dans l'URL s'il existe
    const urlParams = new URLSearchParams(window.location.search);
    const codeDuParrain = urlParams.get('inviteCode') || "DIRECT";

    if (!phone || !pass || !pass2) {
        alert("Remplissez tous les champs");
        return;
    }
    if (pass !== pass2) {
        alert("Les mots de passe ne correspondent pas");
        return;
    }

    // CRÉATION AUTOMATIQUE DU CODE POUR LE NOUVEL UTILISATEUR
    const monPropreCode = generateAutoCode();

    const newUser = {
        phone: phone,
        password: pass,
        solde: 0,
        myInviteCode: monPropreCode, // Son code créé ici
        referredBy: codeDuParrain,    // On lie l'invité au parrain
        date: new Date().toLocaleDateString()
    };

    // Enregistrement dans la base globale
    let users = getAllUsers();
    users.push(newUser);
    localStorage.setItem("all_users", JSON.stringify(users));
    
    // Connexion
    setUser(newUser);
    alert("Compte créé avec succès ! Votre code est : " + monPropreCode);
    window.location.href = "dashboard.html";
}

// --- MISE À JOUR DU TABLEAU DE BORD ---
function updateDashboard() {
    const user = getUser();
    const allUsers = getAllUsers();

    if (!user) return;

    // Afficher le code généré automatiquement
    if (document.getElementById("mon-code")) {
        document.getElementById("mon-code").innerText = user.myInviteCode;
    }

    // Créer le lien d'invitation avec le code dedans
    if (document.getElementById("mon-lien")) {
        const monLienLien = "https://chiraandre-sketch.github.io/invest-platform/register.html?inviteCode=" + user.myInviteCode;
        document.getElementById("mon-lien").value = monLienLien;
    }

    // Compter les gens qui se sont inscrits via ce lien
    if (document.getElementById("compteur-fillieuls")) {
        const mesInvites = allUsers.filter(u => u.referredBy === user.myInviteCode);
        document.getElementById("compteur-fillieuls").innerText = mesInvites.length;
    }

    // Afficher le solde
    if (document.getElementById("solde")) {
        document.getElementById("solde").innerText = (user.solde || 0) + " CDF";
    }
}

function copyLink() {
    const input = document.getElementById("mon-lien");
    input.select();
    document.execCommand("copy");
    alert("Lien d'invitation copié ! Envoyez-le à vos amis.");
}

document.addEventListener("DOMContentLoaded", updateDashboard);
