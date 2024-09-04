const config = require('../config');
const { cmd, commands } = require('../command');

//-----------------------------------------------Leave Group-----------------------------------------------

cmd({
    pattern: "leavegc",
    desc: "Make the bot leave the group.",
    category: "owner",
    react: "👤",
    filename: __filename
},
async (conn, mek, m, {
    from, reply
}) => {
    try {
        if(!isOwner) return //check owner
        await conn.groupLeave(from);
        return await conn.sendMessage(from, {
            text: "Bot has left the group."
        }, { quoted: mek });
    } catch (e) {
        console.log(e);
        return reply(`Error: ${e.message}`);
    }
});

//-----------------------------------------------Set Bio Of Bot-----------------------------------------------

cmd({
    pattern: "setbio",
    desc: "Set bot's profile bio.",
    react: "👤",
    use: '.setbio <New Bio>',
    category: "owner",
    filename: __filename
},
async (conn, mek, m, {
    from, args, reply
}) => {
    try {
        if (from !== config.ownerNumber || !config.BotNumber) return reply('You are not authorized to use this command.');

        if (args.length === 0) return reply('Please provide a bio text.');
        const bio = args.join(' ');
        await conn.updateProfileStatus(bio);
        return await reply('Profile bio updated successfully.');
    } catch (e) {
        console.log(e);
        return reply(`Error: ${e.message}`);
    }
});

cmd({
    pattern: "join",
    desc: "joins group by link",
    react: "👥",
    category: "owner",
    use: '<group link.>',
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname,isSachintha, isSavi, isSadas, isMani, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
if(!isOwner && !isSachintha && !isSavi && !isSadas && !isMani && !isMe)return;
try{  
    if(!isOwner) return //check owner
    if (!q) return reply('Please give me Group Link');
    if (!q.split(" ")[0] && !q.split(" ")[0].includes("whatsapp.com"))
       reply("Link Invalid, Please Send a valid whatsapp Group Link!");
    let result = q.split(" ")[0].split("https://chat.whatsapp.com/")[1];
    await conn.groupAcceptInvite(result)
        .then((res) => reply("🟩Joined Group"))
        .catch((err) => reply("Error in Joining Group"));
} catch (e) {
reply('Error !!')
l(e)
}
})

// Settings

cmd({
    pattern: "settings",
    alias: ["setting"],
    desc: "Get Bots Commands",
    react: "👥",
    category: "owner",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if(!isOwner) return
        return await conn.sendMessage(from, {
            image: { url: 'https://telegra.ph/file/e14efb3b113b8a9d8f407.jpg' },
            caption: '*Queen Spriky MD Settings* ⚙️\n\n*Chenge Prefix*\n.update PERFIX: {Your Prefix} (.,$#%&)\n\n*Auto Status Seen*\n.update AUTO_READ_STATUS: true or false\n\n*Mode*\n.update MODE: private, public, index or group'
        }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
})

