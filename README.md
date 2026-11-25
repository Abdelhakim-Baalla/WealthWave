# WealthWave 💰

[Budget fictif en lecture seule](https://baalla-wealthwave-demo.abdelhakimbaalla50.workers.dev) · [Vue du tableau de bord](https://github.com/Abdelhakim-Baalla/WealthWave/blob/main/views/dashboard.ejs)

Pour reconstruire la démo depuis la racine du dépôt, exécuter `npm ci && node scripts/build-demo.cjs`. À la racine, `npx wrangler deploy` publie les fichiers générés.

> **Application de gestion financière personnelle moderne et intuitive**

WealthWave est une application web complète qui vous permet de gérer efficacement vos finances personnelles. Suivez vos transactions, créez des budgets, définissez des objectifs financiers et organisez vos dépenses par catégories, le tout dans une interface moderne et responsive.

![WealthWave Logo](assets/WealthWave-logo-normal.png)

## Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Dépendances](#dépendances)
- [Structure du projet](#structure-du-projet)
- [Configuration](#configuration)
- [Exportation des données](#exportation-des-données)
- [Sécurité](#sécurité)
- [Contribution](#contribution)
- [Licence](#licence)

## Fonctionnalités

### Gestion des utilisateurs

- Inscription et connexion sécurisées
- Gestion des profils utilisateurs
- Restauration de mot de passe par email
- Sessions sécurisées

### Gestion des transactions

- Ajout, modification et suppression de transactions
- Catégorisation des transactions
- Suivi des revenus et dépenses
- Historique complet des transactions

### Gestion des budgets

- Création de budgets personnalisés
- Alertes de dépassement de budget
- Budgets par catégorie

### Objectifs financiers

- Définition d'objectifs d'épargne
- Suivi de progression
- Visualisation des objectifs atteints

### Tableaux de bord et analytics

- Dashboard personnalisé avec graphiques (Chart.js)
- Analyse des revenus et dépenses
- Répartition par catégories

### Exportation

- Export CSV de toutes les données
- Compatible Excel (encodage UTF-8 avec BOM)
- Données personnalisables pour l'export

## Architecture

### Backend (Node.js + Express)

- **Serveur Express** : Gestion des routes HTTP et middlewares
- **ORM Sequelize** : Mapping objet-relationnel avec MySQL
- **Sessions sécurisées** : Authentification et autorisation

### Frontend (EJS + Tailwind CSS)

- **Templates EJS** : Rendu côté serveur avec données dynamiques
- **Tailwind CSS** : Framework CSS utilitaire pour un design moderne
- **Chart.js** : Graphiques interactifs et visualisations
- **Design responsive** : Compatible mobile et desktop

### Base de données (MySQL)

- **Modèles relationnels** : Utilisateurs, transactions, budgets, objectifs, catégories
- **Intégrité référentielle** : Relations entre les entités
- **Synchronisation automatique** : Création des tables au démarrage

> **Pour plus de détails sur l'architecture**, consultez [README_architecture.txt](README_architecture.txt)

## Installation

### Prérequis

- **Node.js** v18+
- **MySQL** 5.7+ ou MariaDB
- **npm** (inclus avec Node.js)

### Étapes d'installation

1. **Cloner le projet**

   ```bash
   git clone https://github.com/Abdelhakim-Baalla/WealthWave.git
   cd WealthWave
   ```
2. **Installer les dépendances**

   ```bash
   npm install
   ```
3. **Configurer la base de données**

   ```sql
   CREATE DATABASE wealthwave;
   ```
4. **Configuration des variables d'environnement**

   ```bash
   cp example.env .env
   ```

   Modifiez le fichier `.env` avec vos paramètres :

   ```env
   # Configuration SMTP pour l'envoi d'emails
   SMTP_USER=votre-email@gmail.com
   SMTP_PASS=votre-mot-de-passe-app

   # URL de l'application
   APP_URL=http://localhost:8080

   # Configuration base de données (optionnel, valeurs par défaut dans config/database.js)
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=
   DB_NAME=wealthwave
   ```
5. **Compiler le CSS**

   ```bash
   npm run build:css
   ```

   Ou pour le développement (watch mode) :

   ```bash
   npm run watch:css
   ```
6. **Lancer l'application**

   ```bash
   node app.js
   ```
7. **Accéder à l'application**

   Ouvrez votre navigateur à l'adresse : [http://localhost:8080](http://localhost:8080)

> **Guide d'installation détaillé** disponible dans [README_installation.txt](README_installation.txt)

## Utilisation

### Première utilisation

1. Inscrivez-vous avec un email valide
2. Connectez-vous à votre compte
3. Créez vos premières catégories de dépenses
4. Ajoutez vos transactions
5. Définissez vos budgets
6. Fixez vos objectifs financiers

### Navigation

- **Dashboard** : Vue d'ensemble de vos finances
- **Transactions** : Gestion de toutes vos transactions
- **Budgets** : Création et suivi de vos budgets
- **Objectifs** : Définition et suivi de vos objectifs
- **Catégories** : Organisation de vos dépenses
- **Profil** : Gestion de votre compte utilisateur

## Dépendances

### Dépendances principales

| Package                   | Version | Description                                      |
| ------------------------- | ------- | ------------------------------------------------ |
| **express**         | ^5.1.0  | Framework web pour Node.js                       |
| **ejs**             | ^3.1.10 | Moteur de templates pour le rendu côté serveur |
| **sequelize**       | ^6.37.7 | ORM pour la gestion de base de données          |
| **mysql2**          | ^3.15.1 | Driver MySQL pour Node.js                        |
| **express-session** | ^1.18.2 | Gestion des sessions utilisateur                 |
| **bcrypt**          | ^6.0.0  | Hashage sécurisé des mots de passe             |
| **nodemailer**      | ^7.0.6  | Envoi d'emails (restauration mot de passe)       |
| **dotenv**          | ^17.2.2 | Gestion des variables d'environnement            |
| **csv-writer**      | ^1.6.0  | Export des données en format CSV                |
| **n-digit-token**   | ^2.2.3  | Génération de tokens sécurisés               |
| **chart.js**        | ^4.5.0  | Bibliothèque de graphiques interactifs          |

### Dépendances de développement

| Package                | Version  | Description                        |
| ---------------------- | -------- | ---------------------------------- |
| **tailwindcss**  | ^4.1.14  | Framework CSS utilitaire           |
| **postcss**      | ^8.5.6   | Transformateur CSS                 |
| **autoprefixer** | ^10.4.21 | Ajout automatique de préfixes CSS |

> **Documentation complète des dépendances** dans [README_dependances.txt](README_dependances.txt)

## Structure du projet

```
WealthWave/
├── app.js                    # Point d'entrée de l'application
├── package.json              # Configuration npm et dépendances
├── exportationCSV.js         # Utilitaire d'export CSV
├── tailwind.config.js        # Configuration Tailwind CSS
├── postcss.config.js         # Configuration PostCSS
├── test.rest                 # Tests API REST
├── example.env               # Exemple de variables d'environnement
├── assets/                   # Ressources statiques (logos, icônes)
├── config/
│   └── database.js           # Configuration base de données
├── models/                   # Modèles Sequelize
│   ├── index.js              # Configuration des modèles
│   ├── utilisateurs.js       # Modèle utilisateurs
│   ├── transactions.js       # Modèle transactions
│   ├── budgets.js            # Modèle budgets
│   ├── objectifs.js          # Modèle objectifs
│   ├── categories.js         # Modèle catégories
│   ├── notifications.js      # Modèle notifications
│   └── motDePasseRestorationTokens.js
├── views/                    # Templates EJS
│   ├── index.ejs             # Page d'accueil
│   ├── dashboard.ejs         # Tableau de bord
│   ├── connexion.ejs         # Page de connexion
│   ├── inscription.ejs       # Page d'inscription
│   ├── profile.ejs           # Page profil
│   ├── transactions/         # Templates transactions
│   ├── budgets/              # Templates budgets
│   ├── objectifs/            # Templates objectifs
│   ├── categories/           # Templates catégories
│   └── partials/             # Composants réutilisables
├── public/                   # Fichiers statiques publics
│   ├── styles.css            # CSS compilé par Tailwind
│   └── css/
└── src/
    └── input.css             # CSS source Tailwind
```

## Configuration

### Configuration de la base de données

Modifiez `config/database.js` si nécessaire ou utilisez les variables d'environnement :

```javascript
// Configuration par défaut
const config = {
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'wealthwave',
  dialect: 'mysql'
};
```

### Configuration SMTP

Pour l'envoi d'emails de restauration de mot de passe, configurez votre SMTP dans `.env` :

```env
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-application
```

> **Note** : Pour Gmail, utilisez un "mot de passe d'application" plutôt que votre mot de passe principal.

## Exportation des données

WealthWave permet l'export de toutes vos données au format CSV :

- **Transactions** : Historique complet avec catégories
- **Budgets** : Budgets définis avec leurs limites
- **Objectifs** : Objectifs financiers et progression
- **Format compatible Excel** : Encodage UTF-8 avec BOM

L'export est accessible depuis chaque section via le bouton "Exporter en CSV".

## Sécurité

### Mesures de sécurité implémentées

- **Hashage des mots de passe** : bcrypt avec salt
- **Sessions sécurisées** : express-session avec cookies HTTP-only
- **Tokens de restauration** : n-digit-token pour les liens sécurisés
- **Variables d'environnement** : Secrets stockés dans .env
- **Validation des données** : Validation côté serveur et client
- **Protection CSRF** : Protection contre les attaques cross-site

### Bonnes pratiques

- Les mots de passe ne sont jamais stockés en clair
- Les sessions expirent automatiquement
- Les tokens de restauration ont une durée de vie limitée
- Les variables sensibles sont dans .env (non versionnées)

## Contribution

Les contributions sont les bienvenues ! Voici comment contribuer :

1. **Fork** le projet
2. **Créez** une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. **Committez** vos changements (`git commit -m 'Add some AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrez** une Pull Request

### Développement local

```bash
# Installer les dépendances
npm install

# Mode développement avec watch CSS
npm run watch:css

# Lancer l'application
node app.js
```

## Scripts disponibles

```bash
# Compilation CSS (production)
npm run build:css

# Compilation CSS (développement avec watch)
npm run watch:css

# Tests (à implémenter)
npm test
```

## Licence

Ce projet est sous licence ISC. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## Support

- **Issues** : [GitHub Issues](https://github.com/Abdelhakim-Baalla/WealthWave/issues)
- **Discussions** : [GitHub Discussions](https://github.com/Abdelhakim-Baalla/WealthWave/discussions)

---

## Documentation complémentaire

- [Architecture détaillée](README_architecture.txt)
- [Guide des dépendances](README_dependances.txt)
- [Guide d&#39;installation](README_installation.txt)

---

**WealthWave** - Prenez le contrôle de vos finances 💰

Développé par [Abdelhakim Baalla](https://github.com/Abdelhakim-Baalla)
