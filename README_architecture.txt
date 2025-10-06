# Documentation Technique détaillée

## Architecture et fonctionnement de WealthWave

WealthWave est une application web de gestion financière qui permet aux utilisateurs de suivre leurs transactions, budgets, objectifs et catégories. Voici comment chaque composant fonctionne :

### 1. Backend (Node.js + Express)
- **app.js** : Fichier principal, configure les routes, les middlewares, la gestion des sessions et le rendu des vues.
- **Routes principales** :
  - `/` : Page d'accueil
  - `/inscription` : Inscription utilisateur
  - `/connexion` : Connexion utilisateur
  - `/dashboard` : Tableau de bord personnalisé
  - `/transactions`, `/budgets`, `/objectifs`, `/categories` : CRUD pour chaque entité
  - `/profile` : Gestion du profil utilisateur
  - `/motdepasseoublie` : Restauration du mot de passe
  - `/export` : Exportation des données en CSV

### 2. Modèles Sequelize (ORM)
- **models/** : Définit les schémas de la base de données pour chaque entité (utilisateurs, transactions, budgets, objectifs, catégories, notifications, tokens de restauration).
- **Relations** :
  - Un utilisateur possède plusieurs transactions, budgets, objectifs, notifications.
  - Les transactions, budgets et objectifs sont liés à des catégories.

### 3. Base de données (MySQL)
- **config/database.js** : Configure la connexion à MySQL via Sequelize.
- Les modèles sont synchronisés automatiquement au démarrage.

### 4. Frontend (EJS + Tailwind CSS)
- **views/** : Templates EJS pour chaque page (dashboard, listes, formulaires, etc.).
- **public/styles.css** : Généré par Tailwind à partir de `src/input.css`.
- **assets/** : Images et icônes utilisées dans l'interface.

### 5. Fonctionnalités principales
- **Gestion des utilisateurs** : Inscription, connexion, modification du profil, restauration du mot de passe (avec envoi d'e-mail).
- **Transactions** : Ajout, modification, suppression, export CSV.
- **Budgets** : Création, modification, suppression, export CSV.
- **Objectifs** : Suivi des objectifs financiers.
- **Catégories** : Organisation des transactions et budgets.
- **Notifications** : Affichage des notifications dans la navbar.

### 6. Sécurité
- **express-session** : Gestion sécurisée des sessions utilisateur.
- **bcrypt** : Hashage des mots de passe avant stockage.
- **n-digit-token** : Génération de tokens pour la restauration de mot de passe.

### 7. Exportation CSV
- **exportationCSV.js** : Fonction utilitaire pour exporter n'importe quel modèle en CSV, avec encodage UTF-8 et BOM pour compatibilité Excel.

---

# Dépendances détaillées et leur rôle

- **express** : Gère les routes HTTP, les middlewares et la logique serveur.
- **ejs** : Permet de générer dynamiquement les pages HTML côté serveur avec des variables et des boucles.
- **sequelize** : Simplifie les requêtes SQL, la gestion des relations et la synchronisation des modèles avec la base de données.
- **mysql2** : Driver performant pour connecter Node.js à MySQL.
- **express-session** : Stocke les sessions utilisateur côté serveur (cookie + mémoire).
- **bcrypt** : Hashage sécurisé des mots de passe lors de l'inscription et de la modification du profil.
- **nodemailer** : Envoie des e-mails pour la restauration de mot de passe et les notifications importantes.
- **dotenv** : Charge les variables d'environnement depuis le fichier `.env` (DB, SMTP, etc.).
- **csv-writer** : Génère des fichiers CSV à partir des données des modèles (transactions, budgets, etc.).
- **n-digit-token** : Crée des tokens aléatoires pour sécuriser la restauration de mot de passe.
- **chart.js** : Affiche des graphiques dynamiques sur le dashboard (revenus, dépenses, etc.).

### Dépendances de développement
- **tailwindcss** : Framework CSS utilitaire pour un design moderne et réactif.
- **postcss** : Transforme le CSS (utilisé par Tailwind).
- **autoprefixer** : Ajoute automatiquement les préfixes CSS pour la compatibilité navigateur.

---

## Exemple de fonctionnement :
- Lorsqu'un utilisateur s'inscrit, son mot de passe est hashé avec bcrypt et stocké dans la base de données.
- Lors de la connexion, la session est créée et stockée via express-session.
- Les transactions, budgets et objectifs sont liés à l'utilisateur et à une catégorie, et peuvent être exportés en CSV.
- La restauration du mot de passe utilise nodemailer pour envoyer un lien sécurisé avec un token généré par n-digit-token.
- Le dashboard affiche des graphiques générés par Chart.js à partir des données de l'utilisateur.

Pour plus de détails sur chaque module, consultez le code source dans les dossiers `models/`, `views/` et le fichier `app.js`.

