const { SlashCommandBuilder } = require('discord.js');
const { ActionRowBuilder, EmbedBuilder, ButtonStyle, ButtonBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('painel_config')
        .setDescription('Executa uma ação específica no bot'),

    async execute(interaction) {
        console.log('[DEBUG] Comando /painel_config executado');

        const embed = new EmbedBuilder()
            .setColor('#237feb')
            .setTitle('Configuração do Painel')
            .setDescription('Por favor, insira as informações necessárias para configurar o painel.');

        const confirm = new ButtonBuilder()
            .setCustomId('addaction')
            .setLabel('Adicionar Ação')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder()
            .addComponents(confirm);

        await interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: false
        });
    }
}