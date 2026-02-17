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

// FONCTION D'INSCRIPTION SÉCURISÉE
window.registerUser = async function(phone, password, inviteCode) {
    try {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, `users/${phone}`));
        
        if (snapshot.exists()) {
            alert("Ce numéro est déjà inscrit !");
            return false;
        }

        // Génération du code de parrainage unique pour l'utilisateur
        const myCode = "DELL" + Math.floor(1000 + Math.random() * 9000);
        
        // Envoi des données vers TA console Firebase
        await set(ref(db, 'users/' + phone), {
            phone: phone,
            password: password,
            solde: 0,
            myInviteCode: myCode,
            referredBy: inviteCode || "DIRECT",
            createdAt: new Date().toLocaleString()
        });

        return true;
    } catch (error) {
        console.error("Erreur Firebase:", error);
        return false;
    }
};

// FONCTION DE CONNEXION
window.loginUser = async function(phone, password) {
    try {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, `users/${phone}`));
        if (snapshot.exists() && snapshot.val().password === password) {
            localStorage.setItem("userPhone", phone); // On garde le numéro pour la session
            return true;
        }
        return false;
    } catch (e) { return false; }
};
