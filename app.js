/*************************
 * INITIALISATION
 *************************/
if (!localStorage.getItem("all_users")) {
    localStorage.setItem("all_users", JSON.stringify([]));
}

/*************************
 * SESSION
 *************************/
function getCurrentUser() {
    return JSON.parse(localStorage.getItem("current_user"));
}

function setCurrentUser(user) {
    localStorage.setItem("current_user", JSON.stringify(user));
}

function logout() {
    localStorage.removeItem("current_user");
    location.href = "login.html";
}

function protectPage() {
    if (!getCurrentUser()) {
        location.href = "login.html";
    }
}

/*************************
 * INSCRIPTION
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
        createdAt: new Date().toLocaleString()
    };

    users.push(newUser);
    localStorage.setItem("all_users", JSON.stringify(users));
    return true;
}

/*************************
 * CONNEXION
 *************************/
function loginUser(phone, password) {
    let users = JSON.parse(localStorage.getItem("all_users"));
    const user = users.find(
        u => u.phone === phone && u.password === password
    );

    if (!user) {
        alert("Numéro ou mot de passe incorrect");
        return false;
    }

    setCurrentUser(user);
    return true;
}
