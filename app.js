import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, get, child, push } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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
            localStorage.setItem("userPhone", phone);
            return true;
        } else {
            alert("Identifiants incorrects");
            return false;
        }
    } catch (e) { return false; }
};

// --- GESTION DES RECHARGES (CORRIGÉ : MINIMUM 20 000 FC) ---
window.submitRecharge = async function(montant, transactionID) {
    const userPhone = localStorage.getItem("userPhone");
    const MINIMUM_RECHARGE = 20000; // Seuil mis à jour ici

    if (!userPhone) { alert("Session expirée"); return; }

    if (montant < MINIMUM_RECHARGE) {
        alert("⚠️ Erreur : Le dépôt minimum est de 20 000 FC.");
        return false;
    }

    try {
        const newRechargeRef = push(ref(db, 'recharges/'));
        await set(newRechargeRef, {
            utilisateur: userPhone,
            montant: parseInt(montant),
            id_transaction: transactionID,
            statut: "En attente",
            date: new Date().toLocaleString()
        });
        alert("✅ Demande envoyée ! En attente de vérification.");
        return true;
    } catch (e) {
        alert("Erreur lors de l'envoi");
        return false;
    }
};

// --- DÉCONNEXION ---
window.logoutUser = function() {
    localStorage.removeItem("userPhone");
    window.location.href = "login.html";
};
