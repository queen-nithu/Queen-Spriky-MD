const config = require('../config');
const { cmd, commands } = require('../command');

//-----------------------------------------------Get Group Admins-----------------------------------------------
cmd({
    pattern: "admins",
    desc: "Get a list of group admins.",
    react: "👥",
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
    react: "👥",
    category: "group",
    filename: __filename
},
async (conn, mek, m, {
    from, args, quoted, body, isCmd, command, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply
}) => {
    try {
        if (!isAdmins) return reply(`You Must Be Admin For Use This Command`);
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
    react: "👥",
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
    react: "👥",
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
    react: "👥",
    category: "group",
    filename: __filename
},
async (conn, mek, m, {
    from, args, quoted, body, isCmd, command, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply
}) => {
    try {
        if (!isAdmins) return reply(`You Must Be Admin For Use This Command`);
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
    react: "👥",
    category: "group",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        if (!isAdmins) return reply(`You Must Be Admin For Use This Command`);
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
    react: "👥",
    category: "group",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, mentionedJid, reply
}) => {
    try {

        const user = quoted ? quoted.sender : (mentionedJid ? mentionedJid[0] : null);

        if (!user) return reply('Please mention a user or reply to their message to promote.');
        if (!isAdmins) return reply(`You Must Be Admin For Use This Command`);

        await conn.groupMakeAdmin(from, [user]);
        return await conn.sendMessage(from, {
            text: `@${user.split('@')[0]} has been promoted to admin.`
        }, { quoted: mek, contextInfo: { mentionedJid: [user] } });

    } catch (e) {
        console.log(e);
        return reply(`Error: ${e.message}`);
    }
});

//---------------------------------------------Hide Tag --------------------------------------------

cmd({
    pattern: "hidetag",
    desc: "Tags everyperson of group without mentioning their numbers",
    react: "👥",
    category: "group",
    filename: __filename,
    use: '<text>',
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isSachintha, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try { 
    if (!m.isGroup) return reply(tlang().group);
if (!m.isGroup) return reply('only for groups');
if (!isAdmins) return reply(`You Must Be Admin For Use This Command`);
    conn.sendMessage(m.chat, {
        text: q ? text : "",
        mentions: participants.map((a) => a.id),
    }, {
        quoted: mek ,messageId:genMsgId() 
    });
} catch (e) {
reply('Error !!')
l(e)
}
})

//---------------------------------------------Kick --------------------------------------------

cmd({
    pattern: "kick",
    desc: "Kicks replied/quoted user from group.",
    react: "👥",
    category: "group",
    filename: __filename,
    use: '<quote|reply|number>',
  },           
      async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname,isSachintha, isSavi, isSadas, isMani, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
     try {

         if (!m.isGroup) return reply('only for groups');
    if (!isBotAdmins) return reply(`I can't do that. give group admin`);
    if (!isAdmins) return reply(`You Must Be Admin For Use This Command`);
    
      const user = m.quoted.sender;
      if (!user) return reply('*Please give me a user to kick ❗*');
      await conn.groupParticipantsUpdate(m.chat, [user], "remove");
     reply(`${user} *has been kicked out of the group!*`);
    } catch (e) {
  reply('Error !!')
  l(e)
  }
  })

  //---------------------------------------------Demote Admin --------------------------------------------

  cmd({
    pattern: "demote",
    desc: "demote admin to a member",
    react: "👥",
    category: "group",
    use: '.demote',
    filename: __filename
},
async (conn, mek, m, { from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {                   
    try {
        if (!m.isGroup) return reply('only for groups');
        if (!isBotAdmins) return reply(`I can't do that. give group admin`);
        if (!isAdmins) return reply(`You Must Be Admin For Use This Command`);
                                  
        let users = mek.mentionedJid ? mek.mentionedJid[0] : mek.quoted ? mek.quoted.sender : q.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        await conn.groupParticipantsUpdate(mek.chat, [users], 'demote')
            .then((res) => reply(jsonformat(res)))
            .catch((err) => reply(jsonformat(err)));

        await conn.sendMessage(from, { text: 'Done' }, { quoted: mek }); 
    } catch (e) {
        reply('Error !!');
        l(e);
    }
});