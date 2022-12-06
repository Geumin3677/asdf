const client = require('../index')
const { EmbedBuilder } = require('discord.js');
client.on("messageCreate", async (message) => {
    if(message.content.startsWith('!청소'))
    try {
        const args = message.content.slice(3).trim().split(/ +/)
        const messagechannel = message.channel
        const count = parseInt(args[0]) + 1;
        const embed = new EmbedBuilder()
        if (isNaN(args[0])) return await message.reply({ embeds: [embed.setDescription(`1에서 100의 숫자를 입력해주세요.`)] })
        if (count < 0 || count > 101) return await message.reply({ embeds: [embed.setDescription(`1에서 100의 숫자를 입력해주세요.`)] })
        await messagechannel.bulkDelete(count, true).then((count) => {
            message.channel.send({
                embeds: [
                    embed
                        .setDescription(`정상적으로 청소가 완료되었습니다.`)
                        .setFields(
                            { name: `🧹입력한 메시지`, value: `${args[0]}`, inline: true },
                            { name: `🧹청소된 메시지 갯수`, value: `${count.size}`, inline: true },
                        )
                ]
            }).then((msg) => setTimeout(() => { msg.delete() }, 2000))
        })
    } catch (err) { }
})