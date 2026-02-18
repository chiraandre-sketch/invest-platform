<script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
    import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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
    
    // ÉTAPE 1 : On vérifie si le bouton est trouvé
    const btn = document.getElementById("btnValider");
    if(!btn) { alert("ERREUR : Le bouton btnValider n'existe pas dans le HTML !"); }

    btn.addEventListener("click", async () => {
        alert("ÉTAPE 2 : Clic détecté !");
        
        const montant = document.getElementById("depotAmount").value;
        const tid = document.getElementById("transactionId").value;
        const phone = localStorage.getItem("userPhone");

        if (!phone) { alert("ÉTAPE 3 : Erreur - Pas de numéro trouvé (Connectez-vous)"); return; }

        if (montant < 20000) { alert("ÉTAPE 4 : Montant trop bas (Min 20000)"); return; }

        try {
            alert("ÉTAPE 5 : Envoi vers Firebase...");
            const rechargeRef = ref(db, 'recharges');
            await push(rechargeRef, {
                utilisateur: phone,
                montant: parseInt(montant),
                id_transaction: tid,
                statut: "En attente",
                date: new Date().toLocaleString()
            });
            alert("✅ SUCCÈS TOTAL !");
            window.location.href = "profil.html";
        } catch (e) {
            alert("❌ ERREUR FIREBASE : " + e.message);
        }
    });
</script>
