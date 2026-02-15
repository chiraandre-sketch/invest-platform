// Initialisation
if (!localStorage.getItem("all_users")) {
    localStorage.setItem("all_users", JSON.stringify([]));
}

function getUser() {
    return JSON.parse(localStorage.getItem("user"));
}

function registerUser(phone, password, inviteCode) {
    let allUsers = JSON.parse(localStorage.getItem("all_users"));
    
    const newUser = {
        phone: phone,
        password: password,
        referredBy: inviteCode || "DIRECT",
        myInviteCode: "DELL" + Math.floor(1000 + Math.random() * 9000),
        solde: 0,
        gainQuotidien: 0,
        transactions: [],
        date: new Date().toLocaleDateString()
    };

    allUsers.push(newUser);
    localStorage.setItem("all_users", JSON.stringify(allUsers));
    localStorage.setItem("user", JSON.stringify(newUser));
    return true;
}
