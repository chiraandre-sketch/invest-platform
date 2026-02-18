<script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
    import { getDatabase, ref, onValue, set, get, push } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

    // Configuration identique à ton app.js
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
    const userPhone = localStorage.getItem("userPhone");

    // Vérification de connexion
    if (!userPhone) {
        window.location.href = "login.html";
    }

    // --- AFFICHER LE SOLDE EN TEMPS RÉEL ---
    const soldeRef = ref(db, 'users/' + userPhone + '/solde');
    onValue(soldeRef, (snapshot) => {
        const montant = snapshot.val() || 0;
        document.getElementById("solde").innerText = montant + " FC";
    });

    // --- FONCTION ACHETER ---
    window.acheterVIP = async function(prix, nomVIP) {
        const userRef = ref(db, 'users/' + userPhone);
        
        try {
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
                const userData = snapshot.val();
                let soldeActuel = userData.solde || 0;

                if (soldeActuel >= prix) {
                    let nouveauSolde = soldeActuel - prix;

                    // 1. Déduire l'argent du solde
                    await set(ref(db, 'users/' + userPhone + '/solde'), nouveauSolde);

                    // 2. Enregistrer l'achat pour l'ADMIN (Toi)
                    // Cela crée un dossier "achats" dans ta base de données
                    const achatRef = ref(db, 'achats/' + userPhone);
                    await push(achatRef, {
                        produit: nomVIP,
                        prixAchat: prix,
                        date: new Date().toLocaleString()
                    });

                    alert("✅ Achat réussi : " + nomVIP);
                } else {
                    alert("❌ Solde insuffisant !");
                }
            }
        } catch (error) {
            console.error(error);
            alert("Erreur de connexion à la base de données.");
        }
    };
</script>
