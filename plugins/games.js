const config = require('../config');
const { cmd, commands } = require('../command');

//---------------------------Trivia---------------------------------------------
cmd({
    pattern: "trivia",
    desc: "Get a random trivia question.",
    use: '.trivia',
    category: "games",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const response = await fetch('https://opentdb.com/api.php?amount=1');
        const trivia = await response.json();
        if (trivia.results && trivia.results.length > 0) {
            const question = trivia.results[0];
            const triviaText = `*Category:* ${question.category}\n*Difficulty:* ${question.difficulty}\n\n*Question:* ${question.question}\n\n*Type:* ${question.type}`;
            return await conn.sendMessage(from, { text: triviaText }, { quoted: mek });
        } else {
            return reply('No trivia questions found.');
        }
    } catch (e) {
        console.log(e);
        return reply(`Error: ${e.message}`);
    }
});
