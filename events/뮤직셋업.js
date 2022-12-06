const client = require('../index')
const Schema = require("../models/뮤직셋업_리스트")
client.on("channelDelete", async function (channel) {
    try {
        const chid = channel.id
        const jbid = await Schema.findOne({ guildid: channel.guild.id })
        if (!jbid) return
        const ch = jbid.channelid
        if (chid == ch) {
            await Schema.findOneAndDelete({ channelid: chid })
        }
    } catch (err) { }
});