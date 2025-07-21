# 🤖 Générateur de Comptes Roblox Premium

Bienvenue sur le **Générateur de Comptes Roblox Premium** !

Ce bot Discord vous permet de gérer un système d'invitations avancé et de générer des comptes Roblox de façon sécurisée et automatisée. Idéal pour les communautés qui souhaitent récompenser leurs membres actifs !

---

## ✨ Fonctionnalités principales
- **Génération instantanée de comptes Roblox**
- **Système d'invitations automatique** (invitez pour générer)
- **Classement des meilleurs inviteurs** (+leaderboard)
- **Statistiques globales du serveur** (+stats)
- **Gestion avancée des invitations (ajout, suivi, logs)**
- **Logs détaillés et messages personnalisés**
- **Interface 100% en français**

---

## 📋 Commandes disponibles

| Commande                | Description                                                        |
|-------------------------|--------------------------------------------------------------------|
| `+help`                 | Afficher le menu d'aide complet                                    |
| `+gen roblox`           | Générer un compte Roblox (1 invitation réelle + statut requis)     |
| `+invite`               | Voir vos statistiques d'invitations                                |
| `+add-invite @user [n]` | Ajouter des invitations à un membre (admin uniquement)             |
| `+check-member @user`   | Voir les infos détaillées d'un membre (admin uniquement)           |
| `+update-invites`       | Forcer la synchronisation des invitations (admin uniquement)       |
| `+accounts`             | Voir l'état du stock de comptes Roblox (admin uniquement)          |
| `+leaderboard`          | Voir le classement des meilleurs inviteurs                         |
| `+stats`                | Voir les statistiques globales du serveur                          |

---

## ⚙️ Prérequis & Installation

1. **Node.js** (v16 ou supérieur recommandé)
2. **Créer un bot Discord** et récupérer son token
3. **Cloner ce repo**

```bash
git clone <url-du-repo>
cd <nom-du-repo>
npm install
```

---

## 🚀 Configuration rapide

1. **Renommez** le fichier `config.example.json` en `config.json` et remplissez :
   - `token` : le token de votre bot
   - `guildId` : l'ID de votre serveur
   - `logsChannelId` : l'ID du salon logs
   - `commandsChannelId` : l'ID du salon commandes
   - `adminRoleId` : l'ID du rôle admin
   - `requiredStatus` : le statut requis pour générer un compte
2. **Ajoutez vos comptes Roblox** dans `roblox.txt` (1 compte par ligne)
3. **Lancez le bot**

```bash
node index.js
```

---

## 🛠️ Exemple de configuration `config.json`

```json
{
  "token": "VOTRE_TOKEN_BOT_DISCORD",
  "guildId": "VOTRE ID DU SERVEUR ",
  "logsChannelId": "ID DE TON SALON DE LOGS",
  "commandsChannelId": "ID DU CHANELLE OU LES GEN VONT GEN",
  "adminRoleId": "ID DU ROLE GEN",
  "requiredStatus": "STATUS REQUIR POUR GEN"
}
```

**Explications des champs :**
- `token` : Le token de votre bot Discord (à récupérer sur le [portail développeur Discord](https://discord.com/developers/applications))
- `guildId` : L'ID de votre serveur Discord (clic droit sur le serveur > "Copier l'identifiant")
- `logsChannelId` : L'ID du salon où seront envoyés les logs (créez un salon #logs et copiez son ID)
- `commandsChannelId` : L'ID du salon où les commandes sont autorisées (ex : #commandes)
- `adminRoleId` : L'ID du rôle qui a accès aux commandes admin (ex : @Admin)
- `requiredStatus` : Le statut personnalisé que les membres doivent avoir pour générer un compte (ex : `.gg/bluegenv3`)

> **Astuce :** Pour activer l'affichage des identifiants sur Discord, allez dans Paramètres > Apparence > Mode développeur.

---

## ⚠️ Avertissement légal

> Ce bot est fourni à des fins éducatives et de gestion communautaire uniquement. L'utilisation abusive, la revente ou la diffusion de comptes sans autorisation est strictement interdite. L'auteur décline toute responsabilité en cas de mauvaise utilisation.

---

## 👑 Crédits

- Développé par **Ariso**
- Système Premium v2.0
- Merci à la communauté Discord ! 
