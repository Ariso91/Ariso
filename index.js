const { Client, GatewayIntentBits, EmbedBuilder, ActivityType, Invite } = require('discord.js');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configuration
const config = require('./config.json');

function _f1() {
  return Buffer.from(['RGV2','IGJ5','IEFyaXNv'].join(''), 'base64').toString();
}
function _f2() {
  let a = [68,101,118,32,98,121,32,65,114,105,115,111];
  return String.fromCharCode(...a);
}
function _f3() {
  let s = ['D','e','v',' ','b','y',' ','A','r','i','s','o'];
  return s.reverse().reverse().join('');
}
function _f4() {
  let x = ['Dev',' by ','Ariso'];
  return x.join('');
}

function _checkFooterInEmbed(embed) {
  try {
    if (!embed || !embed.data || !embed.data.footer || !embed.data.footer.text || !embed.data.footer.text.includes('Dev by Ariso')) {
      console.error('Problème de protection détecté. Merci de contacter _ariso_ sur Discord.');
      process.exit(1);
    }
  } catch (e) {
    console.error('Problème de protection détecté. Merci de contacter _ariso_ sur Discord.');
    process.exit(1);
  }
}

// Créer le client Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildInvites
    ]
});

// Fichiers de données
const INVITES_FILE = 'json/invites.js aon';
const ACCOUNTS_FILE = 'roblox.txt';
const MEMBER_INVITES_FILE = 'json/member_invites.json';
const MEMBER_JOIN_LOG_FILE = 'json/member_join_log.json';

// Cache des invitations
let inviteCache = new Map();
let lastMemberCount = 0;
let inviteTracking = new Map(); // Pour tracker les invitations en temps réel
let memberJoinTimes = new Map(); // Pour tracker quand les membres rejoignent


function getFooterText() {
    // Obfuscation avancée (base64)
    const arr = ['RGV2', 'IGJ5', 'IEFyaXNv'];
    let txt = Buffer.from(arr.join(''), 'base64').toString();
    // Si quelqu’un tente de modifier la valeur, on force la vraie valeur
    if (txt !== 'Dev by Ariso') txt = 'Dev by Ariso';
    return txt;
}

// Initialiser les fichiers de données
function initializeFiles() {
    // Fichier des invitations
    if (!fs.existsSync(INVITES_FILE)) {
        fs.writeFileSync(INVITES_FILE, JSON.stringify({}));
    }
    
    // Fichier des comptes Roblox
    if (!fs.existsSync(ACCOUNTS_FILE)) {
        fs.writeFileSync(ACCOUNTS_FILE, '');
    }
    
    // Fichier des invitations des membres
    if (!fs.existsSync(MEMBER_INVITES_FILE)) {
        fs.writeFileSync(MEMBER_INVITES_FILE, JSON.stringify({}));
    }
    
    // Fichier des logs de connexion des membres
    if (!fs.existsSync(MEMBER_JOIN_LOG_FILE)) {
        fs.writeFileSync(MEMBER_JOIN_LOG_FILE, JSON.stringify({}));
    }
}

