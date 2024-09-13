const config = require('../config');
const { cmd, commands } = require('../command');
const fetch = require('node-fetch');
const {fetchJson} = require('../lib/functions');
const axios = require('axios');
const cheerio = require("cheerio");
//const { removeBg, shortenUrl, gtts } = require("../lib/");
const scraper = require("../lib/scraper");
const emailDataStore = {};

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

//Tempmail

cmd({
    pattern: "tempmail",
    desc: "Create temporary email address and use it as needed.",
    react: "📧",
    use: ".tempmail",
    category: "tools",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        if (!emailDataStore[sender]) {
            const newEmailData = await tempmail.create();
            if (!newEmailData || !newEmailData[0]) {
                return await reply("Request Denied!");
            }

            const [login, domain] = newEmailData[0].split("@");
            emailDataStore[sender] = { email: newEmailData[0], login, domain };
        }

        const emailInfo = emailDataStore[sender];
        await conn.sendMessage(from, {
            text: `NEW MAIL\n\nEMAIL: ${emailInfo.email}\nLOGIN: ${emailInfo.login}\nADDRESS: ${emailInfo.domain}\n`
        }, { quoted: mek });
    } catch (e) {
        console.log(e);
        return reply("Request Denied!");
    }
});

cmd({
    pattern: "checkmail",
    desc: "Check mails in your temporary email address.",
    react: "📧",
    use: ".checkmail",
    category: "tools",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        const emailInfo = emailDataStore[sender];
        if (!emailInfo || !emailInfo.email) {
            return await conn.sendMessage(from, { text: "_You Didn't Create Any Mail_" }, { quoted: mek });
        }

        const receivedMails = await tempmail.mails(emailInfo.login, emailInfo.domain);
        if (!receivedMails || receivedMails.length === 0) {
            return await conn.sendMessage(from, { text: "_EMPTY ➪ No Mails Here_" }, { quoted: mek });
        }

        for (const mail of receivedMails) {
            const emailContent = await tempmail.emailContent(emailInfo.login, emailInfo.domain, mail.id);
            if (emailContent) {
                const mailInfo = `From ➪ ${mail.from}\nDate ➪ ${mail.date}\nEMAIL ID ➪ [${mail.id}]\nSubject ➪ ${mail.subject}\nContent ➪ ${emailContent}`;
                await conn.sendMessage(from, { text: mailInfo }, { quoted: mek });
            }
        }
    } catch (e) {
        console.log(e);
        return reply("Request Denied!");
    }
});

cmd({
    pattern: "delmail",
    desc: "Delete temporary email address.",
    react: "❌",
    use: ".delmail",
    category: "tools",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        if (emailDataStore[sender]) {
            delete emailDataStore[sender];
            return await conn.sendMessage(from, { text: "_Deleted the email address._" }, { quoted: mek });
        } else {
            return await conn.sendMessage(from, { text: "No email address to delete." }, { quoted: mek });
        }
    } catch (e) {
        console.log(e);
        return reply("Request Denied!");
    }
});

const tempmail = {
    create: async () => {
        const url = "https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1";
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (e) {
            console.log(e);
            return null;
        }
    },

    mails: async (login, domain) => {
        const url = `https://www.1secmail.com/api/v1/?action=getMessages&login=${login}&domain=${domain}`;
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (e) {
            console.log(e);
            return null;
        }
    },

    emailContent: async (login, domain, id) => {
        const url = `https://www.1secmail.com/api/v1/?action=readMessage&login=${login}&domain=${domain}&id=${id}`;
        try {
            const response = await axios.get(url);
            const emailData = response.data;
            const htmlContent = emailData.htmlBody;

            const $ = cheerio.load(htmlContent);
            const textContent = $.text();
            return textContent;
        } catch (e) {
            console.log(e);
            return null;
        }
    }
};

//Short Url

cmd({
    pattern: "url",
    desc: "Shortens a provided URL.",
    react: "🔗",
    use: ".url <link>",
    category: "tools",
    filename: __filename
},
async (conn, mek, m, { from, args, reply }) => {
    try {
        const match = args.join(' ');
        
        if (!match) {
            return await reply("_Please provide a URL to shorten_");
        }

        await reply("_Shortening the link..._");

        const url = await scraper.shortenUrl(match);

        if (url) {
            const msg = `_Here's your shortened link: *${url}*_`;
            return await conn.sendMessage(from, { text: msg }, { quoted: mek });
        } else {
            return await reply("Failed to shorten the URL.");
        }
    } catch (e) {
        console.log(e);
        return reply(`Error: ${e.message}`);
    }
});


