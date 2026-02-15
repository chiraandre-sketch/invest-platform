/***********************
 * INITIALISATION
 ***********************/
if (!localStorage.getItem("ALL_USERS")) {
    localStorage.setItem("ALL_USERS", JSON.stringify([]));
}

/***********************
 * UTILISATEUR CONNECTÉ
 ***********************/
function getCurrentUser() {
    return JSON.parse(localStorage.getItem("CURRENT_USER"));
}

function setCurrentUser(user) {
    localStorage.setItem("CURRENT_USER", JSON.stringify(user));
}

function logout() {
    localStorage.removeItem("CURRENT_USER");
    location.href = "login.html";
}

/***********************
 * PROTECTION DES PAGES
 ***********************/
function protectDashboard() {
    if (!getCurrentUser()) {
        location.href = "login.html";
    }
}

/***********************
 * INSCRIPTION
 ***********************/
function registerUser(phone, password, inviteCode) {
    let users = JSON.parse(localStorage.getItem("ALL_USERS"));

    if (users.find(u => u.phone === phone)) {
        alert("Numéro déjà utilisé");
        return false;
    }

    const myCode = "DELL" + Math.floor(1000 + Math.random() * 9000);

    const newUser = {
        phone,
        password,
        myInviteCode: myCode,
        referredBy: inviteCode || "DIRECT",
        invitedCount: 0,
        solde: 0,
        createdAt: new Date().toISOString()
    };

    // Gestion du parrainage
    if (inviteCode) {
        const sponsor = users.find(u => u.myInviteCode === inviteCode);
        if (sponsor) sponsor.invitedCount++;
    }

    users.push(newUser);
    localStorage.setItem("ALL_USERS", JSON.stringify(users));
    setCurrentUser(newUser);

    return true;
}

/***********************
 * CONNEXION
 ***********************/
function loginUser(phone, password) {
    let users = JSON.parse(localStorage.getItem("ALL_USERS"));
    const user = users.find(u => u.phone === phone && u.password === password);

    if (!user) {
        alert("Identifiants incorrects");
        return false;
    }

    setCurrentUser(user);
    return true;
}

/***********************
 * SYNCHRONISATION
 ***********************/
function syncUser(user) {
    let users = JSON.parse(localStorage.getItem("ALL_USERS"));
    const index = users.findIndex(u => u.phone === user.phone);
    if (index !== -1) {
        users[index] = user;
        localStorage.setItem("ALL_USERS", JSON.stringify(users));
        setCurrentUser(user);
    }
}
