# Guide d'installation et de configuration

## Prérequis
- Node.js (v18+ recommandé)
- MySQL
- npm

## Installation
1. Cloner le projet :
   git clone https://github.com/Abdelhakim-Baalla/WealthWave.git
   cd WealthWave

2. Installer les dépendances :
   npm install

3. Configurer la base de données :
   - Créez une base MySQL nommée `wealthwave`.
   - Modifiez `.env` avec vos identifiants MySQL et SMTP.

4. Compiler le CSS :
   npm run build:css
   (ou npm run watch:css pour le dev)

5. Lancer l'application :
   node app.js

Accédez à http://localhost:8080

