<script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
    import { getDatabase, ref, onValue, set, push, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

    // Ta configuration Firebase
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

    // 1. AFFICHER LE SOLDE EN TEMPS RÉEL
    if (userPhone) {
        const soldeRef = ref(db, 'users/' + userPhone + '/solde');
        onValue(soldeRef, (snapshot) => {
            const soldeData = snapshot.val() || 0;
            document.getElementById("solde").innerText = soldeData + " FC";
        });
    } else {
        window.location.href = "login.html"; // Redirige si pas connecté
    }

    // 2. FONCTION ACHETER
    window.acheterVIP = async function(prix, nomProduit) {
        if (!userPhone) return;

        const userRef = ref(db, 'users/' + userPhone);
        
        try {
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
                let soldeActuel = snapshot.val().solde || 0;

                if (soldeActuel >= prix) {
                    let nouveauSolde = soldeActuel - prix;

                    // Mettre à jour le solde dans Firebase
                    await set(ref(db, 'users/' + userPhone + '/solde'), nouveauSolde);

                    // Enregistrer l'achat pour que l'ADMIN le voie
                    const achatRef = ref(db, 'achats/' + userPhone);
                    const nouvelAchat = push(achatRef);
                    await set(nouvelAchat, {
                        produit: nomProduit,
                        prix: prix,
                        date: new Date().toLocaleString()
                    });

                    alert("✅ Achat réussi de " + nomProduit + " !");
                } else {
                    alert("❌ Solde insuffisant. Rechargez votre compte.");
                }
            }
        } catch (error) {
            console.error(error);
            alert("Erreur lors de l'achat.");
        }
    };
</script>
