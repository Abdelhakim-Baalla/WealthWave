# Bibliothèques et dépendances externes détaillées

## Dépendances principales et leur fonctionnement

- **express** : Gère les routes HTTP, les middlewares et la logique serveur. Permet de définir les endpoints pour chaque fonctionnalité (inscription, connexion, dashboard, etc.).
- **ejs** : Génère dynamiquement les pages HTML côté serveur. Utilisé pour afficher les données utilisateur, listes de transactions, budgets, etc.
- **sequelize** : ORM qui simplifie la gestion des modèles, relations et requêtes SQL. Permet de manipuler les données sans écrire de SQL brut.
- **mysql2** : Driver performant pour connecter Node.js à MySQL. Utilisé par Sequelize pour exécuter les requêtes.
- **express-session** : Stocke les sessions utilisateur côté serveur (cookie + mémoire). Permet de garder l'utilisateur connecté et de sécuriser l'accès aux pages.
- **bcrypt** : Hashage sécurisé des mots de passe lors de l'inscription et de la modification du profil. Empêche le stockage de mots de passe en clair.
- **nodemailer** : Envoie des e-mails pour la restauration de mot de passe et les notifications importantes (utilisation du SMTP défini dans .env).
- **dotenv** : Charge les variables d'environnement depuis le fichier `.env` (DB, SMTP, etc.), pour ne pas exposer les secrets dans le code.
- **csv-writer** : Génère des fichiers CSV à partir des données des modèles (transactions, budgets, etc.), pour l'export des données utilisateur.
- **n-digit-token** : Crée des tokens aléatoires pour sécuriser la restauration de mot de passe (lien unique envoyé par email).
- **chart.js** : Affiche des graphiques dynamiques sur le dashboard (revenus, dépenses, répartition par catégorie, etc.).

## Dépendances de développement
- **tailwindcss** : Framework CSS utilitaire pour un design moderne et réactif. Permet de styliser rapidement les pages EJS.
- **postcss** : Transforme le CSS (utilisé par Tailwind pour la compilation).
- **autoprefixer** : Ajoute automatiquement les préfixes CSS pour la compatibilité navigateur.

---

## Exemple d'utilisation dans le projet
- Lorsqu'un utilisateur s'inscrit, le mot de passe est hashé avec bcrypt puis stocké dans la base MySQL via Sequelize.
- Lors de la connexion, express-session crée une session pour l'utilisateur.
- Les transactions, budgets et objectifs sont liés à l'utilisateur et à une catégorie, et peuvent être exportés en CSV grâce à csv-writer.
- La restauration du mot de passe utilise nodemailer pour envoyer un lien sécurisé avec un token généré par n-digit-token.
- Le dashboard affiche des graphiques générés par Chart.js à partir des données de l'utilisateur.

Pour plus de détails, consultez le code source et le fichier package.json.
