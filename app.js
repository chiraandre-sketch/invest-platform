// --- FONCTIONS DE BASE ---
function getUser() { return JSON.parse(localStorage.getItem("user")); }
function getAllUsers() { return JSON.parse(localStorage.getItem("all_users")) || []; }

// --- INITIALISATION DES PAGES ---
function initPages() {
    const user = getUser();
    const allUsers = getAllUsers();
    
    if (!user) return;

    // Calcul des niveaux (Lv1, Lv2, Lv3)
    const lv1 = allUsers.filter(u => u.referredBy === user.myInviteCode);
    const lv1Codes = lv1.map(u => u.myInviteCode);
    const lv2 = allUsers.filter(u => lv1Codes.includes(u.referredBy));
    const lv2Codes = lv2.map(u => u.myInviteCode);
    const lv3 = allUsers.filter(u => lv2Codes.includes(u.referredBy));

    // Construction du lien d'invitation propre
    const currentUrl = window.location.href;
    const baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/'));
    const finalLink = baseUrl + "/register.html?inviteCode=" + user.myInviteCode;

    // MISE À JOUR DU DASHBOARD (ACCUEIL)
    if (document.getElementById("mon-code")) {
        document.getElementById("mon-code").innerText = user.myInviteCode;
        document.getElementById("mon-lien").value = finalLink;
    }

    // MISE À JOUR DE LA PAGE ÉQUIPE
    if (document.getElementById("equipe-code")) {
        document.getElementById("equipe-code").innerText = user.myInviteCode;
        document.getElementById("equipe-lien-text").innerText = finalLink;
        document.getElementById("hidden-link").value = finalLink;
        
        // Mise à jour des compteurs d'utilisateurs
        document.getElementById("count-lv1").innerText = lv1.length + " Utilisateurs";
        document.getElementById("count-lv2").innerText = lv2.length + " Utilisateurs";
        document.getElementById("count-lv3").innerText = lv3.length + " Utilisateurs";
    }

    // MISE À JOUR DU SOLDE
    if (document.getElementById("solde")) {
        document.getElementById("solde").innerText = (user.solde || 0) + " CDF";
    }
}

// Lancer au chargement
document.addEventListener("DOMContentLoaded", initPages);
