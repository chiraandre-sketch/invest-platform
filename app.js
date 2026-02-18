<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dépôt - DELL INVEST</title>
    <style>
        :root { --primary: #1a237e; --bg: #f4f7fe; }
        body { margin: 0; font-family: sans-serif; background: var(--bg); display: flex; justify-content: center; }
        .container { width: 100%; max-width: 400px; background: white; min-height: 100vh; padding: 20px; box-sizing: border-box; }
        .header { background: var(--primary); color: white; padding: 20px; text-align: center; border-radius: 0 0 20px 20px; margin: -20px -20px 20px -20px; }
        .box { background: #fff; border: 1px solid #ddd; padding: 15px; border-radius: 12px; margin-top: 20px; }
        input { width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #ccc; border-radius: 8px; box-sizing: border-box; }
        .btn { width: 100%; padding: 15px; background: var(--primary); color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 16px; }
        .btn:disabled { background: #ccc; }
    </style>
</head>
<body>

<div class="container">
    <div class="header">
        <h2>RECHARGE</h2>
        <p>Minimum : 20 000 FC</p>
    </div>

    <div class="box">
        <label>Montant envoyé (FC)</label>
        <input type="number" id="depotAmount" placeholder="Min 20000">
        
        <label>ID de Transaction</label>
        <input type="text" id="transactionId" placeholder="ID du SMS de confirmation">
        
        <button class="btn" id="btnValider">✓ VALIDER LE DÉPÔT</button>
    </div>
</div>

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

    // Liaison directe au bouton par son ID
    document.getElementById("btnValider").addEventListener("click", async () => {
        const amount = document.getElementById("depotAmount").value;
        const tid = document.getElementById("transactionId").value;
        const phone = localStorage.getItem("userPhone");
        const btn = document.getElementById("btnValider");

        if (!phone) {
            alert("❌ Erreur : Vous n'êtes pas connecté !");
            return;
        }

        if (amount < 20000 || !tid) {
            alert("❌ Veuillez entrer au moins 20 000 FC et l'ID de transaction.");
            return;
        }

        btn.disabled = true;
        btn.innerText = "Traitement...";

        try {
            const rechargeRef = ref(db, 'recharges');
            await push(rechargeRef, {
                utilisateur: phone,
                montant: parseInt(amount),
                id_transaction: tid,
                statut: "En attente",
                date: new Date().toLocaleString()
            });
            alert("✅ DEMANDE ENVOYÉE !");
            window.location.href = "profil.html";
        } catch (e) {
            alert("❌ Erreur Firebase : " + e.message);
            btn.disabled = false;
            btn.innerText = "✓ VALIDER LE DÉPÔT";
        }
    });
</script>
</body>
</html>
