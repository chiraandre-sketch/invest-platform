// ================= INITIALISATION =================
if (!localStorage.getItem("all_users")) {
    localStorage.setItem("all_users", JSON.stringify([]));
}

// ================= UTILS =================
function getAllUsers() {
    return JSON.parse(localStorage.getItem("all_users"));
}

function saveAllUsers(users) {
    localStorage.setItem("all_users", JSON.stringify(users));
}

function getUser() {
    return JSON.parse(localStorage.getItem("user"));
}

function setUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
}

function generateInviteCode() {
    return "DELL" + Math.floor(1000 + Math.random() * 9000);
}

// ================= INSCRIPTION =================
function registerUser(phone, password, inviteCode) {
    let users = getAllUsers();

    if (users.find(u => u.phone === phone)) {
        alert("Numéro déjà utilisé");
        return false;
    }

    const myCode = generateInviteCode();

    const newUser = {
        phone: phone,
        password: password,
        myInviteCode: myCode,
        referredBy: inviteCode || "DIRECT",
        invitedCount: 0,
        solde: 0,
        date: new Date().toLocaleDateString()
    };

    // Parrainage
    if (inviteCode) {
        const parent = users.find(u => u.myInviteCode === inviteCode);
        if (parent) parent.invitedCount += 1;
    }

    users.push(newUser);
    saveAllUsers(users);
    setUser(newUser); // connexion automatique

    return true;
}

// ================= CONNEXION =================
function loginUser(phone, password) {
    let users = getAllUsers();
    const user = users.find(u => u.phone === phone && u.password === password);

    if (!user) return false;

    setUser(user);
    return true;
}

// ================= PROTECTION =================
function protectDashboard() {
    if (!getUser()) {
        window.location.href = "login.html";
    }
}
