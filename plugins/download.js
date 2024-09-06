const { cmd, commands } = require('../command');
const { tiktokdl } = require('@bochilteam/scraper');
const getFbVideoInfo = require("fb-downloader-scrapper")
const { getMoviesSearch } = require('sinhalasub.lk');
const fg = require('api-dylux');
const yts = require('yt-search');
const axios = require('axios');
const fetch = require('node-fetch');
const { fetchJson } = require('../lib/functions');
const { lookup } = require('mime-types');
const fs = require('fs');
const { File } = require('megajs');
const path = require('path');


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
    react: "📥",
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

        // Send Document File
        await conn.sendMessage(from, { document: { url:downloadUrl }, caption: '*Queen Spriky MD*', mimetype: 'audio/mpeg', fileName:data.title + ".mp3"}, { quoted: mek });

        // Send Audio File
        //await conn.sendMessage(from, { audio: { url:downloadUrl }, caption: '*Queen Spriky MD*', mimetype: 'audio/mpeg'},{ quoted: mek });

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
    react: "📥",
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
        //Send As Document
        await conn.sendMessage(from, { document: { url:downloadUrl }, caption: '*Queen Spriky MD*', mimetype: 'video/mp4', fileName:data.title + ".mp4" }, { quoted: mek });
        //Send As Video
        //await conn.sendMessage(from, { video : { url:downloadUrl }, caption: '*Queen Spriky MD*', mimetype: 'video/mp4'},{ quoted: mek });

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
    react: "📥",
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
            const customCaption = `*Queen Spriky MD*`;

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
    react: "📥",
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
            const customCaption = `*Queen Spriky MD*`;

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
    react: "📥",
    category: "download",
    filename: __filename
},
async(conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q || !q.startsWith("https://")) return reply("Please provide a valid Twitter URL.");  
        let data = await fetchJson(`${baseUrl}/api/twitterdl?url=${q}`);
        reply("Downloading...");
        await conn.sendMessage(from, { video: { url: data.data.data.HD }, mimetype: "video/mp4", caption: `- QUALITY HD\n*Queen Spriky MD*` }, { quoted: mek });
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
    react: "📥",
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
            caption: `*Queen Spriky MD*`
        }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`${e.message || e}`);
    }
});

//Tiktok Download

cmd({
    pattern: "tiktok",
    desc: "Download TikTok videos using a URL.",
    use: ".tiktok <url>",
    react: "📥",
    category: "download",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply
}) => {
    try {
        if (!q || !q.startsWith("https://")) {
            reply("Please provide a valid TikTok URL.");
            return;
        }
        let data = await fetchJson(`https://prabath-md-api.up.railway.app/api/tiktokdlv2?url=${q}&apikey=eebc1d5060`);
        
        if (data.status !== "success ✅") {
            reply("Failed to download TikTok video.");
            return;
        }

        reply("🧚 Downloading TikTok video...");
        await conn.sendMessage(from, {
            video: { url: data.data.data.play },
            caption: `*Queen Spriky MD*`
        }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`${e.message || e}`);
    }
});

//Mega Download

cmd({
    pattern: 'mega',
    desc: 'Download files from Mega',
    use: '.mega <Mega URL>',
    react: "📥",
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

    if (file.size >= 500000000) { 
        return reply('Error: File size is too large (Maximum Size: 500MB)');
    }

    const downloadingMessage = `🌩️ Downloading file... Please wait.`;
    await reply(downloadingMessage);

    const caption = `*Queen Spriky MD*`;

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
    await conn.sendMessage(
        from,
        { document: data, mimetype: mimetype, fileName: file.name },
        { quoted: m, caption : '*Queen Spriky MD*' }
    );
} catch (error) {
    console.error('Error:', error.message);
    await reply(`Error: ${error.message}`);
}
});

//Gitclone

