const { getMoviesSearch } = require('sinhalasub.lk');
const { cmd, commands } = require('../command');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

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
