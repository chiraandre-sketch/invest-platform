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
}// Fonction pour ajouter une transaction
function addTransaction(type, montant, details) {
    let user = getUser();
    if (!user) return;

    // Créer l'objet transaction
    const newTrans = {
        id: "#TR" + Math.floor(100000 + Math.random() * 900000),
        type: type, // "Dépôt", "Retrait", "Achat VIP"
        montant: montant,
        details: details,
        date: new Date().toLocaleString('fr-FR'),
        status: "Terminé"
    };

    // Ajouter à la liste de l'utilisateur
    if (!user.transactions) user.transactions = [];
    user.transactions.unshift(newTrans); // Le plus récent en premier

    // Sauvegarder
    localStorage.setItem("user", JSON.stringify(user));
    
    // Mettre à jour la base globale
    let all = JSON.parse(localStorage.getItem("all_users"));
    let index = all.findIndex(u => u.phone === user.phone);
    all[index] = user;
    localStorage.setItem("all_users", JSON.stringify(all));
}

