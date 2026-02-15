// --- FONCTIONS DE BASE ---
const getUser = () => JSON.parse(localStorage.getItem("user"));
const getAllUsers = () => JSON.parse(localStorage.getItem("all_users")) || [];

function initApp() {
    const user = getUser();
    const allUsers = getAllUsers();

    if (!user) return;

    // 1. Génération automatique du code s'il n'existe pas
    if (!user.myInviteCode) {
        user.myInviteCode = "DELL" + Math.floor(1000 + Math.random() * 9000);
        localStorage.setItem("user", JSON.stringify(user));
    }

    // 2. Création du lien d'invitation dynamique
    const baseUrl = window.location.origin + window.location.pathname.split('/').slice(0, -1).join('/');
    const inviteLink = baseUrl + "/register.html?inviteCode=" + user.myInviteCode;

    // 3. Affichage sur le Dashboard (Accueil)
    if (document.getElementById("mon-code")) document.getElementById("mon-code").innerText = user.myInviteCode;
    if (document.getElementById("mon-lien")) document.getElementById("mon-lien").value = inviteLink;

    // 4. Affichage sur la page Équipe (Lv1, Lv2, Lv3)
    if (document.getElementById("equipe-code")) {
        document.getElementById("equipe-code").innerText = user.myInviteCode;
        document.getElementById("equipe-lien-text").innerText = inviteLink;
        document.getElementById("hidden-link").value = inviteLink;

        // Calcul des niveaux
        const lv1 = allUsers.filter(u => u.referredBy === user.myInviteCode);
        const lv1Codes = lv1.map(u => u.myInviteCode);
        const lv2 = allUsers.filter(u => lv1Codes.includes(u.referredBy));
        const lv2Codes = lv2.map(u => u.myInviteCode);
        const lv3 = allUsers.filter(u => lv2Codes.includes(u.referredBy));

        document.getElementById("count-lv1").innerText = lv1.length + " Membres";
        document.getElementById("count-lv2").innerText = lv2.length + " Membres";
        document.getElementById("count-lv3").innerText = lv3.length + " Membres";
    }

    // 5. Mise à jour du solde
    if (document.getElementById("solde")) document.getElementById("solde").innerText = (user.solde || 0) + " CDF";
}

document.addEventListener("DOMContentLoaded", initApp);
