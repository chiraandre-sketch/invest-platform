<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dépôt - DELL INVEST</title>
    <style>
        :root {
            --primary-color: #1a237e;
            --bg-color: #f4f7fe;
            --text-grey: #64748b;
        }

        body { margin: 0; font-family: 'Segoe UI', sans-serif; background-color: var(--bg-color); color: #333; padding-bottom: 50px; }

        .header { background: linear-gradient(135deg, #1a237e, #0d47a1); color: white; padding: 20px; display: flex; justify-content: space-between; align-items: center; border-radius: 0 0 20px 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }

        .container { padding: 20px; max-width: 450px; margin: auto; }

        .network-selector { display: flex; justify-content: space-between; gap: 10px; margin-bottom: 25px; }

        .network-card { flex: 1; background: white; border: 2px solid transparent; border-radius: 12px; padding: 10px; text-align: center; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.05); transition: 0.3s; font-size: 0.8rem; }

        .network-card.active { border-color: var(--primary-color); background: #e8eaf6; }

        .payment-box { background: white; border-radius: 15px; padding: 20px; margin-bottom: 25px; border: 1px dashed #cbd5e1; text-align: center; }

        .phone-display { display: flex; justify-content: space-between; align-items: center; background: #f8fafc; padding: 15px; border-radius: 10px; font-weight: bold; font-size: 1.2rem; color: var(--primary-color); margin-top: 10px; border: 1px solid #eee; }

        .copy-btn { color: #22c55e; font-size: 0.8rem; cursor: pointer; border: 1px solid #22c55e; background: none; font-weight: bold; padding: 5px 10px; border-radius: 5px; }

        input { width: 100%; padding: 14px; border-radius: 10px; border: 1px solid #ddd; box-sizing: border-box; background: white; margin-bottom: 15px; font-size: 1rem; }

        .btn-submit { width: 100%; padding: 16px; background-color: var(--primary-color); color: white; border: none; border-radius: 12px; font-size: 1rem; font-weight: bold; cursor: pointer; transition: 0.3s; }
        .btn-submit:disabled { background-color: #ccc; cursor: not-allowed; }

        .instructions { background: #fff; border-left: 4px solid var(--primary-color); border-radius: 8px; padding: 15px; margin-top: 25px; font-size: 0.85rem; line-height: 1.6; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
    </style>
</head>
<body>

<div class="header">
    <div style="font-weight:bold;">💎 DELL INVEST</div>
    <div style="text-align:right;">
        <small>Mon Solde</small><br>
        <b id="userBalance">Chargement...</b>
    </div>
</div>

<div class="container">
    <a href="profil.html" style="text-decoration:none; color: var(--primary-color); font-size: 0.9rem; font-weight: bold;">⬅ Retour au profil</a>
    <h3 style="margin-top:15px;">Faire un dépôt</h3>
    
    <p style="font-size: 0.9rem; color: var(--text-grey);">1. Choisissez votre réseau :</p>
    <div class="network-selector">
        <div class="network-card active" onclick="setNetwork('Airtel', '0975617195', 'Namwezi Sifa', this)"><b>Airtel Money</b></div>
        <div class="network-card" onclick="setNetwork('Orange', '08XXXXXXXX', 'Agent Orange', this)"><b>Orange Money</b></div>
        <div class="network-card" onclick="setNetwork('M-Pesa', '08XXXXXXXX', 'Agent M-Pesa', this)"><b>M-Pesa</b></div>
    </div>

    <div class="payment-box">
        <span style="font-size: 0.8rem; color: var(--text-grey);">Envoyez l'argent au numéro <b id="netName">Airtel</b> suivant :</span>
        <div class="phone-display">
            <span id="payNumber">0975617195</span>
            <button class="copy-btn" onclick="copyNum()">📋 Copier</button>
        </div>
        <p id="agentName" style="font-size: 0.8rem; font-weight: bold; color: #333; margin-top: 10px;">Titulaire : Namwezi Sifa</p>
    </div>

    <p style="font-size: 0.9rem; color: var(--text-grey);">2. Détails du transfert :</p>
    <input type="number" id="depotAmount" placeholder="Montant envoyé (Min: 20000 FC)">
    <input type="text" id="transactionId" placeholder="ID de transaction reçu par SMS">

    <button class="btn-submit" id="btnValider">✓ Valider mon dépôt</button>

    <div class="instructions">
        <b>💡 Rappel :</b><br>
        • Minimum de dépôt : <b>20 000 FC</b><br>
        • Validation : Entre 5 min et 1 heure.<br>
        • En cas de souci, contactez le support.
    </div>
</div>

<script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
    import { getDatabase, ref, set, push, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

    // Redirection si non connecté
    if(!userPhone) {
        window.location.href = "login.html";
    } else {
        // Afficher le solde actuel
        onValue(ref(db, `users/${userPhone}`), (snap) => {
            if(snap.exists()) {
                document.getElementById("userBalance").innerText = (snap.val().solde || 0) + " FC";
            } else {
                document.getElementById("userBalance").innerText = "0 FC";
            }
        });
    }

    // Gestion du clic sur le bouton Valider
    document.getElementById("btnValider").addEventListener("click", async () => {
        const btn = document.getElementById("btnValider");
        const amount = parseInt(document.getElementById("depotAmount").value);
        const tid = document.getElementById("transactionId").value.trim();
        const MIN_DEPOT = 20000;

        if (isNaN(amount) || amount < MIN_DEPOT) {
            alert("❌ Erreur : Le montant minimum est de 20 000 FC.");
            return;
        }

        if (tid.length < 5) {
            alert("❌ Veuillez entrer un ID de transaction valide.");
            return;
        }

        // Désactivation du bouton pour éviter les envois multiples
        btn.disabled = true;
        btn.innerText = "Envoi en cours...";

        try {
            const rechargeRef = ref(db, 'recharges');
            const newRecharge = push(rechargeRef);
            await set(newRecharge, {
                utilisateur: userPhone,
                montant: amount,
                id_transaction: tid,
                date: new Date().toLocaleString(),
                statut: "En attente"
            });
            
            alert("✅ Demande envoyée avec succès ! Votre solde sera crédité après vérification.");
            window.location.href = "profil.html";
            
        } catch (error) {
            console.error(error);
            alert("❌ Erreur lors de l'envoi : " + error.message);
            btn.disabled = false;
            btn.innerText = "✓ Valider mon dépôt";
        }
    });
</script>

<script>
    // Fonctions pour l'interface (hors Firebase)
    function setNetwork(name, number, agent, element) {
        document.querySelectorAll('.network-card').forEach(c => c.classList.remove('active'));
        element.classList.add('active');
        document.getElementById('payNumber').innerText = number;
        document.getElementById('netName').innerText = name;
        document.getElementById('agentName').innerText = "Titulaire : " + agent;
    }

    function copyNum() {
        const num = document.getElementById('payNumber').innerText;
        navigator.clipboard.writeText(num).then(() => {
            alert("Numéro copié : " + num);
        }).catch(err => {
            alert("Erreur lors de la copie");
        });
    }
</script>

</body>
</html>
