const config = require('../config');
const { sleep } = require('../lib/functions');
const fs = require('fs');

module.exports = async (client, update) => {
    const groupId = update.id;
    const metadata = await client.groupMetadata(groupId);
    const groupName = metadata.subject;

    if (update.participants.length > 0) {
        const addedParticipants = [];
        const removedParticipants = [];

        for (let participant of update.participants) {
            if (update.action === 'add') {
                addedParticipants.push(participant);
            } else if (update.action === 'remove') {
                removedParticipants.push(participant);
            }
        }

        // Handle added participants (Welcome message)
        if (addedParticipants.length > 0) {
            const mentions = addedParticipants.map(participant => `@${participant.split('@')[0]}`).join(', ');
            const welcomeMessage = `👋 Welcome ${mentions} to *${groupName}*!\nFeel free to introduce yourself!`;

            await client.sendMessage(
                groupId,
                { image: { url: "https://i.ibb.co/syhDNs1/welcome.jpg" }, caption: welcomeMessage, mentions: addedParticipants }
            );
        }

// Handle removed participants (Goodbye message)
        if (removedParticipants.length > 0) {
            const mentions = removedParticipants.map(participant => `@${participant.split('@')[0]}`).join(', ');
            const welcomeMessage = `Goodbye ${mentions}, you will be missed!`;

            await client.sendMessage(
                groupId,
                { image: { url: "https://i.ibb.co/PDYV7mT/good-byee.jpg" }, caption: welcomeMessage, mentions: addedParticipants }
            );
        }
    }
};
