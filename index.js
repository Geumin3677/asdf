//메인
const { Client, Collection, EmbedBuilder } = require('discord.js')
const client = new Client({ intents: [131071] })
const { token } = require('./config.json')
client.login(token)
module.exports = client;

//모듈
const fs = require('fs')
const player = require('./pleyer')

process.on('uncaughtException', (err) => {
    console.error(err);
});
process.on("unhandledRejection", err => {
    console.error(err)
})

const mongoose = require("mongoose")
mongoose.connect(`mongodb+srv://eee:eee@cluster0.srjd9hj.mongodb.net`, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(console.log("✅ | 데이터베이스 연결 완료"))

//버튼 핸들
client.buttonCommands = new Collection()
const buttonsCommands = fs.readdirSync("./buttons");

for (const commandFile of buttonsCommands) {
    const command = require(`./buttons/${commandFile}`);
    client.buttonCommands.set(command.id, command);
}
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;
    const command = client.buttonCommands.get(interaction.customId);
    if (!command) return;
    try {
        await command.run(interaction);
    } catch (err) {
        console.error(err);
    }
})

const eventFiles = fs.readdirSync(`./events`).filter(file => file.endsWith('.js'));
eventFiles.forEach(file => {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.run(...args));
    } else {
        client.on(event.name, async (...args) => await event.run(...args));
    }
})

//최종가동
client.on('ready', async () => {
    console.log(`✅ | ${client.user.tag}가동완료`);
})

const comma = require('comma-number')
const { getYouTubeThumbnail } = require("yt-vimeo-thumbnail/dist/youtube/getYouTube");
player.on("trackStart", (queue, track) => {
    let playl = new EmbedBuilder()
        .setTitle("🎶 노래를 재생합니다! 🎶")
        .setURL(`${track.url}`)
        .setDescription(`` + `\`${track.title}\`` + `(이)가 지금 재생되고 있습니다!`)
        .setFields(
            { name: `길이`, value: `${track.duration}`, inline: true },
            { name: `조회수`, value: `${comma(track.views)}`, inline: true },
            { name: `게시자`, value: `${track.author}`, inline: true },
        )
        .setThumbnail(getYouTubeThumbnail(`${track.url}`))
    queue.metadata.send({ embeds: [playl] })
})