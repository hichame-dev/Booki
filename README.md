# Booki 🌟

Plateforme de réservation d'hébergements et d'activités pour des vacances de rêve. 🌴
Projet réalisé dans le cadre de ma formation **CQP Développeur Web**, puis enrichi (JavaScript, données dynamiques, SEO).

## 🔗 Démo en ligne
👉 [Voir le site](https://hichame-dev.github.io/booki/)
> Mets à jour ce lien après le déploiement (voir section « Déploiement »).

## 📸 Aperçu
<!-- Ajoute une capture d'écran dans images/ puis décommente la ligne ci-dessous -->
<!-- ![Aperçu de Booki](./images/apercu.png) -->

## ✅ Fonctionnalités
- **Filtres fonctionnels** (Économique, Familial, Romantique, Nos pépites) qui trient réellement les hébergements.
- **Bouton « Afficher plus »** qui révèle les hébergements supplémentaires.
- **Données dynamiques** : les cartes sont générées en JavaScript à partir d'un fichier `data/booki.json` (séparation données / affichage).
- **Responsive** desktop / tablette / mobile.
- **Accessibilité** : textes pour lecteurs d'écran (`sr-only`), `alt` sur les images, `aria-label`.
- **SEO & partage** : balises `meta description` et Open Graph.

## 🛠️ Technologies
![HTML5](https://img.shields.io/badge/HTML5-%23E34F26.svg?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-%231572B6.svg?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-%23F7DF1E.svg?style=flat&logo=javascript&logoColor=black)

## 📁 Structure
```
Booki/
├── index.html
├── css/style.css
├── js/script.js        # logique : chargement des données, filtres, affichage
├── data/booki.json     # données des hébergements / activités
└── images/
```

## 🖥️ Lancer le projet en local
Le site charge ses données via `fetch`, il faut donc un **serveur local** (l'ouverture directe du fichier `index.html` bloque la requête).

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/hichame-dev/booki.git
   ```
2. Ouvrez le dossier dans VS Code et lancez-le avec l'extension **Live Server**
   (clic droit sur `index.html` → « Open with Live Server »).

## 🚀 Déploiement (GitHub Pages, gratuit)
1. Poussez le code sur la branche `main`.
2. Dépôt GitHub → **Settings** → **Pages** → Source : branche `main`, dossier `/ (root)`.
3. Le site est publié sur `https://hichame-dev.github.io/booki/`.

## ✍️ Auteur
**Hichame Dev**
- [LinkedIn](https://www.linkedin.com/in/hichame-dev/) <!-- remplace par ton vrai lien -->
- [GitHub](https://github.com/hichame-dev)
