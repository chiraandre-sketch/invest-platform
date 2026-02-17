// Importation des modules Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, get, child, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// TA CONFIGURATION FIREBASE (Garde celle-ci, elle est liée à ton projet)
const firebaseConfig = {
    apiKey: "AIzaSyA24pBo8mBWiZssPtep--MMBdB7c8_Lu4U",
    authDomain: "dell-invest.firebaseapp.com",
    projectId: "dell-invest",
    storageBucket: "dell-invest.firebasestorage.app",
    messagingSenderId: "807081599583",
    appId: "1:807081599583:web:e00ec3959bc4acdae031ea"
};

// Initialisation
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// --- FONCTIONS GLOBALES (Accessibles par tes fichiers HTML) ---

// 1. INSCRIPTION (Envoie vers Firebase)
window.registerUser = async function(phone, password, inviteCode) {
    try {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, `users/${phone}`));
        
        if (snapshot.exists()) {
            alert("Ce numéro est déjà utilisé.");
            return false;
        }

        const myInviteCode = "DELL" + Math.floor(1000 + Math.random() * 8999);
        
        // On crée l'utilisateur dans le cloud
        await set(ref(db, 'users/' + phone), {
            phone: phone,
            password: password,
            solde: 0,
            invite: myInviteCode,
            referredBy: inviteCode || "DIRECT",
            createdAt: new Date().toLocaleString(),
            statut: "Membre"
        });

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

// 2. CONNEXION (Vérifie dans Firebase)
window.loginUser = async function(phone, password) {
    try {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, `users/${phone}`));
        
        if (snapshot.exists()) {
            const userData = snapshot.val();
            if (userData.password === password) {
                // On garde juste le numéro en local pour la session
                localStorage.setItem("userPhone", phone);
                return true;
            }
        }
        return false;
    } catch (error) {
        return false;
    }
};

// 3. DÉCONNEXION
window.logout = function() {
    localStorage.removeItem("userPhone");
    window.location.href = "login.html";
};
