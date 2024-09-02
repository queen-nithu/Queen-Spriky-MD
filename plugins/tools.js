const config = require('../config');
const { cmd, commands } = require('../command');
const fetch = require('node-fetch');
const {fetchJson} = require('../lib/functions');
const axios = require('axios');

//-----------------------------------------------Calculator-----------------------------------------------

cmd({
    pattern: "calc",
    desc: "Calculate a mathematical expression.",
    use: ".calc <expression>",
    react: "🛠️",    
    category: "tools",
    filename: __filename
},
async (conn, mek, m, {
    from, args, quoted, body, isCmd, command, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply
}) => {
    try {
        if (args.length === 0) return reply('Please provide a mathematical expression.');

        const expression = args.join(' ');
        let result;

        try {
            result = new Function(`return ${expression}`)();
        } catch (e) {
            return reply('Invalid mathematical expression.');
        }

        return await conn.sendMessage(from, { text: `Result: ${result}` }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

//-----------------------------------------------Currency Converter-----------------------------------------------

cmd({
    pattern: "currency",
    desc: "Convert an amount from one currency to another.",
    use: ".currency <amount> <source currency> <target currency>",
    react: "🛠️", 
    category: "tools",
    filename: __filename
},
async (conn, mek, m, {
    from, args, quoted, body, isCmd, command, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply
}) => {
    try {
        if (args.length < 3) return reply('Please provide the amount, source currency, and target currency (e.g., 100 USD EUR).');

        const amount = parseFloat(args[0]);
        const fromCurrency = args[1].toUpperCase();
        const toCurrency = args[2].toUpperCase();
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
        const exchangeData = await response.json();

        if (exchangeData.rates[toCurrency]) {
            const convertedAmount = (amount * exchangeData.rates[toCurrency]).toFixed(2);
            return await conn.sendMessage(from, {
                text: `${amount} ${fromCurrency} is equal to ${convertedAmount} ${toCurrency}`
            }, { quoted: mek });
        } else {
            return reply(`Could not find conversion rate for: ${toCurrency}`);
        }
    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

//-----------------------------------------------Translate-----------------------------------------------

cmd({
    pattern: "translate",
    desc: "Translate text to another language.",
    react: "🛠️", 
    category: "tools",
    use: ".translate <language code> <text>",
    filename: __filename
},
async (conn, mek, m, { from, args, reply }) => {
    try {
        if (args.length < 2) return reply('Please provide a language code and text to translate.');
        const [languageCode, ...textArray] = args;
        const text = textArray.join(' ');
        
        // Validate language code (basic check for length, should be expanded based on needs)
        if (languageCode.length !== 2) return reply('Invalid language code. Use a 2-letter code (e.g., "es" for Spanish).');

        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${languageCode}`);
        const translation = await response.json();

        if (translation.responseData && translation.responseData.translatedText) {
            return await conn.sendMessage(from, { text: translation.responseData.translatedText }, { quoted: mek });
        } else {
            return reply('Translation failed. Please check the language code and text.');
        }
    } catch (e) {
        console.log(e);
        return reply(`Error: ${e.message}`);
    }
});
//.translate <language_code> <text>

//---------------------------------------------------------------Reverse Text-----------------------------------------------

cmd({
    pattern: "reverse",
    desc: "Reverse the provided text.",
    react: "🛠️", 
    use: ".reverse <text>",
    category: "tools",
    filename: __filename
},
async (conn, mek, m, {
    from, args, reply
}) => {
    try {
        if (args.length === 0) return reply('Please provide the text to reverse.');
        const text = args.join(' ');
        const reversedText = text.split('').reverse().join('');
        return await conn.sendMessage(from, {
            text: reversedText
        }, { quoted: mek });
    } catch (e) {
        console.log(e);
        return reply(`Error: ${e.message}`);
    }
});