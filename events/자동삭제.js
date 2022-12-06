const client = require('../index')
client.on("messageCreate", async (message) => {
    if (!message.guild) return
    const Schema = require('../models/뮤직셋업_리스트')
    const find = await Schema.findOne({ guildid: message.guild.id, channelid: message.channel.id });
    if (find) {
        setTimeout(() => {
            message.delete()
        }, 5000);
    }
})