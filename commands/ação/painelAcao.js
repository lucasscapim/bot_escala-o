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
        const victory_channel = new ButtonBuilder()
            .setCustomId('victory_channel')
            .setLabel('Canal de Vitória')
            .setStyle(ButtonStyle.Primary);
        const defeat_channel = new ButtonBuilder()
            .setCustomId('defeat_channel')
            .setLabel('Canal de Derrota')
            .setStyle(ButtonStyle.Primary);
        const cancel_channel = new ButtonBuilder()
            .setCustomId('cancel_channel')
            .setLabel('Canal de Cancelamento')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder()
            .addComponents(confirm, victory_channel, defeat_channel, cancel_channel);

        await interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: false
        });
    }
}