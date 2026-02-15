// Initialisation des données globales
if (!localStorage.getItem("all_users")) {
    localStorage.setItem("all_users", JSON.stringify([]));
}

// Fonction pour récupérer l'utilisateur connecté
function getUser() {
    return JSON.parse(localStorage.getItem("user"));
}

// Fonction pour enregistrer un nouvel utilisateur
function registerUser(phone, password, inviteCode) {
    let allUsers = JSON.parse(localStorage.getItem("all_users"));
    
    // Vérifier si le numéro existe déjà
    if (allUsers.find(u => u.phone === phone)) {
        alert("Ce numéro est déjà utilisé.");
        return false;
    }

    // Créer le nouvel utilisateur
    const newUser = {
        phone: phone,
        password: password,
        referredBy: inviteCode || "DIRECT", // Qui l'a invité
        myInviteCode: "DELL" + Math.floor(1000 + Math.random() * 9000), // Son propre code
        solde: 0,
        date: new Date().toLocaleDateString()
    };

    allUsers.push(newUser);
    localStorage.setItem("all_users", JSON.stringify(allUsers));
    localStorage.setItem("user", JSON.stringify(newUser)); // Connecter l'utilisateur
    return true;
}
