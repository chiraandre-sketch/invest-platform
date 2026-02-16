// Initialisation de la base de données locale
if (!localStorage.getItem("all_users")) {
    localStorage.setItem("all_users", JSON.stringify([]));
}

// Gestion de la Session
function getCurrentUser() {
    return JSON.parse(localStorage.getItem("current_user"));
}

function logout() {
    localStorage.removeItem("current_user");
    window.location.href = "login.html";
}

function protectPage() {
    if (!getCurrentUser()) {
        window.location.href = "login.html";
    }
}

// Inscription avec génération de code unique
function registerUser(phone, password, inviteCode) {
    let users = JSON.parse(localStorage.getItem("all_users"));

    if (users.find(u => u.phone === phone)) {
        alert("Ce numéro est déjà utilisé.");
        return false;
    }

    const newUser = {
        phone: phone,
        password: password,
        solde: 0,
        myInviteCode: "DELL" + Math.floor(1000 + Math.random() * 8999),
        referredBy: inviteCode || "DIRECT",
        createdAt: new Date().toLocaleString()
    };

    users.push(newUser);
    localStorage.setItem("all_users", JSON.stringify(users));
    return true;
}

// Connexion
function loginUser(phone, password) {
    let users = JSON.parse(localStorage.getItem("all_users"));
    const user = users.find(u => u.phone === phone && u.password === password);

    if (!user) {
        alert("Identifiants incorrects.");
        return false;
    }

    localStorage.setItem("current_user", JSON.stringify(user));
    return true;
}
