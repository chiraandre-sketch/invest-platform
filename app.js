<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recharge - DELL INVEST</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; background: #f4f7f6; margin: 0; display: flex; justify-content: center; }
        .container { width: 100%; max-width: 400px; background: white; min-height: 100vh; padding: 20px; box-sizing: border-box; }
        .header { background: #1a237e; color: white; padding: 20px; text-align: center; border-radius: 0 0 20px 20px; margin: -20px -20px 20px -20px; }
        .input-group { margin-bottom: 20px; }
        label { display: block; margin-bottom: 8px; font-weight: bold; color: #333; }
        input { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 10px; box-sizing: border-box; font-size: 16px; }
        .btn-submit { width: 100%; padding: 15px; background: #1a237e; color: white; border: none; border-radius: 10px; font-size: 16px; font-weight: bold; cursor: pointer; }
        .warning { font-size: 12px; color: #666; margin-top: 5px; }
    </style>
</head>
<body>

<div class="container">
    <div class="header">
        <h2>Recharger mon compte</h2>
        <p>Minimum : 20 000 FC</p>
    </div>

    <div class="input-group">
        <label>Montant (FC)</label>
        <input type="number" id="montant-recharge" placeholder="Ex: 20000">
        <p class="warning">⚠️ Le dépôt minimum est désormais de 20 000 FC.</p>
    </div>

    <div class="input-group">
        <label>ID de Transaction (M-Pesa/Airtel)</label>
        <input type="text" id="transaction-id" placeholder="Copiez l'ID reçu par SMS">
    </div>

    <button class="btn-submit" onclick="handleRecharge()">Valider le dépôt</button>
</div>

<script type="module">
    // --- TON CODE FIREBASE CORRIGÉ ---
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

    window.handleRecharge = async function() {
        const montant = document.getElementById("montant-recharge").value;
        const tid = document.getElementById("transaction-id").value;
        const userPhone = localStorage.getItem("userPhone");
        
        // --- LA VÉRIFICATION CRITIQUE ---
        const MINIMUM = 20000; 

        if (!userPhone) {
            alert("Erreur: Vous devez être connecté.");
            window.location.href = "login.html";
            return;
        }

        if (montant < MINIMUM) {
            alert("❌ Action impossible : Le montant minimum est de 20 000 FC.");
            return; // Bloque l'envoi
        }

        if (!tid) {
            alert("Veuillez saisir l'ID de transaction.");
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
            alert("✅ Demande reçue ! Votre solde sera mis à jour après vérification.");
            window.location.href = "profil.html";
        } catch (e) {
            alert("Erreur de connexion au serveur.");
        }
    };
</script>

</body>
</html>

