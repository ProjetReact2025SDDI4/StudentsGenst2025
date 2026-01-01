# FormationsGest – Backend API

API RESTful pour la plateforme de gestion de centres de formation **FormationsGest**.
Ce service backend expose toutes les fonctionnalités métier : gestion des formations,
plannings, inscriptions, candidatures formateurs, entreprises, utilisateurs et évaluations.

---

## 🏗 Stack technique

- **Runtime** : Node.js
- **Framework** : Express.js
- **Base de données** : MongoDB Atlas via Mongoose
- **Authentification** : JWT + Bcrypt pour le hachage de mots de passe
- **Stockage de fichiers** : Cloudinary (CV, images)
- **Emails** : Nodemailer / Resend pour les notifications
- **Validation** : express-validator
- **Sécurité** : CORS, middlewares d’authentification & rôles

Le backend est conçu pour être consommé par le frontend React/Vite FormationsGest.

---

## ✨ Fonctionnalités métier

- **Authentification & Utilisateurs**
  - Création et gestion des comptes utilisateurs (Admin, Assistant, Formateur)
  - Authentification JWT (`/api/auth/login`)
  - Récupération du profil connecté (`/api/auth/me`)

- **Formations**
  - Création, édition, suppression de formations
  - Consultation du catalogue public (`/api/formations`)
  - Récupération des catégories et villes disponibles

- **Candidatures formateurs**
  - Soumission de candidature avec upload de CV (`/api/candidatures`)
  - Validation / rejet par l’Admin
  - Création automatique d’un compte utilisateur et d’un profil formateur lors de l’acceptation

- **Plannings & sessions de formation**
  - Création de plannings en liant formation, formateur, entreprise
  - Vérification automatique des conflits de planning (formateur déjà occupé sur les dates)

- **Inscriptions apprenants**
  - Gestion des inscriptions individuelles ou entreprises
  - Suivi du statut : en attente, confirmée, terminée, annulée

- **Entreprises partenaires**
  - Gestion des fiches entreprises (coordonnées, secteur, contacts)

- **Évaluations**
  - Enregistrement des évaluations stagiaires
  - Statistiques par formateur et par formation

Toutes les routes sensibles sont protégées par des middlewares d’authentification et de rôle.

---

## 📁 Structure du projet

```text
backend/
  ├─ src/
  │   ├─ app.js              # Point d'entrée Express
  │   ├─ config/             # Connexion MongoDB, config Cloudinary, etc.
  │   ├─ models/             # Schémas Mongoose
  │   ├─ controllers/        # Logique métier
  │   ├─ routes/             # Routes API (auth, formations, plannings...)
  │   ├─ middlewares/        # Auth, rôles, upload, validations
  │   └─ utils/              # Fonctions utilitaires éventuelles
  ├─ package.json
  └─ README.md
```

Le fichier `src/app.js` instancie l’application Express, configure CORS,
les middlewares globaux et monte les différentes routes sous `/api/...`.

---

## 🔗 Endpoints principaux (exemples)

| Méthode | Route                          | Rôle             | Description                               |
| ------: | ------------------------------ | ---------------- | ----------------------------------------- |
| POST    | `/api/auth/login`             | Public           | Authentification                          |
| GET     | `/api/auth/me`                | Authentifié      | Profil de l’utilisateur connecté          |
| GET     | `/api/formations`             | Public           | Catalogue des formations                  |
| POST    | `/api/candidatures`           | Public           | Soumission de candidature formateur       |
| PUT     | `/api/candidatures/:id/accept`| Admin            | Acceptation d’une candidature             |
| POST    | `/api/plannings`              | Admin/Assistant  | Création d’une session de formation       |
| GET     | `/api/inscriptions`           | Admin/Assistant  | Liste des inscriptions                    |
| POST    | `/api/entreprises`            | Admin/Assistant  | Création d’une entreprise partenaire      |
| GET     | `/api/evaluations`            | Admin/Formateur  | Liste/statistiques d’évaluations          |

Les routes sont organisées par ressource dans le dossier `src/routes`.

---

## ⚙️ Prérequis

- Node.js **>= 18**
- Accès à une base de données **MongoDB** (MongoDB Atlas recommandé)
- Compte **Cloudinary** pour le stockage des fichiers
- Clé API pour l’envoi d’emails (Resend ou autre provider)

---

## 🛠 Installation & lancement en local

1. Cloner le dépôt backend :

```bash
git clone https://github.com/votre-compte/formationsgest-backend.git
cd formationsgest-backend/backend
```

2. Installer les dépendances :

```bash
npm install
```

3. Créer un fichier `.env` à la racine du dossier `backend` (voir section ci‑dessous).

4. Lancer en mode développement (rechargement automatique) :

```bash
npm run dev
```

5. L’API sera disponible par défaut sur `http://localhost:5000/api`.

Pour un lancement en mode production :

```bash
npm start
```

---

## 🔑 Variables d’environnement

Le backend s’appuie sur un fichier `.env` (non commité) pour sa configuration.

Variables usuelles :

- `PORT` : port HTTP (par défaut `5000` si absent)
- `MONGODB_URI` : URI de connexion MongoDB
- `JWT_SECRET` : clé secrète pour signer les tokens JWT
- `CLOUDINARY_CLOUD_NAME` : nom de cloud Cloudinary
- `CLOUDINARY_API_KEY` : clé API Cloudinary
- `CLOUDINARY_API_SECRET` : secret Cloudinary
- `RESEND_API_KEY` ou paramètres SMTP : envoi d’emails
- `CORS_ORIGIN` : liste d’origines autorisées (séparées par des virgules)

Exemple de fichier `.env` :

```bash
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/formationsgest
JWT_SECRET=une_chaine_secrete_longue_et_complexe

CLOUDINARY_CLOUD_NAME=formationsgest
CLOUDINARY_API_KEY=xxxxxxxxxxxxxxxxxxxx
CLOUDINARY_API_SECRET=xxxxxxxxxxxxxxxxxxxx

RESEND_API_KEY=xxxxxxxxxxxxxxxxxxxx

CORS_ORIGIN=http://localhost:5173,https://formationsgest-frontend.vercel.app
```

Assurez‑vous que l’URL du frontend (développement et production) est bien présente dans `CORS_ORIGIN`.

---

## 🚢 Déploiement

Le backend peut être déployé sur n’importe quelle plateforme compatible Node.js
(Render, Railway, Koyeb, VPS, etc.). Exemple de checklist générale :

1. Pousser le code sur un dépôt Git distant (GitHub, GitLab…).  
2. Créer un nouveau service Node.js sur la plateforme choisie.
3. Configurer :
   - Commande d’installation : `npm install`
   - Commande de démarrage : `npm start`
   - Version de Node : >= 18
4. Renseigner toutes les variables d’environnement (`MONGODB_URI`, `JWT_SECRET`, Cloudinary, email, `CORS_ORIGIN`…).
5. Déployer puis récupérer l’URL publique, par ex. :  
   `https://formationsgest-backend.onrender.com`
6. Côté frontend, configurer `VITE_API_URL` sur `https://formationsgest-backend.onrender.com/api`.

---

## 🔐 Sécurité

- Toutes les routes sensibles sont protégées par un middleware d’authentification JWT.
- Les autorisations sont gérées par un middleware de rôle (Admin, Assistant, Formateur).
- Les données en entrée sont validées via **express-validator** pour limiter les injections
  et les données invalides.
- Les mots de passe sont hachés avec **bcrypt**.

---

## 📄 Licence

Projet propriétaire – usage interne pour la plateforme FormationsGest.

