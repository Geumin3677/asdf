const { Player } = require("discord-player");
const client = require("./index.js");

const player = new Player(client, {
    ytdlOptions: {
        filter: 'audioonly',
        quality: "highestaudio",
        highWaterMark: 32 * 1024 * 1024,
    },
});

module.exports = player;