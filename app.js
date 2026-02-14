/**********************
 INITIALISATION COMPTE
**********************/
if (localStorage.getItem("account_created") !== "yes") {
    localStorage.setItem("solde", "0");
    localStorage.setItem("account_created", "yes");
    localStorage.setItem("recharges", JSON.stringify([]));
    localStorage.setItem("retraits", JSON.stringify([]));
    localStorage.setItem("produits", JSON.stringify([]));
}

/**********************
 OUTILS
**********************/
function getSolde() {
    return parseInt(localStorage.getItem("solde")) || 0;
}

function setSolde(valeur) {
    localStorage.setItem("solde", valeur);
}

function afficherSolde() {
    const el = document.getElementById("solde");
    if (el) el.innerText = getSolde() + " CDF";
}

/**********************
 RECHARGE
**********************/
function recharger() {
    const montant = parseInt(document.getElementById("montant").value);
    if (!montant || montant <= 0) {
        alert("Montant invalide");
        return;
    }

    let solde = getSolde();
    solde += montant;
    setSolde(solde);

    let recharges = JSON.parse(localStorage.getItem("recharges"));
    recharges.push({
        montant,
        date: new Date().toLocaleString()
    });
    localStorage.setItem("recharges", JSON.stringify(recharges));

    alert("Recharge enregistrée");
    window.location.href = "index.html";
}

/**********************
 PRODUITS VIP
**********************/
function acheterVIP(prix, gainJournalier) {
    let solde = getSolde();

    if (solde < prix) {
        alert("Solde insuffisant");
        return;
    }

    solde -= prix;
    setSolde(solde);

    let produits = JSON.parse(localStorage.getItem("produits"));
    produits.push({
        prix,
        gainJournalier,
        date: new Date().toLocaleDateString()
    });
    localStorage.setItem("produits", JSON.stringify(produits));

    alert("Produit acheté avec succès");
    afficherSolde();
}

/**********************
 GÉNÉRATION REVENUS
**********************/
function genererRevenus() {
    let produits = JSON.parse(localStorage.getItem("produits"));
    let solde = getSolde();

    produits.forEach(p => {
        solde += p.gainJournalier;
    });

    setSolde(solde);
}

/**********************
 RETRAIT
**********************/
function retirer() {
    let montant = parseInt(document.getElementById("montant").value);
    let tel = document.getElementById("telephone").value;

    if (!montant || montant <= 0 || tel === "") {
        alert("Champs invalides");
        return;
    }

    let solde = getSolde();
    let frais = Math.floor(montant * 0.15);
    let total = montant + frais;

    if (solde < total) {
        alert("Solde insuffisant");
        return;
    }

    solde -= total;
    setSolde(solde);

    let retraits = JSON.parse(localStorage.getItem("retraits"));
    retraits.push({
        montant,
        frais,
        tel,
        date: new Date().toLocaleString()
    });
    localStorage.setItem("retraits", JSON.stringify(retraits));

    alert("Demande de retrait envoyée");
    window.location.href = "index.html";
}

/**********************
 HISTORIQUES
**********************/
function afficherHistoriques() {
    const el = document.getElementById("historique");
    if (!el) return;

    let html = "<h3>Recharges</h3>";
    JSON.parse(localStorage.getItem("recharges")).forEach(r => {
        html += `<p>${r.montant} CDF - ${r.date}</p>`;
    });

    html += "<h3>Retraits</h3>";
    JSON.parse(localStorage.getItem("retraits")).forEach(r => {
        html += `<p>${r.montant} CDF (${r.frais} frais) - ${r.date}</p>`;
    });

    el.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", afficherSolde);
