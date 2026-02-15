// --- FONCTIONS DE BASE ---
function getUser() {
    return JSON.parse(localStorage.getItem("user"));
}

function getAllUsers() {
    return JSON.parse(localStorage.getItem("all_users")) || [];
}

// --- INITIALISATION DU DASHBOARD ---
function initDashboard() {
    const user = getUser();
    const allUsers = getAllUsers();

    if (!user) {
        // Si pas de session, retour au login
        if (!window.location.href.includes("login.html") && !window.location.href.includes("register.html")) {
            window.location.href = "login.html";
        }
        return;
    }

    // 1. Afficher le solde
    const soldeEl = document.getElementById("solde");
    if (soldeEl) soldeEl.innerText = (user.solde || 0) + " CDF";

    // 2. Afficher le code d'invitation
    const codeEl = document.getElementById("mon-code");
    if (codeEl) {
        // Si l'utilisateur n'a pas encore de code (ancien compte), on lui en donne un
        if (!user.myInviteCode) {
            user.myInviteCode = "DELL" + Math.floor(1000 + Math.random() * 9000);
            localStorage.setItem("user", JSON.stringify(user));
        }
        codeEl.innerText = user.myInviteCode;
    }

    // 3. Afficher le lien de parrainage
    const lienEl = document.getElementById("mon-lien");
    if (lienEl) {
        lienEl.value = "https://chiraandre-sketch.github.io/invest-platform/register.html?ref=" + user.myInviteCode;
    }

    // 4. Compter les filleuls
    const countEl = document.getElementById("compteur-fillieuls");
    if (countEl) {
        const nombre = allUsers.filter(u => u.referredBy === user.myInviteCode).length;
        countEl.innerText = nombre;
    }
}

// Lancer au chargement
document.addEventListener("DOMContentLoaded", initDashboard);
