const player = require('../pleyer')
const { EmbedBuilder } = require('discord.js')
module.exports = {
    id: "m_play",
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
        const paused = queue.setPaused(false);
        let pausedembed = new EmbedBuilder()
            .setTitle("⏯️ 재개 ⏯️")
            .setDescription(`\`${queue.current.title}\`(이)가 재개 되고 있습니다`)
        interaction.reply({ embeds: [pausedembed] })
    },
};