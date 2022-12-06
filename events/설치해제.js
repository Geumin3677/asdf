const client = require('../index')
const Schema = require('../models/뮤직셋업_리스트')
const { EmbedBuilder } = require('discord.js')
client.on('messageCreate', async (message) => {
    if (message.content !== '!설정해제') return
    try {
        message.reply(`뮤직설치가 해지되었습니다.`)
        await Schema.findOneAndDelete({ guildid: message.guild.id })
    } catch (err) { }
})