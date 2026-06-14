/****************************************************************
 * Booki - script principal
 * - Charge les données depuis data/booki.json
 * - Génère les cartes (hébergements, populaires, activités)
 * - Gère les filtres et le bouton "Afficher plus"
 ****************************************************************/

// Nombre de cartes d'hébergements visibles avant "Afficher plus"
const NB_CARTES_VISIBLES = 6;

// État de l'interface
const etat = {
    hebergements: [],   // toutes les données chargées
    filtreActif: null,  // ex: "economique", ou null = tout afficher
    toutAfficher: false // true quand on a cliqué sur "Afficher plus"
};

/**
 * Construit le HTML des étoiles (4 pleines + 1 vide pour une note de 4/5).
 */
function genererEtoiles(note) {
    let html = "";
    for (let i = 1; i <= 5; i++) {
        const classeVide = i > note ? " neutral-star" : "";
        html += `<i class="fa-solid fa-star${classeVide}"></i>`;
    }
    html += `<span class="sr-only">Note de ${note} sur 5</span>`;
    return html;
}

/**
 * Génère une carte d'hébergement (colonne de gauche).
 */
function creerCarteHebergement(h) {
    return `
        <a href="#" class="card">
            <article>
                <img src="${h.image}" alt="${h.alt}">
                <div class="card-contents">
                    <h3 class="cards-title">${h.nom}</h3>
                    <p class="cards-subtitle">Nuit à partir de ${h.prix}<span class="euro">€</span></p>
                    <div class="card-rating">${genererEtoiles(h.etoiles)}</div>
                </div>
            </article>
        </a>`;
}

/**
 * Génère une carte "populaire" (colonne de droite).
 */
function creerCartePopulaire(h) {
    return `
        <a href="#">
            <article class="card">
                <img src="${h.image}" alt="${h.alt}">
                <div class="card-content">
                    <h3 class="card-title">${h.nom}</h3>
                    <p class="card-subtitle">Nuit à partir de ${h.prix}<span class="euro">€</span></p>
                    <div class="card-rating">${genererEtoiles(h.etoiles)}</div>
                </div>
            </article>
        </a>`;
}

/**
 * Génère une carte d'activité.
 */
function creerCarteActivite(a) {
    return `
        <a href="#" class="card">
            <img src="${a.image}" alt="${a.alt}">
            <h3 class="card-title">${a.nom}</h3>
        </a>`;
}

/**
 * Affiche les hébergements en tenant compte du filtre et de "Afficher plus".
 */
function afficherHebergements() {
    const grille = document.querySelector(".hebergements-grid");

    // Filtrage selon la catégorie active
    let liste = etat.hebergements;
    if (etat.filtreActif) {
        liste = liste.filter(h => h.categories.includes(etat.filtreActif));
    }

    // Limite à 6 cartes tant qu'on n'a pas cliqué sur "Afficher plus"
    const listeVisible = etat.toutAfficher ? liste : liste.slice(0, NB_CARTES_VISIBLES);

    if (listeVisible.length === 0) {
        grille.innerHTML = `<p>Aucun hébergement ne correspond à ce filtre.</p>`;
    } else {
        grille.innerHTML = listeVisible.map(creerCarteHebergement).join("");
    }

    // Cache le bouton "Afficher plus" s'il n'y a rien de plus à montrer
    const bouton = document.querySelector(".btn-show-more");
    if (bouton) {
        const resteACacher = liste.length > NB_CARTES_VISIBLES && !etat.toutAfficher;
        bouton.style.display = resteACacher ? "block" : "none";
    }
}

/**
 * Met à jour l'apparence des boutons de filtre (classe "active").
 */
function majBoutonsFiltre() {
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.filtre === etat.filtreActif);
    });
}

/**
 * Branche les clics sur les boutons de filtre.
 */
function activerFiltres() {
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const filtre = btn.dataset.filtre;
            // Re-cliquer sur le filtre actif le désactive (retour à "tout")
            etat.filtreActif = etat.filtreActif === filtre ? null : filtre;
            etat.toutAfficher = false; // on repart de 6 cartes
            majBoutonsFiltre();
            afficherHebergements();
        });
    });
}

/**
 * Branche le bouton "Afficher plus".
 */
function activerAfficherPlus() {
    const bouton = document.querySelector(".btn-show-more");
    if (!bouton) return;
    bouton.addEventListener("click", (e) => {
        e.preventDefault();
        etat.toutAfficher = true;
        afficherHebergements();
    });
}

/**
 * Gère le bouton de thème clair / sombre (avec mémorisation).
 */
function initTheme() {
    const racine = document.documentElement;
    const bouton = document.getElementById("theme-toggle");
    if (!bouton) return;
    const icone = bouton.querySelector("i");

    function appliquer(theme) {
        racine.setAttribute("data-theme", theme);
        const sombre = theme === "dark";
        icone.className = sombre ? "fa-solid fa-sun" : "fa-solid fa-moon";
        bouton.setAttribute(
            "aria-label",
            sombre ? "Activer le thème clair" : "Activer le thème sombre"
        );
    }

    // Le thème initial a déjà été posé par le script du <head> ; on s'aligne dessus.
    appliquer(racine.getAttribute("data-theme") === "dark" ? "dark" : "light");

    bouton.addEventListener("click", () => {
        const nouveau =
            racine.getAttribute("data-theme") === "dark" ? "light" : "dark";
        appliquer(nouveau);
        localStorage.setItem("booki-theme", nouveau);
    });
}

/**
 * Fait apparaître les sections progressivement au défilement.
 */
function initRevealAuScroll() {
    const reduitMouvement = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const blocs = document.querySelectorAll(
        ".search-section, .filters, .info-container, .hebergements-and-populaires, .activites-title-container, .activites, .footer"
    );

    // Si l'animation n'est pas souhaitée, on affiche tout directement.
    if (reduitMouvement || !("IntersectionObserver" in window)) return;

    const observateur = new IntersectionObserver(
        (entrees, obs) => {
            entrees.forEach((entree) => {
                if (entree.isIntersecting) {
                    entree.target.classList.add("visible");
                    obs.unobserve(entree.target);
                }
            });
        },
        { threshold: 0.1 }
    );

    blocs.forEach((bloc) => {
        bloc.classList.add("reveal");
        observateur.observe(bloc);
    });
}

/**
 * Point d'entrée : charge les données puis construit la page.
 */
async function init() {
    try {
        const reponse = await fetch("./data/booki.json");
        if (!reponse.ok) throw new Error(`HTTP ${reponse.status}`);
        const data = await reponse.json();

        etat.hebergements = data.hebergements;

        // Affichage initial
        afficherHebergements();
        document.querySelector(".populaires-cards").innerHTML =
            data.populaires.map(creerCartePopulaire).join("");
        document.querySelector(".activites-grid").innerHTML =
            data.activites.map(creerCarteActivite).join("");

        // Interactivité
        activerFiltres();
        activerAfficherPlus();
    } catch (err) {
        console.error("Impossible de charger les données :", err);
        document.querySelector(".hebergements-grid").innerHTML =
            `<p>Erreur de chargement des données. Lancez le site via un serveur local (Live Server).</p>`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initTheme();          // doit marcher même si le chargement des données échoue
    initRevealAuScroll();
    init();
});
