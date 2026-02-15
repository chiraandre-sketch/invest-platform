/*************************
 * INITIALISATION & SESSION
 *************************/
if (!localStorage.getItem("all_users")) {
    localStorage.setItem("all_users", JSON.stringify([]));
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem("current_user"));
}

// Fonction pour rafraîchir les données de l'utilisateur depuis la "base de données"
function refreshUserSession() {
    let user = getCurrentUser();
    if (user) {
        let users = JSON.parse(localStorage.getItem("all_users"));
        let updated = users.find(u => u.phone === user.phone);
        localStorage.setItem("current_user", JSON.stringify(updated));
    }
}

/*************************
 * LECTURE AUTOMATIQUE DU LIEN (DELL4999)
 *************************/
// À exécuter sur la page register.html
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('inviteCode');
    const inputInvite = document.getElementById('r-invite'); // Assure-toi que l'ID est 'r-invite'
    if (code && inputInvite) {
        inputInvite.value = code;
    }
}

/*************************
 * INSCRIPTION AVEC CASCADE 3 NIVEAUX
 *************************/
function registerUser(phone, password, inviteCode) {
    let users = JSON.parse(localStorage.getItem("all_users"));

    if (users.find(u => u.phone === phone)) {
        alert("Numéro déjà utilisé");
        return false;
    }

    const newUser = {
        phone: phone,
        password: password,
        solde: 0,
        myInviteCode: "DELL" + Math.floor(1000 + Math.random() * 9000),
        referredBy: inviteCode || "DIRECT",
        team: { n1: 0, n2: 0, n3: 0 }, // Compteurs réels
        createdAt: new Date().toLocaleString()
    };

    // --- LOGIQUE DE PARRAINAGE RÉPARÉE ---
    if (inviteCode && inviteCode !== "DIRECT") {
        // Niveau 1 : Le parrain direct
        let p1 = users.find(u => u.myInviteCode === inviteCode);
        if (p1) {
            p1.team.n1 += 1;
            // Niveau 2 : Le parrain du parrain
            if (p1.referredBy && p1.referredBy !== "DIRECT") {
                let p2 = users.find(u => u.myInviteCode === p1.referredBy);
                if (p2) {
                    p2.team.n2 += 1;
                    // Niveau 3 : Le parrain du parrain du parrain
                    if (p3.referredBy && p3.referredBy !== "DIRECT") {
                        let p3 = users.find(u => u.myInviteCode === p2.referredBy);
                        if (p3) p3.team.n3 += 1;
                    }
                }
            }
        }
    }

    users.push(newUser);
    localStorage.setItem("all_users", JSON.stringify(users));
    return true;
}

/*************************
 * AFFICHAGE EQUIPE (POUR TON TABLEAU DE BORD)
 *************************/
function updateTeamUI() {
    refreshUserSession(); // On récupère les derniers compteurs
    const user = getCurrentUser();
    
    // Si ces IDs existent dans ton HTML, ils se mettront à jour
    if(document.getElementById('n1')) document.getElementById('n1').innerText = user.team.n1;
    if(document.getElementById('n2')) document.getElementById('n2').innerText = user.team.n2;
    if(document.getElementById('n3')) document.getElementById('n3').innerText = user.team.n3;
}