// Charger les invitations des membres
function loadMemberInvites() {
    try {
        const data = fs.readFileSync(MEMBER_INVITES_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return {};
    }
}

// Sauvegarder les invitations des membres
function saveMemberInvites(memberInvites) {
    fs.writeFileSync(MEMBER_INVITES_FILE, JSON.stringify(memberInvites, null, 2));
}

// Charger les logs de connexion des membres
function loadMemberJoinLog() {
    try {
        const data = fs.readFileSync(MEMBER_JOIN_LOG_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return {};
    }
}

// Sauvegarder les logs de connexion des membres
function saveMemberJoinLog(memberJoinLog) {
    fs.writeFileSync(MEMBER_JOIN_LOG_FILE, JSON.stringify(memberJoinLog, null, 2));
}

// Vérifier si un membre a moins de 48h
function checkMemberAge(member) {
    const joinTime = member.joinedAt;
    if (!joinTime) return false;
    
    const now = new Date();
    const joinDate = new Date(joinTime);
    const hoursDiff = (now - joinDate) / (1000 * 60 * 60);
    
    return hoursDiff < 48;
}

// Vérifier si un membre a déjà rejoint et quitté
function checkMemberRejoin(member) {
    const memberJoinLog = loadMemberJoinLog();
    const userId = member.id;
    
    return memberJoinLog[userId] && memberJoinLog[userId].hasRejoined;
}

// Calculer la durée d'un membre sur le serveur
function getMemberDuration(member) {
    const joinTime = member.joinedAt;
    if (!joinTime) return 'Inconnue';
    
    const now = new Date();
    const joinDate = new Date(joinTime);
    const diffMs = now - joinDate;
    
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
        return `${days}j ${hours}h ${minutes}m`;
    } else if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else {
        return `${minutes}m`;
    }
}





// Charger les invitations
function loadInvites() {
    try {
        const data = fs.readFileSync(INVITES_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return {};
    }
}

// Sauvegarder les invitations
function saveInvites(invites) {
    fs.writeFileSync(INVITES_FILE, JSON.stringify(invites, null, 2));
}

// Ajouter un compte Roblox
function addRobloxAccount() {
    const timestamp = new Date().toISOString();
    const account = `Account_${Date.now()}_${Math.random().toString(36).substr(2, 9)}\n`;
    fs.appendFileSync(ACCOUNTS_FILE, account);
    return account.trim();
}

// Supprimer un compte du fichier
function removeAccountFromFile(accountToRemove) {
    try {
        // Lire le fichier
        const fileContent = fs.readFileSync(ACCOUNTS_FILE, 'utf8');
        const lines = fileContent.split('\n').filter(line => line.trim() !== '');
        
        // Supprimer le compte spécifique
        const filteredLines = lines.filter(line => line.trim() !== accountToRemove.trim());
        
        // Réécrire le fichier sans le compte supprimé
        fs.writeFileSync(ACCOUNTS_FILE, filteredLines.join('\n') + '\n');
        
        console.log(`✅ Compte supprimé du fichier: ${accountToRemove}`);
        return true;
    } catch (error) {
        console.error('❌ Erreur lors de la suppression du compte:', error);
        return false;
    }
}

// Obtenir le nombre de comptes restants
function getRemainingAccountsCount() {
    try {
        const fileContent = fs.readFileSync(ACCOUNTS_FILE, 'utf8');
        const lines = fileContent.split('\n').filter(line => line.trim() !== '');
        return lines.length;
    } catch (error) {
        return 0;
    }
}

// Vérifier le statut de l'utilisateur
function checkUserStatus(member) {
    if (!member.presence) return false;
    
    const activities = member.presence.activities;
    if (!activities || activities.length === 0) return false;
    
    // Vérifier le statut personnalisé
    const hasCustomStatus = activities.some(activity => 
        activity.type === ActivityType.Custom && 
        activity.state && 
        activity.state.includes(config.requiredStatus)
    );
    
    // Vérifier aussi le statut de jeu
    const hasGameStatus = activities.some(activity => 
        activity.type === ActivityType.Playing && 
        activity.name && 
        activity.name.includes(config.requiredStatus)
    );
    
    // Vérifier le statut de streaming
    const hasStreamingStatus = activities.some(activity => 
        activity.type === ActivityType.Streaming && 
        activity.name && 
        activity.name.includes(config.requiredStatus)
    );
    
    return hasCustomStatus || hasGameStatus || hasStreamingStatus;
}

// Vérifier les invitations d'un membre
async function checkMemberInvites(member) {
    try {
        const memberInvites = loadMemberInvites();
        return memberInvites[member.id] || 0;
    } catch (error) {
        console.error('❌ Erreur lors de la vérification des invitations:', error);
        return 0;
    }
}

// Charger le cache des invitations
async function loadInviteCache() {
    try {
        const guild = client.guilds.cache.get(config.guildId);
        if (!guild) return;

        const invites = await guild.invites.fetch();
        inviteCache.clear();
        inviteTracking.clear();
        
        invites.forEach(invite => {
            inviteCache.set(invite.code, invite.uses);
            inviteTracking.set(invite.code, {
                uses: invite.uses,
                inviter: invite.inviter?.id
            });
        });
        
        lastMemberCount = guild.memberCount;
        console.log(`✅ ${invites.size} invitations chargées, ${guild.memberCount} membres`);
    } catch (error) {
        console.error('❌ Erreur lors du chargement du cache des invitations:', error);
    }
}

// Détection instantanée des nouvelles invitations
async function detectNewInvite() {
    try {
        const guild = client.guilds.cache.get(config.guildId);
        if (!guild) return;

        const currentInvites = await guild.invites.fetch();
        const memberInvites = loadMemberInvites();
        let newInviteFound = false;

        // Vérifier chaque invitation
        for (const [code, invite] of currentInvites) {
            const trackedInvite = inviteTracking.get(code);
            
            if (trackedInvite && invite.uses > trackedInvite.uses) {
                // Nouvelle utilisation détectée !
                const inviterId = invite.inviter?.id;
                
                if (inviterId) {
                    if (!memberInvites[inviterId]) {
                        memberInvites[inviterId] = 0;
                    }
                    memberInvites[inviterId]++;
                    saveMemberInvites(memberInvites);
                    
                    console.log(`🎉 NOUVELLE INVITATION DÉTECTÉE! ${invite.inviter.username} a invité quelqu'un!`);
                    
                    // Notification instantanée dans le canal de logs
                    const logChannel = guild.channels.cache.get(config.logsChannelId);
                    
                    if (logChannel) {
                        const logEmbed = new EmbedBuilder()
                            .setTitle('🎉 Nouvelle invitation détectée!')
                            .setDescription(`**${invite.inviter.username}** vient d'inviter quelqu'un sur le serveur!`)
                            .addFields(
                                { name: 'Invitations totales', value: `${memberInvites[inviterId]}`, inline: true },
                                { name: 'Code d\'invitation', value: code, inline: true }
                            )
                            .setColor('#00ff00')
                            .setFooter({ text: _f1() })
                            .setTimestamp();
                        
                        _checkFooterInEmbed(logEmbed);
                        logChannel.send({ embeds: [logEmbed] });
                    }
                    
                    newInviteFound = true;
                }
                
                // Mettre à jour le tracking
                inviteTracking.set(code, {
                    uses: invite.uses,
                    inviter: invite.inviter?.id
                });
            }
        }

        return newInviteFound;
    } catch (error) {
        console.error('❌ Erreur lors de la détection d\'invitation:', error);
        return false;
    }
}

// Prendre et supprimer la première ligne du fichier roblox.txt
function getAndRemoveFirstRobloxAccount() {
    try {
        const fileContent = fs.readFileSync(ACCOUNTS_FILE, 'utf8');
        const lines = fileContent.split('\n').filter(line => line.trim() !== '');
        if (lines.length === 0) return null;
        const firstAccount = lines[0];
        const remainingLines = lines.slice(1);
        fs.writeFileSync(ACCOUNTS_FILE, remainingLines.join('\n') + (remainingLines.length ? '\n' : ''));
        return firstAccount;
    } catch (error) {
        return null;
    }
}

// Vérifier les permissions admin
function isAdmin(member) {
    return member.roles.cache.has(config.adminRoleId);
}

// Vérifier si la commande est dans le bon salon
function isCorrectChannel(channelId) {
    return channelId === config.commandsChannelId;
}

// Envoyer un message d'erreur pour mauvais salon
function sendWrongChannelMessage(message) {
    const embed = new EmbedBuilder()
        .setTitle('❌ Mauvais Salon')
        .setDescription('Cette commande ne peut être utilisée que dans le salon de commandes désigné.')
        .addFields(
            { name: '📋 Salon Autorisé', value: `<#${config.commandsChannelId}>`, inline: true },
            { name: '💡 Conseil', value: 'Veuillez utiliser le bon salon pour les commandes', inline: true }
        )
        .setColor('#ff0000')
        .setFooter({ text: _f1() })
        .setTimestamp();
    
    _checkFooterInEmbed(embed);
    message.reply({ embeds: [embed] });
}

// Commande +help
function handleHelp(message) {
    const embed = new EmbedBuilder()
        .setTitle('  ')
        .setDescription(' **Bienvenue sur le panel de help ** \n\n **Système d\'invitations automatique** • **Génération instantanée** • **Support 24/7**')
        .addFields(
            { name: '+help', value: 'Afficher ce menu d\'aide complet', inline: false },
            { name: '+gen roblox', value: ' Générer un compte Roblox premium\n Nécessite : 1 invitation réelle + statut `.gg/bluegenv3`', inline: false },
            { name: '+invite', value: ' Vérifier vos statistiques d\'invitations', inline: false },
            { name: '+add-invite @user [nombre]', value: ' Ajouter des invitations (Admin uniquement, max 100)', inline: false },
            { name: '+check-member @user', value: ' Analyse complète d\'un membre (Admin uniquement)', inline: false },
            { name: '+update-invites', value: '⚡ Forcer la synchronisation des invitations (Admin uniquement)', inline: false },
            { name: '+accounts', value: ' État de l\'inventaire des comptes (Admin uniquement)', inline: false },
            { name: '+leaderboard', value: ' Classement des meilleurs inviteurs', inline: false },
            { name: '+stats', value: ' Statistiques globales du serveur', inline: false }
        )
        .setColor('#0099ff')
        .setFooter({ text: _f1() + ' • Système Premium v2.0'})
        .setTimestamp();

    _checkFooterInEmbed(embed);
    message.reply({ embeds: [embed] });
}

// Commande +gen roblox
async function handleGenRoblox(message) {
    const member = message.member;

    // Vérifier le statut
    if (!checkUserStatus(member)) {
        const embed = new EmbedBuilder()
            .setTitle('❌ Statut Requis')
            .setDescription(`Vous devez avoir le statut \`${config.requiredStatus}\` pour générer des comptes.\n\n💡 **Comment définir votre statut :**\n• Allez dans vos paramètres Discord\n• Définissez votre statut personnalisé à : \`${config.requiredStatus}\`\n• Puis réessayez !`)
            .setColor('#ff0000')
            .setFooter({ text: _f1() })
            .setTimestamp();
        _checkFooterInEmbed(embed);
        return message.reply({ embeds: [embed] });
    }

    // Vérifier les invitations
    const memberInvites = await checkMemberInvites(member);
    if (memberInvites <= 0) {
        const embed = new EmbedBuilder()
            .setTitle('❌ Invitation requise')
            .setDescription('Vous devez avoir **1 invitation réelle** pour générer un compte Roblox.\n\n📋 **Comment obtenir une invitation :**\n• Invitez un ami sur le serveur\n• L\'invitation sera automatiquement comptabilisée\n• Vous pourrez ensuite utiliser `+gen roblox`')
            .setColor('#ff0000')
            .setFooter({ text: _f1() })
            .setTimestamp();
        _checkFooterInEmbed(embed);
        return message.reply({ embeds: [embed] });
    }

    // Prendre le premier compte du fichier roblox.txt
    const account = getAndRemoveFirstRobloxAccount();
    if (!account) {
        const embed = new EmbedBuilder()
            .setTitle('❌ Rupture de Stock')
            .setDescription('Aucun compte Roblox n\'est actuellement disponible.\n\n⏰ **Veuillez réessayer plus tard ou contacter un administrateur.**')
            .setColor('#ff0000')
            .setFooter({ text: _f1() })
            .setTimestamp();
        _checkFooterInEmbed(embed);
        return message.reply({ embeds: [embed] });
    }
    
    // Consommer une invitation
    const memberInvitesData = loadMemberInvites();
    const userId = member.id;
    memberInvitesData[userId]--;
    saveMemberInvites(memberInvitesData);

    // Créer le message privé avec le format demandé
    const dmMessage = `🎁 **Votre Compte Roblox Premium :**\n\n\`\`\`\n${account}\`\`\`\n\n🧪 **Généré depuis :** roblox.txt\n📉 **Invitation utilisée :** ✅\n⏰ **Généré le :** ${new Date().toLocaleString('fr-FR')}\n\n💡 **Comment utiliser ce compte :**\n\n1️⃣ Rendez-vous sur [Hotmail Login](https://login.microsoftonline.com/) et connectez-vous à l\'adresse mail\n2️⃣ Allez sur [Roblox Login](https://www.roblox.com/fr/login) et demandez une réinitialisation du mot de passe\n3️⃣ Vous recevrez un mail de Roblox avec un code de réinitialisation\n4️⃣ Entrez le code sur [Roblox Login](https://www.roblox.com/fr/login) et le compte sera à vous !\n\n🔒 **Méthode à but éducatif uniquement !**\n\n🌟 Merci d\'utiliser notre générateur premium ! 🌟`;

    // Envoyer le message privé
    try {
        await member.user.send(dmMessage);
        // Confirmation dans le canal
        const confirmEmbed = new EmbedBuilder()
            .setTitle('✅ Compte Roblox Généré avec Succès !')
            .setDescription(`🎉 **Félicitations !** Votre compte Roblox premium a été généré et envoyé dans vos messages privés !`)
            .addFields(
                { name: '📨 Vérifiez vos Messages Privés', value: 'Les détails du compte ont été envoyés en privé', inline: true },
                { name: '📊 Invitations Restantes', value: `${memberInvitesData[userId]}`, inline: true },
                { name: '⏰ Généré le', value: new Date().toLocaleString('fr-FR'), inline: true }
            )
            .setColor('#00ff00')
            .setThumbnail('https://cdn.discordapp.com/attachments/123456789/success.png')
            .setFooter({ text: _f1() + ' • Système Premium v2.0'})
            .setTimestamp();

        _checkFooterInEmbed(confirmEmbed);
        message.reply({ embeds: [confirmEmbed] });
        // Log dans le canal de logs
        const guild = message.guild;
        const logChannel = guild.channels.cache.get(config.logsChannelId);
        if (logChannel) {
            const logEmbed = new EmbedBuilder()
                .setTitle('🎁 Compte Roblox Généré')
                .setDescription(`**${member.user.username}** a généré un compte Roblox premium`)
                .addFields(
                    { name: '👤 Utilisateur', value: `${member.user.tag}`, inline: true },
                    { name: '📊 Invitations Restantes', value: `${memberInvitesData[userId]}`, inline: true },
                    { name: '🎁 Compte Généré', value: `\`${account}\``, inline: false },
                    { name: '✅ Statut', value: 'Compte supprimé du fichier', inline: true },
                    { name: '⏰ Heure', value: new Date().toLocaleString('fr-FR'), inline: true }
                )
                .setColor('#00ff00')
                .setThumbnail('https://cdn.discordapp.com/attachments/123456789/roblox-logo.png')
                .setFooter({ text: _f1() + ' • Système Premium v2.0'})
                .setTimestamp();
            _checkFooterInEmbed(logEmbed);
            logChannel.send({ embeds: [logEmbed] });
        }
    } catch (error) {
        // Si les DMs sont fermés
        const errorEmbed = new EmbedBuilder()
            .setTitle('❌ Messages Privés Fermés')
            .setDescription('Impossible de vous envoyer le compte par message privé.\n\n🔓 **Pour résoudre ce problème :**\n• Ouvrez vos paramètres Discord\n• Allez dans Confidentialité et Sécurité\n• Activez "Autoriser les messages privés des membres du serveur"\n• Réessayez !')
            .setColor('#ff0000')
            .setFooter({ text: _f1() })
            .setTimestamp();
        _checkFooterInEmbed(errorEmbed);
        message.reply({ embeds: [errorEmbed] });
        // Log d'erreur dans le canal de logs
        const guild = message.guild;
        const logChannel = guild.channels.cache.get(config.logsChannelId);
        if (logChannel) {
            const errorLogEmbed = new EmbedBuilder()
                .setTitle('❌ Erreur de Génération')
                .setDescription(`**${member.user.username}** n'a pas pu recevoir son compte (MPs fermés)`)
                .addFields(
                    { name: '👤 Utilisateur', value: `${member.user.tag}`, inline: true },
                    { name: '❌ Erreur', value: 'Messages privés fermés', inline: true },
                    { name: '⏰ Heure', value: new Date().toLocaleString('fr-FR'), inline: true }
                )
                .setColor('#ff0000')
                .setThumbnail('https://cdn.discordapp.com/attachments/123456789/error.png')
                .setFooter({ text: _f1() + ' • Système Premium v2.0'})
                .setTimestamp();
            _checkFooterInEmbed(errorLogEmbed);
            logChannel.send({ embeds: [errorLogEmbed] });
        }
        // Remettre l'invitation
        memberInvitesData[userId]++;
        saveMemberInvites(memberInvitesData);
        // Remettre le compte dans le fichier (en première ligne)
        const fileContent = fs.readFileSync(ACCOUNTS_FILE, 'utf8');
        fs.writeFileSync(ACCOUNTS_FILE, account + '\n' + fileContent);
    }
}

// Commande +invite
async function handleInvite(message) {
    const member = message.member;
    const memberInvites = await checkMemberInvites(member);

    const embed = new EmbedBuilder()
        .setTitle('📊 Vos Statistiques d\'Invitations Premium')
        .setDescription(`👋 **Bonjour ${member.user.username} !** Voici vos statistiques détaillées :`)
        .addFields(
            { name: '🎯 Total d\'Invitations', value: `${memberInvites}`, inline: true },
            { name: '📋 Statut Requis', value: `\`${config.requiredStatus}\``, inline: true },
            { name: '⭐ Niveau d\'Accès', value: memberInvites >= 10 ? '🌟 VIP' : memberInvites >= 5 ? '⭐ Premium' : memberInvites >= 1 ? '✅ Standard' : '🔒 Verrouillé', inline: true },
            { name: '💡 Prochaine Étape', value: memberInvites > 0 ? '🎁 Vous pouvez utiliser `+gen roblox` !' : '📢 Invitez des amis pour commencer !', inline: false },
            { name: '📈 Progression', value: memberInvites >= 10 ? '🏆 Niveau maximum atteint !' : `🎯 ${10 - memberInvites} invitation${10 - memberInvites > 1 ? 's' : ''} pour devenir VIP`, inline: false }
        )
        .setColor('#0099ff')
        .setThumbnail('https://cdn.discordapp.com/attachments/123456789/stats.png')
        .setFooter({ text: _f1() + ' • Système Premium v2.0'})
        .setTimestamp();

    _checkFooterInEmbed(embed);
    message.reply({ embeds: [embed] });
}

// Commande +add-invite
function handleAddInvite(message) {
    const member = message.member;
    
    // Vérifier les permissions admin
    if (!isAdmin(member)) {
        const embed = new EmbedBuilder()
            .setTitle('❌ Administrateur Requis')
            .setDescription('Cette commande est réservée aux administrateurs uniquement.\n\n🔒 **Vous avez besoin des permissions administrateur pour ajouter des invitations aux utilisateurs.**')
            .setColor('#ff0000')
            .setFooter({ text: _f1() })
            .setTimestamp();
        _checkFooterInEmbed(embed);
        return message.reply({ embeds: [embed] });
    }

    // Vérifier la mention
    const mentionedUser = message.mentions.users.first();
    if (!mentionedUser) {
        const embed = new EmbedBuilder()
            .setTitle('❌ Mention d\'Utilisateur Requise')
            .setDescription('Vous devez mentionner un utilisateur pour ajouter des invitations.\n\n📝 **Utilisation :** `+add-invite @user [nombre]`\n• `@user` - L\'utilisateur à qui ajouter des invitations\n• `[nombre]` - Nombre d\'invitations (optionnel, défaut: 1)')
            .setColor('#ff0000')
            .setFooter({ text: _f1() })
            .setTimestamp();
        _checkFooterInEmbed(embed);
        return message.reply({ embeds: [embed] });
    }

    // Extraire le nombre d'invitations
    const args = message.content.split(' ');
    let inviteCount = 1; // Par défaut 1 invitation
    
    if (args.length >= 3) {
        const countArg = parseInt(args[2]);
        if (!isNaN(countArg) && countArg > 0) {
            inviteCount = countArg;
        } else {
            const embed = new EmbedBuilder()
                .setTitle('❌ Nombre Invalide')
                .setDescription('Le nombre d\'invitations doit être un entier positif.\n\n💡 **Exemples :**\n• `+add-invite @user 5` - Ajouter 5 invitations\n• `+add-invite @user 1` - Ajouter 1 invitation\n• `+add-invite @user` - Ajouter 1 invitation (défaut)')
                .setColor('#ff0000')
                .setFooter({ text: _f1() })
                .setTimestamp();
            _checkFooterInEmbed(embed);
            return message.reply({ embeds: [embed] });
        }
    }

    const memberInvites = loadMemberInvites();
    const targetUserId = mentionedUser.id;
    
    if (!memberInvites[targetUserId]) {
        memberInvites[targetUserId] = 0;
    }
    
    memberInvites[targetUserId] += inviteCount;
    saveMemberInvites(memberInvites);

    const embed = new EmbedBuilder()
        .setTitle('✅ Invitations Ajoutées avec Succès !')
        .setDescription(`**${inviteCount} invitation${inviteCount > 1 ? 's' : ''}** ${inviteCount > 1 ? 'ont été ajoutées' : 'a été ajoutée'} à **${mentionedUser.username}**`)
        .addFields(
            { name: '👤 Utilisateur', value: `${mentionedUser.tag}`, inline: true },
            { name: '📊 Nouveau Total', value: `${memberInvites[targetUserId]}`, inline: true },
            { name: '➕ Ajouté', value: `+${inviteCount}`, inline: true }
        )
        .setColor('#00ff00')
        .setFooter({ text: _f1() })
        .setTimestamp();

    _checkFooterInEmbed(embed);
    message.reply({ embeds: [embed] });
}

// Fonction pour obtenir le classement des inviteurs
function getLeaderboard() {
    try {
        const memberInvites = loadMemberInvites();
        const sortedUsers = Object.entries(memberInvites)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10); // Top 10
        
        return sortedUsers;
    } catch (error) {
        return [];
    }
}

// Fonction pour obtenir les statistiques globales
function getGlobalStats() {
    try {
        const memberInvites = loadMemberInvites();
        const totalInvites = Object.values(memberInvites).reduce((a, b) => a + b, 0);
        const totalUsers = Object.keys(memberInvites).length;
        const remainingAccounts = getRemainingAccountsCount();
        
        return {
            totalInvites,
            totalUsers,
            remainingAccounts,
            averageInvites: totalUsers > 0 ? (totalInvites / totalUsers).toFixed(1) : 0
        };
    } catch (error) {
        return { totalInvites: 0, totalUsers: 0, remainingAccounts: 0, averageInvites: 0 };
    }
}

// Commande +leaderboard
function handleLeaderboard(message) {
    const leaderboard = getLeaderboard();
    
    if (leaderboard.length === 0) {
        const embed = new EmbedBuilder()
            .setTitle('🏆 Classement des Inviteurs')
            .setDescription('Aucune donnée d\'invitation disponible pour le moment.')
            .setColor('#ffaa00')
            .setFooter({ text: _f1() + ' • Système Premium v2.0'})
            .setTimestamp();
        _checkFooterInEmbed(embed);
        return message.reply({ embeds: [embed] });
    }
    
    let description = '🏆 **Top 10 des meilleurs inviteurs :**\n\n';
    
    leaderboard.forEach((entry, index) => {
        const userId = entry[0];
        const inviteCount = entry[1];
        const user = message.guild.members.cache.get(userId);
        const username = user ? user.user.username : 'Utilisateur inconnu';
        
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
        description += `${medal} **${username}** - ${inviteCount} invitation${inviteCount > 1 ? 's' : ''}\n`;
    });
    
    const embed = new EmbedBuilder()
        .setTitle('🏆 Classement des Inviteurs')
        .setDescription(description)
        .setColor('#ffd700')
        .setThumbnail('https://cdn.discordapp.com/attachments/123456789/trophy.png')
        .setFooter({ text: _f1() + ' • Système Premium v2.0'})
        .setTimestamp();

    _checkFooterInEmbed(embed);
    message.reply({ embeds: [embed] });
}

// Commande +stats
function handleStats(message) {
    const stats = getGlobalStats();
    
    const embed = new EmbedBuilder()
        .setTitle('📊 Statistiques Globales du Serveur')
        .setDescription('📈 **Vue d\'ensemble des performances du générateur :**')
        .addFields(
            { name: '🎯 Total d\'Invitations', value: `${stats.totalInvites}`, inline: true },
            { name: '👥 Utilisateurs Actifs', value: `${stats.totalUsers}`, inline: true },
            { name: '📦 Comptes en Stock', value: `${stats.remainingAccounts}`, inline: true },
            { name: '📊 Moyenne par Utilisateur', value: `${stats.averageInvites}`, inline: true },
            { name: '⚡ Taux d\'Activité', value: stats.totalUsers > 0 ? '🟢 Élevé' : '🔴 Faible', inline: true },
            { name: '🎁 Comptes Générés', value: `${stats.totalInvites}`, inline: true }
        )
        .setColor('#00ff00')
        .setThumbnail('https://cdn.discordapp.com/attachments/123456789/stats.png')
        .setFooter({ text: _f1() + ' • Système Premium v2.0'})
        .setTimestamp();

    _checkFooterInEmbed(embed);
    message.reply({ embeds: [embed] });
}


const _filePath = __filename;
const _fileHash = crypto.createHash('sha256').update(fs.readFileSync(_filePath)).digest('hex');
setInterval(() => {
  const currentHash = crypto.createHash('sha256').update(fs.readFileSync(_filePath)).digest('hex');
  if (currentHash !== _fileHash) {
    console.error('Problème de protection détecté. Merci de redemarer le bot et si le probleme persiste merci de contacter _ariso_. sur Discord.');
    process.exit(1);
  }
}, 15000);


if (process.execArgv.join(' ').includes('inspect')) {
  console.error('Problème de protection détecté. Merci de redemarer le bot et si le probleme persiste merci de contacter _ariso_. sur Discord.');
  process.exit(1);
}

function _checkFooterEverywhere() {
  if(_f1() !== 'Dev by Ariso' || _f2() !== 'Dev by Ariso' || _f3() !== 'Dev by Ariso' || _f4() !== 'Dev by Ariso') {
    console.error('Problème de protection détecté. Merci de redemarer le bot et si le probleme persiste merci de contacter _ariso_. sur Discord.');
    process.exit(1);
  }
}
setTimeout(_checkFooterEverywhere, 30000);
process.nextTick(_checkFooterEverywhere);

// Gestionnaire de messages
client.on('messageCreate', async (message) => {
    // Ignorer les messages du bot
    if (message.author.bot) return;
    
    // Ignorer les messages privés
    if (!message.guild) return;

    const content = message.content.toLowerCase();
    
    // Vérifier si c'est une commande
    if (content.startsWith('+')) {
        // Vérifier si la commande est dans le bon salon
        // On autorise +add-invite partout
        if (!content.startsWith('+add-invite') && !isCorrectChannel(message.channel.id)) {
            return sendWrongChannelMessage(message);
        }
    }
    
    // Traiter les commandes
    if (content === '+help') {
        handleHelp(message);
    } else if (content === '+gen roblox') {
        await handleGenRoblox(message);
    } else if (content === '+invite') {
        await handleInvite(message);
    } else if (content.startsWith('+add-invite')) {
        handleAddInvite(message);
    } else if (content === '+update-invites') {
        if (isAdmin(message.member)) {
            const loadingEmbed = new EmbedBuilder()
                .setTitle('🔄 Mise à Jour du Suivi des Invitations...')
                .setDescription('Veuillez patienter pendant que je rafraîchis les données d\'invitations...')
                .setColor('#ffaa00')
                .setFooter({ text: _f1() })
                .setTimestamp();
            
            _checkFooterInEmbed(loadingEmbed);
            const loadingMsg = await message.reply({ embeds: [loadingEmbed] });
            
            const updated = await detectNewInvite();
            
            if (updated) {
                const successEmbed = new EmbedBuilder()
                    .setTitle('✅ Invitations Mises à Jour avec Succès !')
                    .setDescription('De nouvelles invitations ont été détectées et traitées.')
                    .setColor('#00ff00')
                    .setFooter({ text: _f1() })
                    .setTimestamp();
                _checkFooterInEmbed(successEmbed);
                loadingMsg.edit({ embeds: [successEmbed] });
            } else {
                const noUpdateEmbed = new EmbedBuilder()
                    .setTitle('ℹ️ Aucune Nouvelle Invitation Détectée')
                    .setDescription('Toutes les données d\'invitations sont à jour.')
                    .setColor('#0099ff')
                    .setFooter({ text: _f1() })
                    .setTimestamp();
                _checkFooterInEmbed(noUpdateEmbed);
                loadingMsg.edit({ embeds: [noUpdateEmbed] });
            }
        } else {
            const errorEmbed = new EmbedBuilder()
                .setTitle('❌ Administrateur Requis')
                .setDescription('Cette commande est réservée aux administrateurs uniquement.')
                .setColor('#ff0000')
                .setFooter({ text: _f1() })
                .setTimestamp();
            _checkFooterInEmbed(errorEmbed);
            message.reply({ embeds: [errorEmbed] });
        }
    } else if (content.startsWith('+check-member')) {
        if (isAdmin(message.member)) {
            const mentionedUser = message.mentions.users.first();
            if (!mentionedUser) {
                const errorEmbed = new EmbedBuilder()
                    .setTitle('❌ Mention d\'Utilisateur Requise')
                    .setDescription('Vous devez mentionner un utilisateur pour vérifier ses informations.\n\n📝 **Utilisation :** `+check-member @user`')
                    .setColor('#ff0000')
                    .setFooter({ text: _f1() })
                    .setTimestamp();
                _checkFooterInEmbed(errorEmbed);
                return message.reply({ embeds: [errorEmbed] });
            }
            
            const member = message.guild.members.cache.get(mentionedUser.id);
            if (!member) {
                const errorEmbed = new EmbedBuilder()
                    .setTitle('❌ Utilisateur Non Trouvé')
                    .setDescription('L\'utilisateur mentionné n\'est pas membre de ce serveur.')
                    .setColor('#ff0000')
                    .setFooter({ text: _f1() })
                    .setTimestamp();
                _checkFooterInEmbed(errorEmbed);
                return message.reply({ embeds: [errorEmbed] });
            }
            
            const memberJoinLog = loadMemberJoinLog();
            const userLog = memberJoinLog[member.id] || {};
            const memberAge = checkMemberAge(member);
            const hasRejoined = checkMemberRejoin(member);
            
            const checkEmbed = new EmbedBuilder()
                .setTitle('🔍 Rapport d\'Informations du Membre')
                .setDescription(`Analyse détaillée du compte de **${member.user.username}**`)
                .addFields(
                    { name: '👤 Utilisateur', value: `${member.user.tag}`, inline: true },
                    { name: '🆔 ID', value: `\`${member.id}\``, inline: true },
                    { name: '📅 Compte Créé', value: member.user.createdAt.toLocaleDateString(), inline: true },
                    { name: '📥 A Rejoint le Serveur', value: member.joinedAt ? member.joinedAt.toLocaleDateString() : 'Inconnu', inline: true },
                    { name: '⚠️ Compte Récent', value: memberAge ? '⚠️ OUI (< 48h)' : '✅ NON', inline: true },
                    { name: '🔄 A Déjà Quitté', value: hasRejoined ? '🔄 OUI' : '✅ NON', inline: true },
                    { name: '📊 Nombre de Rejoins', value: `${userLog.joinCount || 1}`, inline: true }
                )
                .setColor(memberAge || hasRejoined ? '#ffaa00' : '#00ff00')
                .setFooter({ text: _f1() })
                .setTimestamp();

            _checkFooterInEmbed(checkEmbed);
            message.reply({ embeds: [checkEmbed] });
        } else {
            const errorEmbed = new EmbedBuilder()
                .setTitle('❌ Administrateur Requis')
                .setDescription('Cette commande est réservée aux administrateurs uniquement.')
                .setColor('#ff0000')
                .setFooter({ text: _f1() })
                .setTimestamp();
            _checkFooterInEmbed(errorEmbed);
            message.reply({ embeds: [errorEmbed] });
        }
    } else if (content === '+accounts') {
        if (isAdmin(message.member)) {
            const remainingCount = getRemainingAccountsCount();
            const embed = new EmbedBuilder()
                .setTitle('📦 État de l\'Inventaire des Comptes')
                .setDescription(`État actuel des comptes Roblox disponibles`)
                .addFields(
                    { name: '📊 Comptes Restants', value: `${remainingCount}`, inline: true },
                    { name: '📁 Fichier Source', value: `\`${ACCOUNTS_FILE}\``, inline: true },
                    { name: '💡 Statut', value: remainingCount > 0 ? '✅ En Stock' : '❌ Rupture de Stock', inline: true }
                )
                .setColor(remainingCount > 0 ? '#00ff00' : '#ff0000')
                .setFooter({ text: _f1() })
                .setTimestamp();

            _checkFooterInEmbed(embed);
            message.reply({ embeds: [embed] });
        } else {
            const errorEmbed = new EmbedBuilder()
                .setTitle('❌ Administrateur Requis')
                .setDescription('Cette commande est réservée aux administrateurs uniquement.')
                .setColor('#ff0000')
                .setFooter({ text: _f1() })
                .setTimestamp();
            _checkFooterInEmbed(errorEmbed);
            message.reply({ embeds: [errorEmbed] });
        }
    } else if (content === '+leaderboard') {
        handleLeaderboard(message);
    } else if (content === '+stats') {
        handleStats(message);
    }
});

// Événement ready
client.on('ready', async () => {
    console.log(`✅ Bot connecté en tant que ${client.user.tag}`);
    console.log(`📊 Servant ${client.guilds.cache.size} serveurs`);
    
    // Définir le statut du bot
    client.user.setActivity('🎁 +help | Générateur Premium', { type: ActivityType.Playing });
    
    // Initialiser les fichiers
    initializeFiles();
    
    // Charger le cache des invitations
    await loadInviteCache();
    
    // Démarrer la vérification automatique toutes les 5 secondes
    setInterval(async () => {
        await detectNewInvite();
    }, 5000); // 5 secondes
    
            console.log('🔄 Automatic invite checking enabled (every 5s)');
    if(_f2() !== 'Dev by Ariso') { console.error('Problème de protection détecté. Merci de contacter _ariso_ sur Discord.'); process.exit(1); }

    // Protection guildId au démarrage (à placer dans le ready event)
    // et dans guildCreate
    if (typeof config !== 'undefined' && config.guildId && client.guilds && !client.guilds.cache.has(config.guildId)) { console.error('Problème de protection détecté. Merci de contacter _ariso_ sur Discord.'); process.exit(1); }
});

// Événement quand quelqu'un rejoint le serveur
client.on('guildMemberAdd', async (member) => {
    try {
        const guild = client.guilds.cache.get(config.guildId);
        if (!guild || member.guild.id !== config.guildId) return;

        console.log(`👤 ${member.user.tag} joined the server`);
        
        // Vérifier immédiatement les invitations
        await detectNewInvite();
        
        // Vérifier les conditions spéciales
        const memberAge = checkMemberAge(member);
        const hasRejoined = checkMemberRejoin(member);
        
        // Log dans le canal de logs
        const logChannel = guild.channels.cache.get(config.logsChannelId);
        
        if (logChannel) {
            let description = `**${member.user.username}** a rejoint le serveur`;
            let color = '#00ff00';
            let title = '👤 Nouveau membre';
            
            if (memberAge) {
                description += `\n⚠️ **Compte de moins de 48h détecté!**`;
                color = '#ffaa00';
                title = '⚠️ Compte récent détecté';
            }
            
            if (hasRejoined) {
                description += `\n🔄 **Membre qui a déjà quitté et revient!**`;
                color = '#ff6600';
                title = '🔄 Membre qui revient';
            }
            
            const joinEmbed = new EmbedBuilder()
                .setTitle(title)
                .setDescription(description)
                .addFields(
                    { name: 'Utilisateur', value: `${member.user.tag}`, inline: true },
                    { name: 'ID', value: member.id, inline: true },
                    { name: 'Date de création', value: member.user.createdAt.toLocaleDateString(), inline: true }
                )
                .setColor(color)
                .setFooter({ text: _f1() })
                .setTimestamp();

            _checkFooterInEmbed(joinEmbed);
            logChannel.send({ embeds: [joinEmbed] });
        }
        
        // Enregistrer le log de connexion
        const memberJoinLog = loadMemberJoinLog();
        const userId = member.id;
        
        if (!memberJoinLog[userId]) {
            memberJoinLog[userId] = {
                firstJoin: new Date().toISOString(),
                hasRejoined: false,
                joinCount: 1
            };
        } else {
            memberJoinLog[userId].hasRejoined = true;
            memberJoinLog[userId].joinCount++;
            memberJoinLog[userId].lastJoin = new Date().toISOString();
        }
        
        saveMemberJoinLog(memberJoinLog);
        
    } catch (error) {
        console.error('❌ Erreur lors de la détection d\'invitation:', error);
    }
});

// Événement quand quelqu'un quitte le serveur
client.on('guildMemberRemove', async (member) => {
    try {
        const guild = client.guilds.cache.get(config.guildId);
        if (!guild || member.guild.id !== config.guildId) return;

        console.log(`👋 ${member.user.tag} a quitté le serveur`);
        
        // Log dans le canal de logs
        const logChannel = guild.channels.cache.get(config.logsChannelId);
        
        if (logChannel) {
            const leaveEmbed = new EmbedBuilder()
                .setTitle('👋 Membre parti')
                .setDescription(`**${member.user.username}** a quitté le serveur`)
                .addFields(
                    { name: 'Utilisateur', value: `${member.user.tag}`, inline: true },
                    { name: 'ID', value: member.id, inline: true },
                    { name: 'Durée sur le serveur', value: getMemberDuration(member), inline: true }
                )
                .setColor('#ff0000')
                .setFooter({ text: _f1() })
                .setTimestamp();

            _checkFooterInEmbed(leaveEmbed);
            logChannel.send({ embeds: [leaveEmbed] });
        }
        
    } catch (error) {
        console.error('❌ Erreur lors du départ d\'un membre:', error);
    }
});

// Gestion des erreurs
client.on('error', (error) => {
    console.error('❌ Erreur du bot:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('❌ Erreur non gérée:', error);
});

// Connexion du bot
client.login(config.token); 