cmd({
    pattern: 'gitclone',
    desc: 'Clone a GitHub repository',
    use: '.gitclone <GitHub URL>',
    react: "📥",
    category: 'download',
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {

    const regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i;

    if (!args[0]) {
        return reply(`Example usage: .gitclone https://github.com/BochilGaming/games-wabot`);
    }

    if (!regex.test(args[0])) {
        return reply('Please provide a valid GitHub repository URL!');
    }

    let [_, user, repo] = args[0].match(regex) || [];
    repo = repo.replace(/.git$/, '');

    let url = `https://api.github.com/repos/${user}/${repo}/zipball`;

    await reply('*Please wait, sending the repository...*');

    try {
        let response = await fetch(url, { method: 'HEAD' });
        let contentDisposition = response.headers.get('content-disposition');
        
        let filename = contentDisposition ? contentDisposition.match(/attachment; filename=(.*)/)[1] : `${repo}.zip`;

        await conn.sendMessage(
            from,
            {
                document: { url: url },
                mimetype: 'application/zip',
                fileName: filename,
                caption: `*Repository ${user}/${repo} downloaded successfully!*`
            },
            { quoted: mek }
        );
    } catch (error) {
        console.error('Error downloading GitHub repository:', error);
        await reply(`❌ An error occurred: ${error.message}`);
    }
});

//Movie Download

cmd({
    pattern: 'movie',
    desc: 'Fetch movie details',
    use: '.movie <Movie Name>',
    category: 'search',
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, reply }) => {
    const movieName = args.join(' ');

    if (!movieName) {
        return reply('Please provide a movie name. Example: `.movie Thalainagaram`');
    }

    try {
        const { result } = await getMoviesSearch(movieName);

        if (!result) {
            return reply('No movie details found.');
        }

        const { title, imdb, date, category, description, image, dl_links } = result;

        let message = `*Title:* ${title}\n`;
        message += `*IMDB Rating:* ${imdb}\n`;
        message += `*Release Date:* ${date}\n`;
        message += `*Category:* ${category.join(', ')}\n`;
        message += `*Description:* ${description}\n\n`;

        await conn.sendMessage(
            from,
            {
                image: { url: image },
                caption: message
            },
            { quoted: mek }
        );

    } catch (error) {
        console.error('Error fetching movie details', error.message);
        await reply('An error occurred while fetching');
    }
});

// -------- APK Download --------
cmd({
    pattern: "apk",
    desc: "Download APK files using a package name.",
    use: ".apkdl <package_name>",
    react: "📦",
    category: "download",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply
}) => {
    try {
        if (!q) {
            reply("Please provide a valid APK package name.");
            return;
        }

        let data = await fetchJson(`https://prabath-md-api.up.railway.app/api/apkdl?q=${q}&apikey=eebc1d5060`);

        if (data.status !== "success ✅") {
            reply("Failed to fetch APK details.");
            return;
        }

        reply("📥 Downloading Apk...");

        const { icon, name, package: pkg, lastup, size, dllink } = data.data;

        await conn.sendMessage(from, {
            image: { url: icon },
            caption: `*APK Download*\n\n*Name*: ${name}\n*Package*: ${pkg}\n*Size*: ${size} MB\n*Last Updated*: ${lastup}\n\nDownloading the APK file...`
        }, { quoted: mek });

        await conn.sendMessage(from, {
            document: { url: dllink },
            mimetype: 'application/vnd.android.package-archive',
            fileName: `${name}.apk`,
            caption: `*Queen Spriky MD*`
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`${e.message || e}`);
    }
});

//Youtube Video Download

/*cmd({
    pattern: "ytmp4",
    desc: "Download YouTube videos using a URL.",
    use: ".ytmp4 <url>",
    react: "📥",
    category: "download",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply
}) => {
    try {
        if (!q || !q.startsWith("https://")) {
            reply("Please provide a valid YouTube URL.");
            return;
        }

        let data = await fetchJson(`https://prabath-md-api.up.railway.app/api/ytmp4?url=${q}&apikey=eebc1d5060`);
        
        if (data.status !== "success ✅") {
            reply("Failed to download YouTube video.");
            return;
        }
        let videoData = data.data.downloadUrl;

        reply("📥 Downloading YouTube video in the best available quality...");

        await conn.sendMessage(from, { video : { url:videoData }, caption: '*Queen Spriky MD*', mimetype: 'video/mp4'},{ quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`${e.message || e}`);
    }
});*/
