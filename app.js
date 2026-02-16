// Configuration Firebase (Utilisation des scripts CDN pour la compatibilité HTML directe)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyA24pBo8mBWiZssPtep--MMBdB7c8_Lu4U",
  authDomain: "dell-invest.firebaseapp.com",
  projectId: "dell-invest",
  storageBucket: "dell-invest.firebasestorage.app",
  messagingSenderId: "807081599583",
  appId: "1:807081599583:web:e00ec3959bc4acdae031ea",
  measurementId: "G-BPW920S27C"
};

// Initialisation
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// --- FONCTION INSCRIPTION ---
window.registerUser = async function(phone, password, inviteCode) {
    try {
        const dbRef = ref(db);
        // On vérifie si l'utilisateur existe déjà
        const snapshot = await get(child(dbRef, `users/${phone}`));
        
        if (snapshot.exists()) {
            alert("Ce numéro est déjà inscrit !");
            return false;
        } else {
            // Création du nouvel utilisateur dans la base de données
            await set(ref(db, 'users/' + phone), {
                phone: phone,
                password: password,
                inviteCode: inviteCode,
                solde: 0, // Nouveau compte = 0 FC
                dateInscription: new Date().toISOString()
            });
            return true;
        }
    } catch (error) {
        console.error(error);
        alert("Erreur de connexion à la base de données.");
        return false;
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
                // On enregistre la session localement
                localStorage.setItem("userConnected", phone);
                return true;
            } else {
                alert("Mot de passe incorrect !");
                return false;
            }
        } else {
            alert("Utilisateur non trouvé !");
            return false;
        }
    } catch (error) {
        console.error(error);
        alert("Erreur de connexion.");
        return false;
    }
};
