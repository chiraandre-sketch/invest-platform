<script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
    import { getDatabase, ref, set, push } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

    // C'est cette fonction que tu as modifiée
    window.handleRecharge = async function() {
        const montant = document.getElementById("montant-recharge").value;
        const tid = document.getElementById("transaction-id").value;
        const userPhone = localStorage.getItem("userPhone");
        
        // Voici le changement de 25000 vers 20000
        const MINIMUM = 20000; 

        if (!userPhone) {
            alert("Erreur: Connectez-vous d'abord");
            return;
        }

        // Vérification du montant
        if (montant < MINIMUM) {
            alert("Le montant minimum est de 20 000 FC.");
            return; 
        }

        if (!tid) {
            alert("Entrez l'ID de transaction");
            return;
        }

        try {
            const newRef = push(ref(db, 'recharges/'));
            await set(newRef, {
                utilisateur: userPhone,
                montant: parseInt(montant),
                id_transaction: tid,
                statut: "En attente",
                date: new Date().toLocaleString()
            });
            alert("✅ Demande envoyée !");
            window.location.href = "profil.html";
        } catch (e) {
            alert("Erreur de connexion : " + e.message);
        }
    };
</script>
