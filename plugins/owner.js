const config = require('../config');
const { cmd, commands } = require('../command');

//-----------------------------------------------Leave Group-----------------------------------------------

cmd({
    pattern: "leavegc",
    desc: "Make the bot leave the group.",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, {
    from, reply
}) => {
    try {
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
