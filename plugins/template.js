/*const config = require('../config')
const {cmd , commands} = require('../command')

cmd({
    pattern: "any name",
    desc: "Check bot online or no.",
    react: "🔎",  
    category: "any category",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{

}catch(e){
    console.log(e)
    reply(`${e}`)
    }
    })*/

//====================================================================================================

/*Get Values From MONGODB

const config = require('../config')
const {cmd , commands} = require('../command')
const {readEnv} = require('../lib/database')

cmd({
    pattern: "any name",
    desc: "Check bot online or no.",
    category: "any category",
    react: "🔎",  
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{

const config = await readEnv();

${config.PREFIX}

}catch(e){
    console.log(e)
    reply(`${e}`)
    }
    })*/