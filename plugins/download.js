const { cmd, commands } = require('../command');
const { tiktokdl } = require('@bochilteam/scraper');
const fg = require('api-dylux');
const yts = require('yt-search');
const axios = require('axios');
const { fetchJson } = require('../lib/functions');
const { lookup } = require('mime-types');
const fs = require('fs');
const { File } = require('megajs');

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
    use: '.song <Song Name>',
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
        await conn.sendMessage(from, { document: { url:downloadUrl }, caption: 'Downloaded By Queen Spriky WhatsApp Bot', mimetype: 'audio/mpeg', fileName:data.title + ".mp3"}, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply('An error occurred while processing your request.');
    }
});

// -------- Yt Video Download --------
cmd({
    pattern: 'video',
    desc: 'Download Video',
    use: '.video <Video Name>',
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

        let down = await fg.ytv(url);
        let downloadUrl = down.dl_url;
        await conn.sendMessage(from, { document: { url:downloadUrl }, caption: 'Downloaded By Queen Spriky WhatsApp Bot', mimetype: 'video/mp4', fileName:data.title + ".mp4" }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply('An error occurred while processing your request.');
    }
});

//Facebook Download

cmd({
    pattern: 'fb',
    desc: 'Download Facebook video',
    use: '.fb <Video URL>',
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
    use: '.gdrive <file_url>',
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
    desc: "download tw videos",
    use: ".twitter <url>",
    category: "download",
    filename: __filename
},
async(conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q || !q.startsWith("https://")) return reply("Please provide a valid Twitter URL.");  
        let data = await fetchJson(`${baseUrl}/api/twitterdl?url=${q}`);
        reply("Downloading...");
        await conn.sendMessage(from, { video: { url: data.data.data.HD }, mimetype: "video/mp4", caption: `- QUALITY HD\n\n> *Downloaded By Queen Spriky WhatsApp Bot*` }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});


//mediafire dl
cmd({
    pattern: "mediafire",
    desc: "Download files from Mediafire using a URL.",
    use: ".mediafire <url>",
    category: "download",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber,botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName,participants, groupAdmins, isBotAdmins, isAdmins, reply
}) => {
    try {
        if (!q || !q.startsWith("https://")) {
            reply("Please provide a valid Mediafire URL.");
            return;
        }
        let data = await fetchJson(`${baseUrl}/api/mediafiredl?url=${q}`);
        reply("🧚 Downloading...");
        await conn.sendMessage(from, {
            document: { url: data.data.link_1 },
            fileName: data.data.name,
            mimetype: data.data.file_type,
            caption: `*Downloaded By Queen Spriky WhatsApp Bot*`
        }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`${e.message || e}`);
    }
});

//Tiktok Download

cmd({
    pattern: 'tiktok',
    desc: 'Download TikTok video',
    use: '.tiktok <Video URL>',
    category: 'download',
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    
    const tiktokUrl = args.join(' ');

    if (!tiktokUrl) {
        return reply('*Please provide a TikTok video URL.*');
    }

    if (!tiktokUrl.match(/tiktok/gi)) {
        return reply('*Please provide a valid TikTok video URL.*');
    }

    const oldTime = new Date();
    const replyMessage = `⌛ Downloading TikTok video...`;
    await reply(replyMessage);

    try {
        const { author, video, description } = await tiktokdl(tiktokUrl);
        const videoUrl = video.no_watermark2 || video.no_watermark || 'https://tikcdn.net' + video.no_watermark_raw || video.no_watermark_hd;

        if (!videoUrl) {
            return reply('*Failed to fetch TikTok video.*');
        }

        const mimeType = await lookup(videoUrl);

        // Sending the video
        await conn.sendMessage(
            from,
            {
                video: { url: videoUrl },
                mimetype: mimeType || 'video/mp4',
                caption: `*Downloaded By Queen Spriky WhatsApp Bot*`
            },
            { quoted: mek }
        );

    } catch (error) {
        console.error('Error handling TikTok command:', error);
        await reply(`❌ An error occurred: ${error.message}`);
    }
});

//Mega Download
cmd({
    pattern: 'mega',
    desc: 'Download files from Mega',
    use: '.mega <Mega URL>',
    category: 'download',
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    const megaUrl = args.join(' ');

    if (!megaUrl) {
        return reply(`${command} <Mega URL>`);
    }

    try {
        const file = File.fromURL(megaUrl);
        await file.loadAttributes();

        if (file.size >= 500000000) { // 500MB limit
            return reply('Error: File size is too large (Maximum Size: 500MB)');
        }

        const downloadingMessage = `🌩️ Downloading file... Please wait.`;
        await reply(downloadingMessage);

        const caption = `*_Successfully downloaded..._*\nFile: ${file.name}\nSize: ${formatBytes(file.size)}`;

        const data = await file.downloadBuffer();
        const fileExtension = path.extname(file.name).toLowerCase();

        const mimeTypes = {
            '.mp4': 'video/mp4',
            '.pdf': 'application/pdf',
            '.zip': 'application/zip',
            '.rar': 'application/x-rar-compressed',
            '.7z': 'application/x-7z-compressed',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
        };

        let mimetype = mimeTypes[fileExtension] || 'application/octet-stream';

        await conn.sendFile(from, data, file.name, caption, m, null, { mimetype, asDocument: true });
    } catch (error) {
        console.error('Error:', error.message);
        await reply(`Error: ${error.message}`);
    }
});

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}