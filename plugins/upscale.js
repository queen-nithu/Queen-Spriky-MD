const { cmd, commands } = require('../command');
const axios = require('axios');
const FormData = require('form-data');
const jimp = require('jimp');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

async function upscale(buffer, size = 2, anime = false) {
    try {
        return await new Promise((resolve, reject) => {
            if (!buffer) return reject("undefined buffer input!");
            if (!Buffer.isBuffer(buffer)) return reject("invalid buffer input");
            if (!/(2|4|6|8|16)/.test(size.toString())) return reject("invalid upscale size!");
            jimp.read(Buffer.from(buffer)).then(image => {
                const { width, height } = image.bitmap;
                let newWidth = width * size;
                let newHeight = height * size;
                const form = new FormData();
                form.append("name", "upscale-" + Date.now());
                form.append("imageName", "upscale-" + Date.now());
                form.append("desiredHeight", newHeight.toString());
                form.append("desiredWidth", newWidth.toString());
                form.append("outputFormat", "png");
                form.append("compressionLevel", "none");
                form.append("anime", anime.toString());
                form.append("image_file", buffer, {
                    filename: "upscale-" + Date.now() + ".png",
                    contentType: 'image/png',
                });
                axios.post("https://api.upscalepics.com/upscale-to-size", form, {
                    headers: {
                        ...form.getHeaders(),
                        origin: "https://upscalepics.com",
                        referer: "https://upscalepics.com"
                    }
                }).then(res => {
                    const data = res.data;
                    if (data.error) return reject("something error from upscaler api!");
                    resolve({
                        status: true,
                        imageUrl: data.bgRemoved
                    });
                }).catch(reject);
            }).catch(reject);
        });
    } catch (e) {
        return { status: false, message: e };
    }
}

cmd({
    pattern: 'upscale',
    desc: 'Upscale an image by a given size',
    react: "🆙", 
    category: 'tools',
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, command, args, reply }) => {
    try {
        if (!m.quoted.imageMessage) return reply('Please reply to an image with the command and provide an upscale size (e.g., 2, 4, 6, etc.).');
        let size = parseInt(args[0]) || 2;
        let anime = args.includes('anime');

        const buffer = await m.quoted.download();
        const { status, imageUrl, message } = await upscale(buffer, size, anime);

        if (!status) return reply(`Upscaling failed: ${message}`);

        const tempFile = path.join(__dirname, `${uuidv4()}.png`);
        const writer = fs.createWriteStream(tempFile);

        const response = await axios({
            url: imageUrl,
            method: 'GET',
            responseType: 'stream'
        });

        response.data.pipe(writer);

        writer.on('finish', async () => {
            await conn.sendMessage(from, { image: fs.readFileSync(tempFile), caption: 'Image successfully upscaled!' }, { quoted: mek });

            fs.unlink(tempFile, (err) => {
                if (err) console.error('Failed to delete temporary file:', err);
            });
        });

        writer.on('error', () => {
            reply('Failed to process the upscaled image.');
        });

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
        reply('An error occurred while processing your request.');
    }
});

module.exports = { upscale };
