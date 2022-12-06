const client = require('../index')
const Schema = require('../models/뮤직셋업_리스트')
const { EmbedBuilder } = require('discord.js')
client.on('messageCreate', async (message) => {
    if (message.content !== '!뮤직') return
    const find = await Schema.findOne({ guildid: message.guild.id });
    if (find) {
        const embed1 = new EmbedBuilder()
            .setTitle("뮤직셋업 시스템")
            .setDescription(`이미 서버에 뮤직이 등록되어있어요!\n<#${find.channelid}> 채널이 삭제되었나요? \`!설정해제\` 명령어를 이용해주세요!`)
        return message.reply({ embeds: [embed1] });
    }
    await message.guild.channels.create({ name: 'Music' }).then(result => {
        const gg = new EmbedBuilder()
            .setTitle('재생중인 노래가 없어요')
            .setDescription('**노래를 재생하시려면 통화방에 참가후 제목을 알려주세요!**')
        client.channels.cache.get(result.id).send({ embeds: [gg] }).then(tt => {
            const newData = new Schema({
                guildid: message.guild.id,
                channelid: result.id,
                messageid: tt.id
            });
            newData.save();
        })
        const embed = new EmbedBuilder()
            .setTitle("뮤직셋업 시스템")
            .setDescription(`성공적으로 '${message.guild.name}' 서버에 뮤직기능이 설치되었어요!`)
            .setFields({ name: `링크된 채널`, value: `<#${result.id}>` })
        message.reply({ embeds: [embed] });
    })
})