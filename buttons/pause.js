const player = require('../pleyer')
const { EmbedBuilder } = require('discord.js')
module.exports = {
    id: "m_pause",
    async run(interaction) {
        const nickname = interaction.member.nickname || interaction.member.user
        const queue = player.getQueue(interaction.guild.id);
        if (!queue || !queue.playing) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`${interaction.user}\n재생되고 있는 노래가 없습니다`
                    )]
        })
        if (interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`${interaction.user}\n봇이 있는 음성 채널에 들어가 주십시오.`
                    )]
        })
        const paused = queue.setPaused(true);
        let pausedembed = new EmbedBuilder()
            .setTitle("⏸️ 일시정지 ⏸️")
            .setDescription(`\`${queue.current.title}\`(이)가 일시정지 되었습니다`)
        interaction.reply({ embeds: [pausedembed] })
    },
};