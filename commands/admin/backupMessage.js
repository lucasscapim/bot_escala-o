const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const generateHTML = require('../../utils/generateHTML.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('backup')
    .setDescription('Faz backup das mensagens deste canal e gera um arquivo HTML'),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const channel = interaction.channel;
    const messagesBackup = [];
    let lastMessageId;

    try {
      while (true) {
        const options = { limit: 100 };
        if (lastMessageId) options.before = lastMessageId;

        const messages = await channel.messages.fetch(options);
        if (messages.size === 0) break;

        for (const msg of messages.values()) {
          messagesBackup.push({
            id: msg.id,
            author: msg.author.tag,
            avatar: msg.author.displayAvatarURL({ extension: 'png', size: 64 }),
            content: msg.content,
            createdAt: msg.createdAt.toISOString(),
            editedAt: msg.editedAt ? msg.editedAt.toISOString() : '',
            attachments: msg.attachments.size > 0 ? msg.attachments.map(a => a.url).join(', ') : '',
            reactions: msg.reactions.cache.size > 0
              ? msg.reactions.cache.map(r => `${r.emoji.name} (${r.count})`).join(', ')
              : '',
            embeds: msg.embeds.map(embed => ({
              title: embed.title || '',
              description: embed.description || '',
              url: embed.url || '',
              image: embed.image?.url || '',
              thumbnail: embed.thumbnail?.url || '',
              fields: embed.fields || []
            }))
          });
        }

        lastMessageId = messages.last().id;
      }

      generateHTML(messagesBackup);
      await interaction.editReply('✅ Backup concluído! O arquivo `backup.html` foi gerado com sucesso.');
    } catch (err) {
      console.error('❌ Erro durante o backup:', err);
      await interaction.editReply('❌ Ocorreu um erro ao fazer o backup.');
    }
  }
};
