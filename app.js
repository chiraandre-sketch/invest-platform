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

// --- FONCTION D'INSCRIPTION ---
window.registerUser = async function(phone, password, inviteCode) {
    try {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, `users/${phone}`));
        
        if (snapshot.exists()) {
            alert("Ce numéro est déjà inscrit !");
            return false;
        }

        // Génération d'un code unique pour l'utilisateur
        const myCode = "DELL" + Math.floor(1000 + Math.random() * 9000);
        
        // Envoi à Firebase
        await set(ref(db, 'users/' + phone), {
            phone: phone,
            password: password,
            solde: 0,
            invite: myCode,
            referredBy: inviteCode || "DIRECT",
            createdAt: new Date().toLocaleString(),
            statut: "Membre"
        });

        return true;
    } catch (error) {
        console.error("Erreur Firebase:", error);
        alert("Erreur de connexion : " + error.message);
        return false;
    }
};

// --- FONCTION DE CONNEXION ---
window.loginUser = async function(phone, password) {
    try {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, `users/${phone}`));
        
        if (snapshot.exists()) {
            const userData = snapshot.val();
            if (userData.password === password) {
                // IMPORTANT : On enregistre le numéro pour les autres pages
                localStorage.setItem("userPhone", phone); 
                return true;
            } else {
                alert("Mot de passe incorrect");
                return false;
            }
        } else {
            alert("Ce numéro n'existe pas");
            return false;
        }
    } catch (e) { 
        console.error(e);
        return false; 
    }
};

// --- FONCTION DE DÉCONNEXION ---
window.logout = function() {
    localStorage.removeItem("userPhone");
    window.location.href = "login.html";
};
