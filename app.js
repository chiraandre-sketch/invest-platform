// --- FONCTIONS DE BASE ---
function getUser() { return JSON.parse(localStorage.getItem("user")); }
function getAllUsers() { return JSON.parse(localStorage.getItem("all_users")) || []; }

// --- LOGIQUE DE L'ÉQUIPE PAR NIVEAUX ---
function initEquipe() {
    const user = getUser();
    const allUsers = getAllUsers();
    if (!user) return;

    // Niveau 1 : Ceux qui ont utilisé MON code
    const lv1 = allUsers.filter(u => u.referredBy === user.myInviteCode);
    
    // Niveau 2 : Ceux qui ont été invités par mon Niveau 1
    const lv1Codes = lv1.map(u => u.myInviteCode);
    const lv2 = allUsers.filter(u => lv1Codes.includes(u.referredBy));

    // Niveau 3 : Ceux qui ont été invités par mon Niveau 2
    const lv2Codes = lv2.map(u => u.myInviteCode);
    const lv3 = allUsers.filter(u => lv2Codes.includes(u.referredBy));

    // Affichage des compteurs sur la page Equipe
    if(document.getElementById("count-lv1")) document.getElementById("count-lv1").innerText = lv1.length + " Utilisateurs";
    if(document.getElementById("count-lv2")) document.getElementById("count-lv2").innerText = lv2.length + " Utilisateurs";
    if(document.getElementById("count-lv3")) document.getElementById("count-lv3").innerText = lv3.length + " Utilisateurs";

    // Affichage du code et du lien sur la page Equipe
    if(document.getElementById("equipe-code")) document.getElementById("equipe-code").innerText = user.myInviteCode;
    if(document.getElementById("equipe-lien")) {
        const link = window.location.origin + window.location.pathname.replace("equipe.html", "register.html") + "?inviteCode=" + user.myInviteCode;
        document.getElementById("equipe-lien-text").innerText = link;
        document.getElementById("hidden-link").value = link;
    }
}

// Fonction de copie pour la page équipe
async function copyEquipeLink() {
    const linkText = document.getElementById("hidden-link").value;
    try {
        await navigator.clipboard.writeText(linkText);
        alert("Lien copié !");
    } catch (err) {
        const input = document.getElementById("hidden-link");
        input.select();
        document.execCommand("copy");
        alert("Lien copié !");
    }
}

document.addEventListener("DOMContentLoaded", initEquipe);
