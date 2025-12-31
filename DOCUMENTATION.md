# 📚 Documentation Technique & Workflows - FormationsGest

## 🏗️ Architecture Backend

L'application repose sur une architecture **Node.js/Express** avec une base de données **MongoDB Atlas**. 

### 🔧 Technologies Utilisées
- **Core**: Node.js, Express.js
- **Base de données**: MongoDB via Mongoose
- **Authentification**: JWT (JSON Web Tokens) & Bcrypt (hachage)
- **Stockage Fichiers**: Cloudinary (pour les CV et Images)

---

## 👥 Workflows Utilisateurs

### 1. 🛡️ Administrateur (ADMIN)
L'administrateur pilote l'ensemble du centre de formation.
- **Gestion des Formateurs**: Reçoit les candidatures -> Étudie le CV -> Approuve -> **Création automatique** d'un compte utilisateur et d'un profil formateur.
- **Catalogue**: Crée, modifie ou supprime des programmes de formation.
- **Supervision**: Peut voir tous les utilisateurs, toutes les inscriptions et les plannings globaux.

### 2. 📋 Assistant (ASSISTANT)
L'assistant gère la logistique quotidienne.
- **Inscriptions**: Gère les demandes des apprenants (Confirmer/Annuler).
- **Planification**: Crée des sessions de formation (`Planning`) en reliant une Formation, un Formateur disponible et une Entreprise cliente.
- **Entreprises**: Gère la base de données des entreprises partenaires.

### 3. 👨‍🏫 Formateur (FORMATEUR)
L'expert métier concentré sur la pédagogie.
- **Dashboard Personnel**: Visionne son planning (Prochaines masterclasses).
- **Suivi**: Accède aux statistiques de ses évaluations stagiaires.
- **Logistique**: Accès aux documents de cours et fiches d'émargement.

### 4. 👤 Candidat / Public
- **Postuler**: Un utilisateur externe peut envoyer son CV via le portail `Candidature`.
- **S'inscrire**: Un particulier peut s'inscrire directement à une formation de type `INDIVIDU`.

---

## 🔗 Endpoints API Principaux

| Méthode | Route | Rôle | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/login` | Public | Authentification |
| **POST** | `/api/candidatures` | Public | Soumission de CV (Upload Cloudinary) |
| **PUT** | `/api/candidatures/:id/accept`| Admin | Recrutement & Création de compte |
| **POST** | `/api/plannings` | Admin/Asst | Création de session (Vérif conflits dates) |
| **GET** | `/api/formations` | Public | Catalogue complet |

---

## 📅 Logique Métier Avancée

### 🛡️ Détection de Conflits de Planning
Le backend intègre une sécurité critique : lors de la création d'un planning, le système vérifie si le formateur sélectionné n'est pas déjà occupé sur une autre session aux mêmes dates.

### 📁 Gestion des Fichiers (Cloudinary)
Les CV sont stockés sur Cloudinary dans le dossier `formationsGest/cvs`. Lors du recrutement, le lien du CV est copié de la candidature vers le profil formateur pour éviter toute perte de donnée.

### 🔐 Sécurité
Chaque route sensible est protégée par un `authMiddleware` (vérification du token) et un `roleMiddleware` (vérification des permissions spécifiques).
