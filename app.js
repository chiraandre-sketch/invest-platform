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

// --- FONCTION INSCRIPTION ---
window.registerUser = async function(phone, password, inviteCode) {
    try {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, `users/${phone}`));
        
        if (snapshot.exists()) {
            return { success: false, msg: "Ce numéro est déjà utilisé." };
        }

        // Génération du code unique pour ce nouvel utilisateur
        const myPersonalCode = "DELL" + Math.floor(1000 + Math.random() * 8999);
        
        // Enregistrement dans Firebase
        await set(ref(db, 'users/' + phone), {
            phone: phone,
            password: password,
            solde: 0, // Tu pourras changer ça à distance
            invite: myPersonalCode, // Son code à lui
            referredBy: inviteCode || "DIRECT", // Qui l'a invité
            createdAt: new Date().toLocaleString(),
            statut: "Membre"
        });

        return { success: true };
    } catch (error) {
        return { success: false, msg: "Erreur de connexion à la base." };
    }
};

// --- FONCTION CONNEXION ---
window.loginUser = async function(phone, password) {
    try {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, `users/${phone}`));
        
        if (snapshot.exists()) {
            const userData = snapshot.val();
            if (userData.password === password) {
                localStorage.setItem("userPhone", phone);
                return true;
            }
        }
        return false;
    } catch (error) {
        return false;
    }
};
