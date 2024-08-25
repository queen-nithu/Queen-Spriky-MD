const { cmd, commands } = require('../command');
const fg = require('api-dylux');
const yts = require('yt-search');
const axios = require('axios');
const { fetchJson } = require('../lib/functions');
const { search, download } = require('aptoide-scraper');
const { lookup } = require('mime-types');
const { mediafiredl } = require('@bochilteam/scraper');
const fs = require('fs');

// <========FETCH API URL========>
let baseUrl;
(async () => {
    let baseUrlGet = await fetchJson('https://raw.githubusercontent.com/prabathLK/PUBLIC-URL-HOST-DB/main/public/url.json');
    baseUrl = baseUrlGet.api;
})();

// -------- Song Download --------
cmd({
    pattern: 'song',
    desc: 'Download Songs',
    category: 'download',
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q) return reply('Please provide a URL or song name.');

        const search = await yts(q);
        const data = search.videos[0];
        const url = data.url;

        let desc = `*Queen Spriky Bot Song Downloader*

*Title:* ${data.title}
*Description:* ${data.description}
*Time:* ${data.timestamp}
*Ago:* ${data.ago}
*Views:* ${data.views}

> Developed By Udavin Wijesundara`;

        await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: desc }, { quoted: mek });

        // Download Audio
        let down = await fg.yta(url);
        let downloadUrl = down.dl_url;

        // Send Audio File
        await conn.sendMessage(from, { audio: { url:downloadUrl }, mimetype: 'audio/mpeg' }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply('An error occurred while processing your request.');
    }
});

// -------- Yt Video Download --------
cmd({
    pattern: 'video',
    desc: 'Download Video',
    category: 'download',
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q) return reply('Please provide a URL or song name.');

        const search = await yts(q);
        const data = search.videos[0];
        const url = data.url;

        let desc = `*Queen Spriky Bot Video Downloader*

*Title:* ${data.title}
*Description:* ${data.description}
*Time:* ${data.timestamp}
*Ago:* ${data.ago}
*Views:* ${data.views}

> Developed By Udavin Wijesundara`;

        await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: desc }, { quoted: mek });

        // Download Video
        let down = await fg.ytv(url);
        let downloadUrl = down.dl_url;

        // Send Video File
        await conn.sendMessage(from, { video: { url:downloadUrl }, mimetype: 'video/mp4' }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply('An error occurred while processing your request.');
    }
});

//Facebook Download

cmd({
    pattern: 'fb',
    desc: 'Download Facebook video',
    category: 'download',
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    if (args.length === 0) {
        return reply('Please provide a Facebook video URL.');
    }

    const videoUrl = args[0];
    const apiUrl = `https://api.prabath-md.tech/api/fdown?url=${videoUrl}`;

    try {
        const response = await axios.get(apiUrl);
        if (response.data.status === 'success ✅') {
            const videoLink = response.data.data.sd;
            const customCaption = `*Download By Queen Spriky WhatsApp Bot*`;

            await conn.sendMessage(from, {
                video: { url: videoLink },
                caption: customCaption
            }, { quoted: mek });
        } else {
            await reply('Failed to download the video. Please check the URL and try again.');
        }
    } catch (error) {
        console.error('Error downloading Facebook video:', error);
        await reply('An error occurred while downloading the video. Please try again later.');
    }
});

//Google Drive
cmd({
    pattern: 'gdrive',
    desc: 'Download Google Drive file',
    category: 'download',
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    const driveUrl = args.join(' ');

    if (!driveUrl) {
        return reply('Please provide a Google Drive file URL.\n\n> Example: .gdrive <file_url> 🙁');
    }

    const apiUrl = `https://api.prabath-md.tech/api/gdrivedl?url=${driveUrl}`;

    try {
        const response = await axios.get(apiUrl);
        if (response.data.status === 'success ✅') {
            const fileData = response.data.data;
            const customCaption = `*Download By Queen Spriky WhatsApp Bot*`;

            if (fileData.mimeType.startsWith('image/')) {
                await conn.sendMessage(from, {
                    image: { url: fileData.download },
                    caption: customCaption
                }, { quoted: m });
            } else if (fileData.mimeType.startsWith('video/')) {
                await conn.sendMessage(from, {
                    video: { url: fileData.download },
                    caption: customCaption
                }, { quoted: m });
            } else {
                await conn.sendMessage(from, {
                    document: { url: fileData.download, mimetype: fileData.mimeType, fileName: fileData.fileName },
                    caption: customCaption
                }, { quoted: mek });
            }
        } else {
            await reply('Failed to download the file. Please check the URL and try again.');
        }
    } catch (error) {
        console.error('Error downloading Google Drive file:', error);
        await reply('An error occurred while downloading the file. Please try again later.');
    }
});

// Twitter DL (X)
cmd({
    pattern: "twitter",
    alias: ["twdl"],
    desc: "download tw videos",
    category: "download",
    filename: __filename
},
async(conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q || !q.startsWith("https://")) return reply("Please provide a valid Twitter URL.");
        // Fetch data from API  
        let data = await fetchJson(`${baseUrl}/api/twitterdl?url=${q}`);
        reply("Downloading...");
        // Send video (HD, SD)
        await conn.sendMessage(from, { video: { url: data.data.data.HD }, mimetype: "video/mp4", caption: `- QUALITY HD\n\n> *Downloaded By Queen Spriky WhatsApp Bot*` }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});



