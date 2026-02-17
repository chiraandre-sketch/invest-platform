import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyA24pBo8mBWiZssPtep--MMBdB7c8_Lu4U",
    authDomain: "dell-invest.firebaseapp.com",
    projectId: "dell-invest",
    storageBucket: "dell-invest.firebasestorage.app",
    messagingSenderId: "807081599583",
    appId: "1:807081599583:web:e00ec3959bc4acdae031ea"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// --- INSCRIPTION ---
window.registerUser = async function(phone, password, inviteCode) {
    try {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, `users/${phone}`));
        if (snapshot.exists()) { alert("Numéro déjà inscrit !"); return false; }

        const myCode = "DELL" + Math.floor(1000 + Math.random() * 9000);
        await set(ref(db, 'users/' + phone), {
            phone: phone,
            password: password,
            solde: 0,
            invite: myCode,
            referredBy: inviteCode || "DIRECT",
            createdAt: new Date().toLocaleString()
        });
        return true;
    } catch (e) { return false; }
};

// --- CONNEXION ---
window.loginUser = async function(phone, password) {
    try {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, `users/${phone}`));
        if (snapshot.exists() && snapshot.val().password === password) {
            // ON FIXE LE NOM DE LA CLÉ ICI : userPhone
            localStorage.setItem("userPhone", phone);
            return true;
        } else {
            alert("Identifiants incorrects");
            return false;
        }
    } catch (e) { return false; }
};

// --- DÉCONNEXION ---
window.logoutUser = function() {
    localStorage.removeItem("userPhone");
    window.location.href = "login.html";
};
