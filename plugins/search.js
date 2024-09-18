const config = require('../config');
const { cmd, commands } = require('../command');
const fetch = require('node-fetch');
const {fetchJson} = require('../lib/functions');
const axios = require('axios');
let gis = require("g-i-s");
const moment = require('moment-timezone')
const yts = require('yt-search');
const scraper = require("../lib/scraper");
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
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
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

//Yt Search
const formatViews = (views) => {
    if (views >= 1_000_000_000) {
        return `${(views / 1_000_000_000).toFixed(1)}B`;
    } else if (views >= 1_000_000) {
        return `${(views / 1_000_000).toFixed(1)}M`;
    } else if (views >= 1_000) {
        return `${(views / 1_000).toFixed(1)}K`;
    } else {
        return views.toString();
    }
};

const thumbnailUrl = 'https://i.ibb.co/c1QBRbG/bot-logo.jpg';

cmd({
    pattern: "yts",
    desc: "Search and display up to 10 YouTube video details",
    category: "search",
    react: "🔎",
    use: ".yts <query>",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("Please type a Name or Url... 🤖");

        const search = await yts(q);
        const videos = search.videos.slice(0, 10); // Get only the first 100 videos

        if (videos.length === 0) return reply("No videos found for your query.");

        let message = `*QUEEN SPRIKY MD SEARCH RESSULTS 🎥*\n\n`;

        videos.forEach((data, index) => {
            message += `*No - ${index + 1} ⤵*\n`;
            message += `🎶 *𝗧𝗶𝘁𝗹𝗲*: _${data.title}_\n`;
            message += `👤 *𝗖𝗵𝗮𝗻𝗻𝗲𝗹*: _${data.author.name}_\n`;
            message += `📝 *𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻*: _${data.description}_\n`;
            message += `⏳ *𝗧𝗶𝗺𝗲*: _${data.timestamp}_\n`;
            message += `⏱️ *𝗔𝗴𝗼*: _${data.ago}_\n`;
            message += `👁️‍🗨️ *𝗩𝗶𝗲𝘄𝘀*: _${formatViews(data.views)}_\n`;
            message += `🔗 *𝗟𝗶𝗻𝗸*: ${data.url}\n\n`;
        });

        message += `*𝗛𝗼𝘄 𝗧𝗼 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱 𝗩𝗶𝗱𝗲𝗼 𝗢𝗿 𝗔𝘂𝗱𝗶𝗼 ✅*\n\n`;
        message += `Example -  .video (enter video title)\n`;
        message += `Example - .song (enter video title)\n\n`;

        await conn.sendMessage(from, { image: { url: thumbnailUrl }, caption: message }, { quoted: mek });

    } catch (e) {
        console.log(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
    }
});





