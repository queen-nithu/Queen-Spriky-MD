const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

module.exports = {
    SESSION_ID: process.env.SESSION_ID || 'ZUY0HAzb#zsIoifSfClx3lQhDFx3P6lsk45dwvgNJmT2fJTsotH4', // Enter Your Session ID
    MONGODB: process.env.MONGODB || 'mongodb+srv://udavin56:1234@cluster0.urhma.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',    // Enter Your MongoDB URL
    Owner: process.env.OwnerNumber || '94762498519',    // Enter Your Owner Number
    BotNumber: process.env.BotNumber || '911111111'    // Enter Your Bot Number
};
