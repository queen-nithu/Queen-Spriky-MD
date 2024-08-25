const config = require('../config');
const { cmd, commands } = require('../command');


//---------------------------------------------Random Fact ----------------------------------------

cmd({
    pattern: "fact",
    desc: "Get a random fun fact.",
    category: "random",
    filename: __filename
},
async (conn, mek, m, {
    from, reply
}) => {
    try {
        const response = await fetch('https://uselessfacts.jsph.pl/random.json?language=en');
        const factData = await response.json();
        return await conn.sendMessage(from, {
            text: `*Fun Fact:*\n\n${factData.text}`
        }, { quoted: mek });
    } catch (e) {
        console.log(e);
        return reply(`Error: ${e.message}`);
    }
});


//---------------------------------------------Random Joke ----------------------------------------

cmd({
    pattern: "joke",
    desc: "Get a random joke.",
    category: "random",
    filename: __filename
},
async (conn, mek, m, {
    from, reply
}) => {
    try {
        const response = await fetch('https://official-joke-api.appspot.com/random_joke');
        const joke = await response.json();
        const jokeText = `${joke.setup}\n\n${joke.punchline}`;
        return await conn.sendMessage(from, {
            text: jokeText
        }, { quoted: mek });
    } catch (e) {
        console.log(e);
        return reply(`Error: ${e.message}`);
    }
});

//---------------------------------------------Random Quote ----------------------------------------

cmd({
    pattern: "quote",
    desc: "Get a random inspirational quote.",
    category: "random",
    filename: __filename
},
async (conn, mek, m, {
    from, reply
}) => {
    try {
        const response = await fetch('https://api.quotable.io/random');
        const quote = await response.json();
        const quoteText = `"${quote.content}"\n- ${quote.author}`;
        return await conn.sendMessage(from, {
            text: quoteText
        }, { quoted: mek });
    } catch (e) {
        console.log(e);
        return reply(`Error: ${e.message}`);
    }
});
