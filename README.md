# React + Vite

📚 Documentation Technique & Workflows - FormationsGest
🏗️ Architecture du Système
L'application est une solution Full Stack moderne conçue pour la gestion de centres de formation.

Frontend : React (Vite) + Tailwind CSS + Framer Motion (Animations).
Backend : Node.js (Express) + Mongoose.
Base de données : MongoDB Atlas (Cloud).
Stockage externe : Cloudinary (Stockage sécurisé des CV et images).
👥 Workflows par Type d'Utilisateur
1. 🛡️ L'Administrateur (ADMIN)
Son rôle est stratégique. Il gère les ressources humaines et le catalogue.

Workflow Recrutement :
Consulte la liste des candidatures reçues via le site public.
Ouvre le CV (lien direct Cloudinary).
Clique sur "Approuver" : Le système crée alors instantanément un compte 
User
 et un profil 
Formateur
, génère un mot de passe temporaire et transfère le CV.
Gestion Catalogue : Crée et édite les formations (Titre, objectifs, coût, durée).
2. 📋 L'Assistant (ASSISTANT)
Son rôle est opérationnel. Il fait le lien entre les besoins et les ressources.

Workflow Planification :
Reçoit une demande d'une entreprise ou accumule assez d'inscrits individuels.
Utilise l'outil de planification pour créer une session.
Sécurité : Si le formateur choisi est déjà pris sur ces dates, le système bloque la création pour éviter les doublons.
Gestion Clients : Enregistre les fiches entreprises partenaires.
3. 👨‍🏫 Le Formateur (FORMATEUR)
Son rôle est pédagogique.

Monitoring : Accède à son Dashboard privé pour voir son emploi du temps à venir.
Qualité : Consulte les statistiques de ses évaluations (pédagogie, rythme, support) pour s'améliorer.
4. 👤 Public / Apprenant
Workflow Inscription : Parcourt le catalogue -> Remplit le formulaire -> Reçoit une confirmation.
🔐 Sécurité & Intégrité des Données
Authentification JWT : Chaque communication entre le frontend et le backend est signée numériquement.
Permissions Granulaires : Un "Assistant" ne peut pas accéder aux fonctions critiques d'un "Admin" (comme supprimer un utilisateur).
Validation des Données : Express-validator sécurise les entrées pour éviter toute injection ou donnée corrompue.
📁 Structure du Backend
Dossier	Rôle
models/	Définition des schémas de données (Mongoose).
controllers/	Logique métier (calculs, vérifications de conflits).
routes/	Points d'entrée de l'API.
middlewares/	Sécurité, Upload de fichiers, Gestion des rôles.
config/	Connexion DB et configuration Cloudinary.
Votre projet est maintenant parfaitement