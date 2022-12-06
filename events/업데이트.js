const client = require('../index')
const Discord = require("discord.js");
const player = require('../pleyer')
const Schema = require('../models/뮤직셋업_리스트')
const comma = require('comma-number')
const { getYouTubeThumbnail } = require("yt-vimeo-thumbnail/dist/youtube/getYouTube");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
        .setCustomId("m_play")
        .setLabel("재개")
        .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
        .setCustomId("m_skip")
        .setLabel("스킵")
        .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
        .setCustomId("m_pause")
        .setLabel("일시정지")
        .setStyle(ButtonStyle.Success),
);

player.on("trackStart", async (queue, track) => {
    if (!queue.guild) return;
    const find = await Schema.findOne({ guildid: queue.guild.id });
    const gdid = queue.guild.id
    if (find) {
        const queue = player.getQueue(gdid);
        const currentTrack = queue.current;
        const tracks = queue.tracks.slice(0, 10).map((m, i) => {
            return `${i + 1}. **${m.title}** ([link](${m.url}))`;
        });

        const chid = find.channelid
        const msgid = find.messageid

        const channel = client.channels.cache.get(chid)
        const msg = await channel.messages.fetch(msgid, { cache: true });

        return void await msg.edit({
            embeds: [
                new Discord.EmbedBuilder()
                    .setTitle('지금 재생중인 노래')
                    .setDescription(`**${currentTrack.title}** ([link](${currentTrack.url}))
                    
대기중인 노래
${tracks.join("\n")}${queue.tracks.length > tracks.length
                            ? `\n...${queue.tracks.length - tracks.length === 1 ? `${queue.tracks.length - tracks.length} more track` : `${queue.tracks.length - tracks.length} more tracks`}`
                            : ""}`)
                    .setImage(getYouTubeThumbnail(`${track.url}`))
            ], components: [row]
        })
    }
})
player.on("trackAdd", async (queue, track) => {
    if (!queue.guild) return;
    const find = await Schema.findOne({ guildid: queue.guild.id });
    const gdid = queue.guild.id
    if (find) {
        const queue = player.getQueue(gdid);
        const currentTrack = queue.current;
        const tracks = queue.tracks.slice(0, 10).map((m, i) => {
            return `${i + 1}. **${m.title}** ([link](${m.url}))`;
        });

        const chid = find.channelid
        const msgid = find.messageid

        const channel = client.channels.cache.get(chid)
        const msg = await channel.messages.fetch(msgid, { cache: true });

        return void await msg.edit({
            embeds: [
                new Discord.EmbedBuilder()
                    .setTitle('지금 재생중인 노래')
                    .setDescription(`**${currentTrack.title}** ([link](${currentTrack.url}))
                    
대기중인 노래
${tracks.join("\n")}${queue.tracks.length > tracks.length
                            ? `\n...${queue.tracks.length - tracks.length === 1 ? `${queue.tracks.length - tracks.length} more track` : `${queue.tracks.length - tracks.length} more tracks`}`
                            : ""}`)
            ]
        })
    }
})
player.on("queueEnd", async (queue, track) => {
    if (!queue.guild) return;
    const find = await Schema.findOne({ guildid: queue.guild.id });
    if (find) {
        const chid = find.channelid
        const msgid = find.messageid
        const channel = client.channels.cache.get(chid)
        const msg = await channel.messages.fetch(msgid, { cache: true });
        await msg.edit({
            embeds: [
                new Discord.EmbedBuilder()
                    .setTitle('재생중인 노래가 없어요')
                    .setDescription('**노래를 재생하시려면 통화방에 참가후 제목을 알려주세요!**')
            ], components: []
        })
    }
})