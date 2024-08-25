const config = require('../config')
const {readEnv} = require('../lib/database')
const {cmd , commands} = require('../command')
const {sleep} = require('../lib/functions')
const os = require("os")
const {runtime} = require('../lib/functions')
const { search } = require('yt-search')

//-----------------------------------------------Alive-----------------------------------------------
cmd({
    pattern: "alive",
    desc: "Check bot online or no.",
    category: "general",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
return await conn.sendMessage(from,{image: {url:'https://telegra.ph/file/f4af749bf80a481856828.jpg'},caption: 'Hi Queen Spriky WhatsApp Bot Is Alive!\nType *.menu* To See All Commands.\nOwner Number: ${config.owner} Join Our WhatsApp Group\nhttps://chat.whatsapp.com/Jx2dvOAzNaO3vm5bwVglyC'},{quoted: mek})
}catch(e){
console.log(e)
reply(`${e}`)
}
})

//-----------------------------------------------Restart Bot-----------------------------------------------
cmd({
    pattern: "restart",
    desc: "restart the bot",
    category: "general",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
if(!isOwner) return //check owner
const {exec} = require("child_process")
reply("Bot Restarting...")
await sleep(1500)
exec("pm2 restart all")
}catch(e){
console.log(e)
reply(`${e}`)
}
})

//-----------------------------------------------Menu-----------------------------------------------

cmd({
    pattern: "menu",
    desc: "Show list of available commands.",
    category: "gerenal",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply
}) => {
    try {
        const config = await readEnv();
        let menu = {
            general: '',
            download: '',
            group: '',
            owner: '',
            convert: '',
            search: '',
            ai: '',
            games: '',
            tools: '',
            random: '',

        };

        for (let i = 0; i < commands.length; i++) {
            if (commands[i].pattern && !commands[i].dontAddCommandList) {
            menu[commands[i].category] += `${config.PREFIX}${commands[i].pattern}\n`;
             }
            }

        let madeMenu = `*Hello ${pushname} 👋*

*Bot Name* : Queen Spriky Bot
*Owner Name* : Udavin Wijesundara
*Prefix* : ${config.PREFIX}
*Uptime:* ${runtime(process.uptime())}
*Ram usage:* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${(os.totalmem() / 1024 / 1024).toFixed(2)}MB
*HostName:* ${os.hostname()}

        
> *GENERAL COMMANDS 🙂‍↕️*

${menu.general}

> *DOWNLOAD COMMANDS 📥*

${menu.download}

> *GROUP COMMANDS 🤠*

${menu.group}

> *OWNER COMMANDS 😎*

${menu.owner}

> *CONVERT COMMANDS 😇*

${menu.convert}

> *SEARCH COMMANDS 🔎*

${menu.search}

> *AI COMMANDS 🤖*

${menu.ai}

> *GAMES COMMANDS 🎯*

${menu.games}

> *TOOLS COMMANDS ⚒️*

${menu.tools}

> *RANDOM COMMANDS 🤫*

${menu.random}

*QUEEN SPRIKY WHATSAPP BOT*
         `

         await conn.sendMessage(from,{image:{url:"https://i.ibb.co/02zxH1Y/menu.jpg"},caption:madeMenu},{quoted:mek})

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});

//-----------------------------------------------System-----------------------------------------------
cmd({
    pattern: "system",
    alias: ["status", "botinfo", "host"],
    desc: "Check uptime, memory, cpu, platform and more.",
    category: "general",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        let status = `*Uptime:* ${runtime(process.uptime())}
*Ram usage:* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${(os.totalmem() / 1024 / 1024).toFixed(2)}MB
*HostName:* ${os.hostname()}
*Developer:* Udavin Wijesundara
`;

        return reply(status);
    } catch (e) {
        console.error(e);
        await reply(`❌ An error occurred: ${e.message}`);
    }
});