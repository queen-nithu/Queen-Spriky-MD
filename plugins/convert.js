const { cmd, commands } = require('../command');
const { fetchJson } = require('../lib/functions');
const { lookup } = require('mime-types');
const fs = require('fs');
const path = require('path');
cmd({
    pattern: "sticker",
    desc: "Convert image or video to sticker.",
    react: "🖼️",
    category: "convert",
    filename: __filename
  },
  async (conn, mek, m, {
    from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, 
    botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, 
    participants, groupAdmins, isBotAdmins, isAdmins, reply
  }) => {
    try {
      // Check if the mimetype is an image, video, or webp
      if (!quoted || !quoted.mimetype || !/image|video|webp/i.test(quoted.mimetype)) {
        return reply("Please reply to an image or video to make a sticker.");
      }
      // Download the media content
      const buffer = await m.quoted.download();
  
      // Set the sticker metadata (exif)
      let exif;
      if (q) {
        const [name, author] = q.split("|");
        exif = {
          packName: name ? name : "Queen Spriky MD",
          packPublish: author ? author : "Udavin Wijesundara"
        };
      } else {
        exif = {
          packName: "Created by",
          packPublish: "@ Amira-MD"
        };
      }
  
      // Send the sticker
      conn.sendMessage(from, buffer, { quoted: mek, asSticker: true, ...exif });
  
    } catch (e) {
      console.log(e);
      reply("There was an error in the command!");
    }
  });
  