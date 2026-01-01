# FormationsGest – Frontend

Application frontend pour la plateforme de gestion de centres de formation **FormationsGest**.
Ce projet fournit l’interface utilisateur complète : site public, formulaires d’inscription et
dashboards internes pour les différents rôles (Admin, Assistant, Formateur).

---

## 🚀 Stack technique

- **Framework** : React + Vite
- **Routing** : React Router
- **UI & styles** : Tailwind CSS (mode sombre via classe `dark`)
- **HTTP client** : Axios
- **Icônes** : lucide-react
- **Graphiques** : Recharts

Le frontend communique avec l’API REST Node/Express du projet FormationsGest Backend.

---

## ✨ Fonctionnalités principales

- **Site public**
  - Page d’accueil présentant l’offre de formation
  - Catalogue des formations avec filtres (ville, catégorie, type)
  - Page de détail d’une formation (objectifs, programme, durée, tarif, lieu)
  - Formulaire d’inscription à une formation
  - Formulaire de candidature formateur (upload de CV via backend)

- **Espace authentifié**
  - Connexion sécurisée via JWT
  - Gestion fine des rôles : `ADMIN`, `ASSISTANT`, `FORMATEUR`
  - Layout privé avec **Navbar**, **Sidebar** et support du **mode sombre**

- **Dashboards**
  - **Admin** : supervision globale (formations, inscriptions, plannings, utilisateurs)
  - **Assistant** : gestion opérationnelle (inscriptions, entreprises, sessions de formation)
  - **Formateur** : planning personnel, statistiques d’évaluations, prochaines sessions

---

## 🧱 Architecture du projet

Organisation principale du code :

- `src/App.jsx` : définition des routes publiques et protégées
- `src/pages/` : pages de haut niveau (Home, Login, FormationList, FormationDetail, dashboards…)
- `src/components/` : composants réutilisables (Navbar, Sidebar, Modal, UIComponents…)
- `src/context/`
  - `AuthContext` : gestion de l’authentification et du rôle utilisateur
  - `ConfirmContext` : modales de confirmation globales
- `src/services/api.js` : client Axios configuré vers l’API backend (`VITE_API_URL`)

Le mode sombre est activé via la classe `dark` appliquée à la racine de l’application
et géré par un toggle dans la barre de navigation.

---

## ⚙️ Prérequis

- Node.js **>= 18**
- npm ou yarn

---

## 🛠 Installation & démarrage

Cloner le dépôt puis installer les dépendances :

```bash
npm install
```

Lancer le serveur de développement Vite :

```bash
npm run dev
```

Par défaut, l’application est disponible sur `http://localhost:5173`.

---

## 🔑 Configuration des variables d’environnement

Le frontend utilise les variables d’environnement Vite (préfixe `VITE_`).
Créer un fichier `.env` à la racine du projet et définir notamment :

```bash
VITE_API_URL=https://votre-backend-url.com/api
```

- `VITE_API_URL` : URL de base de l’API backend.
  - En développement, vous pouvez utiliser : `http://localhost:5000/api`
  - En production, renseignez l’URL de votre backend déployé.

Exemple complet de `.env` pour le développement :

```bash
VITE_API_URL=http://localhost:5000/api
```

---

## 📜 Scripts NPM

- `npm run dev` : lance le serveur de développement Vite
- `npm run build` : génère le build de production dans le dossier `dist`
- `npm run preview` : lance un serveur local pour prévisualiser le build
- `npm run lint` : exécute ESLint sur le projet

---

## 🔐 Authentification & autorisations

- Authentification par **JWT** : le token est stocké côté client et ajouté automatiquement
  aux requêtes sortantes via Axios.
- `AuthContext` récupère l’utilisateur connecté via `/auth/me` et expose :
  - `user`, `token`, `login`, `logout`, `refreshUser`, `loading`
  - Helpers de rôle : `isAdmin`, `isAssistant`, `isFormateur`
- Les routes protégées sont gérées par le composant `PrivateRoute`, qui vérifie le rôle
  autorisé avant d’afficher la page.

---

## 🚢 Déploiement (exemple Vercel)

1. Pousser le projet sur GitHub (par exemple `formationsgest-frontend`).
2. Sur Vercel :
   - Créer un nouveau projet à partir du repo GitHub.
   - Framework détecté : **Vite**.
   - Build Command : `npm run build`
   - Output Directory : `dist`
3. Dans **Settings → Environment Variables**, définir :
   - `VITE_API_URL` = URL publique de l’API backend (par ex. `https://formationsgest-backend.onrender.com/api`)
4. Lancer un déploiement.

---

## 📄 Licence

Projet propriétaire – usage interne pour la plateforme FormationsGest.
