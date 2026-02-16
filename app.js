// Importation des modules Firebase via CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Ta configuration officielle
const firebaseConfig = {
  apiKey: "AIzaSyA24pBo8mBWiZssPtep--MMBdB7c8_Lu4U",
  authDomain: "dell-invest.firebaseapp.com",
  projectId: "dell-invest",
  storageBucket: "dell-invest.firebasestorage.app",
  messagingSenderId: "807081599583",
  appId: "1:807081599583:web:e00ec3959bc4acdae031ea",
  measurementId: "G-BPW920S27C"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// --- FONCTION D'INSCRIPTION ---
window.registerUser = async function(phone, password, inviteCode) {
    try {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, `users/${phone}`));
        
        if (snapshot.exists()) {
            alert("❌ Ce numéro est déjà enregistré !");
            return false;
        } else {
            // On enregistre l'utilisateur avec un solde de 0 FC par défaut
            await set(ref(db, 'users/' + phone), {
                phone: phone,
                password: password,
                inviteCode: inviteCode || "Aucun",
                solde: 0,
                date: new Date().toLocaleDateString()
            });
            return true;
        }
    } catch (error) {
        console.error(error);
        alert("Erreur de base de données. Vérifiez votre connexion.");
        return false;
    }
};

// --- FONCTION DE CONNEXION ---
window.loginUser = async function(phone, password) {
    try {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, `users/${phone}`));

        if (snapshot.exists()) {
            const user = snapshot.val();
            if (user.password === password) {
                // On garde le numéro en mémoire pour la session
                localStorage.setItem("userPhone", phone);
                return true;
            } else {
                alert("❌ Mot de passe incorrect.");
                return false;
            }
        } else {
            alert("❌ Compte inexistant.");
            return false;
        }
    } catch (error) {
        alert("Erreur lors de la connexion.");
        return false;
    }
};
