const client = require('../index')
const Discord = require("discord.js");
const player = require('../pleyer')
const Schema = require('../models/뮤직셋업_리스트')
const comma = require('comma-number')
const { getYouTubeThumbnail } = require("yt-vimeo-thumbnail/dist/youtube/getYouTube");
const { QueryType } = require("discord-player");
/**
 * const msg = message.channel.fetchMessage(msgId);
msg.edit(embed);
 */
client.on("messageCreate", async (message) => {
    if (!message.guild) return
    const find = await Schema.findOne({ guildid: message.guild.id, channelid: message.channel.id });
    if (message.author.bot) {
        return
    } else if (find) {
        if (message.author.id == '884041068646105161') return message.reply('어쩔 님 거부임')
        const query = message.content

        if (!query)
            return message.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setDescription(`${message.author}\n음악 이름을 알려주세요`)
                ]
            });

        if (!message.member || !message.member.voice.channel)
            return message.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setDescription(`${message.author}\n먼저 음성 채널에 가입하세요`)
                ]
            });

        if (message.guild.members.me.voice.channel) {
            if (message.member.voice.channel.id !== message.guild.members.me.voice.channel.id)
                return message.reply({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setDescription(`${message.author}\n봇이 다른 채널에서 사용되고 있습니다`)
                    ]
                });
        }

        const searchResult = await player
            .search(query, {
                requestedBy: message.author,
                searchEngine: QueryType.AUTO,
            })
            .catch(() => { });

        if (!searchResult || !searchResult.tracks.length)
            return message.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setDescription(`${message.author}\n검색된 결과가 없습니다`)
                ]
            });

        const queue = await player.createQueue(message.guild, {
            metadata: message.channel,
        });

        try {
            if (!queue.connection) await queue.connect(message.member.voice.channel);
        } catch (error) {
            player.deleteQueue(message.guild.id);
            return message.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setDescription(`${message.author}\n음성 채널에 참여할 수 없습니다`)
                ]
            });
        }
        let playembed = new Discord.EmbedBuilder()
            .setTitle("🎶 노래를 재생목록에 추가합니다! 🎶")
            .setURL(`${searchResult.tracks[0].url}`)
            .setDescription(`\`${searchResult.tracks[0].title}\`` + `(이)가 재생목록에 추가되었습니다!`)
            .setFields(
                { name: `길이`, value: `${searchResult.tracks[0].duration}`, inline: true },
                { name: `조회수`, value: `${comma(searchResult.tracks[0].views)}`, inline: true },
                { name: `게시자`, value: `${searchResult.tracks[0].author}`, inline: true },
                { name: `링크`, value: `[유튜브](${searchResult.tracks[0].url})`, inline: true },
            )
            .setThumbnail(getYouTubeThumbnail(`${searchResult.tracks[0].url}`))
        message.channel.send({ embeds: [playembed] });
        searchResult.playlist
            ? queue.addTracks(searchResult.tracks)
            : queue.addTrack(searchResult.tracks[0]);
        if (!queue.playing) await queue.play();
    }
})