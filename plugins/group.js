const config = require('../config');
const { cmd, commands } = require('../command');

//-----------------------------------------------Get Group Admins-----------------------------------------------
cmd({
    pattern: "admins",
    desc: "Get a list of group admins.",
    category: "group",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, body, isCmd, command, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply
}) => {
    try {
        const groupMetadata = await conn.groupMetadata(from);
        const admins = groupMetadata.participants
            .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
            .map(admin => `@${admin.id.split('@')[0]}`)
            .join('\n');

        return await conn.sendMessage(from, {
            text: `*Group Admins:*\n\n${admins}`,
            mentions: groupMetadata.participants
                .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
                .map(admin => admin.id)
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

//------------------------------------------------------------Set Group Description--------------------------------------------------------------

cmd({
    pattern: "groupdesc",
    desc: "Change the group description.",
    use: '.groupdesc <New Description>',
    category: "group",
    filename: __filename
},
async (conn, mek, m, {
    from, args, quoted, body, isCmd, command, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply
}) => {
    try {
        if (args.length === 0) return reply('Please provide a new group description.');

        const newDesc = args.join(' '); // Join all arguments as the new description
        await conn.groupUpdateDescription(from, newDesc);

        return await conn.sendMessage(from, {
            text: `Group description has been updated to:\n\n${newDesc}`
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

//-----------------------------------------------------------Get Group Info-------------------------------------------------------------

cmd({
    pattern: "groupinfo",
    desc: "Get information about the group.",
    category: "group",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, body, isCmd, command, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply
}) => {
    try {
        const groupMetadata = await conn.groupMetadata(from); // Get group metadata
        const groupInfo = `
*Group Name:* ${groupMetadata.subject}
*Group Description:* ${groupMetadata.desc || 'No description'}
*Owner:* ${groupMetadata.owner}
*Members:* ${groupMetadata.participants.length}
*Created At:* ${new Date(groupMetadata.creation * 1000).toLocaleString()}
        `;
        return await conn.sendMessage(from, {
            text: groupInfo
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

//-----------------------------------------------Get Group Invite Link-----------------------------------------------

cmd({
    pattern: "grouplink",
    desc: "Get the group's invite link.",
    category: "group",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, body, isCmd, command, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply
}) => {
    try {
        const inviteLink = await conn.groupInviteCode(from);
        return await conn.sendMessage(from, {
            text: `*Here is your group's invite link:* https://chat.whatsapp.com/${inviteLink}`
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

//---------------------------------------------Group Subject Change --------------------------------------------

cmd({
    pattern: "setsubject",
    desc: "Change the group subject.",
    use: '.setsubject <New Subject>',
    category: "group",
    filename: __filename
},
async (conn, mek, m, {
    from, args, quoted, body, isCmd, command, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply
}) => {
    try {
        if (args.length === 0) return await conn.sendMessage(from, {
            text: 'Please provide a new group subject.'
        }, { quoted: mek });

        const newSubject = args.join(' '); // Join all arguments as the new subject
        await conn.groupUpdateSubject(from, newSubject);

        return await conn.sendMessage(from, {
            text: `Group subject has been updated to: ${newSubject}`
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

//---------------------------------------------Tag All --------------------------------------------

cmd({
    pattern: "tagall",
    desc: "Mention all group members.",
    category: "group",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const groupMetadata = await conn.groupMetadata(from);
        const members = groupMetadata.participants.map(participant => `@${participant.id.split('@')[0]}`).join('\n');
        const mentions = groupMetadata.participants.map(p => p.id);
        
        return await conn.sendMessage(from, {
            text: `Mentioning everyone:\n\n${members}`,
            mentions
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        return reply(`Error: ${e.message}`);
    }
});

//---------------------------------------------Promote User As Admin --------------------------------------------

cmd({
    pattern: "promote",
    desc: "Promote a member to admin.",
    category: "group",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, mentionedJid, reply
}) => {
    try {
        const user = quoted ? quoted.sender : (mentionedJid ? mentionedJid[0] : null);

        if (!user) return reply('Please mention a user or reply to their message to promote.');

        await conn.groupMakeAdmin(from, [user]);
        return await conn.sendMessage(from, {
            text: `@${user.split('@')[0]} has been promoted to admin.`
        }, { quoted: mek, contextInfo: { mentionedJid: [user] } });

    } catch (e) {
        console.log(e);
        return reply(`Error: ${e.message}`);
    }
});