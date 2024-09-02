const config = require('../config');
const { cmd, commands } = require('../command');
const fetch = require('node-fetch');
const {fetchJson} = require('../lib/functions');
const axios = require('axios');
let gis = require("g-i-s");
const moment = require('moment-timezone')

//-----------------------------------------------------------------Wiki-----------------------------------------------

cmd({
    pattern: "wiki",
    desc: "Search Wikipedia for information.",
    use: ".wiki <query>",
    category: "search",
    react: "🔎",  
    filename: __filename
},
async (conn, mek, m, { from, args, reply }) => {
    try {
        if (args.length === 0) return reply('Please provide a search query.');
        const query = args.join(' ');
        const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
        const result = await response.json();
        if (result.title && result.extract) {
            const wikiText = `*${result.title}*\n\n${result.extract}\n\nRead more: ${result.content_urls.desktop.page}`;
            return await conn.sendMessage(from, { text: wikiText }, { quoted: mek });
        } else {
            return reply('No results found.');
        }
    } catch (e) {
        console.log(e);
        return reply(`Error: ${e.message}`);
    }
});

//---------------------------------------------------------------------------
cmd({
        pattern: "couplepp",
        category: "search",
        react: "🔎",
        desc: "Sends two couples pics.",
        filename: __filename,
    },
    async(Void, citel, text) => {
        let anu = await fetchJson('https://raw.githubusercontent.com/iamriz7/kopel_/main/kopel.json')
        let random = anu[Math.floor(Math.random() * anu.length)]
        Void.sendMessage(citel.chat, { image: { url: random.male }, caption: `Couple Male` }, { quoted: citel })
        Void.sendMessage(citel.chat, { image: { url: random.female }, caption: `Couple Female` }, { quoted: citel })
    }
)