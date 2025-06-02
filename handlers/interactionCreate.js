const { EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const handleButtons = require('./interactions/buttons');
const handleModals = require('./interactions/modals');
const handleSelect = require('./interactions/selects');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    name: 'interactionCreate',

    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            console.log('[DEBUG] Nome do comando:', interaction.commandName);

            const command = client.commands.get(interaction.commandName);
            if (!command) {
                console.log('[WARN] Comando não encontrado na coleção:', interaction.commandName);
                return;
            }

            try {
                console.log(`[CMD] /${interaction.commandName} usado por ${interaction.user.tag}`);

                await command.execute(interaction, client);
            } catch (error) {
                console.error('Erro ao executar comando:', error);
                if (!interaction.replied) {
                    await interaction.reply({
                        content: '❌ Ocorreu um erro ao executar este comando.',
                        ephemeral: true
                    });
                }
            }
        }
        if (interaction.isStringSelectMenu()) return handleSelect(interaction, client);
        if (interaction.isButton()) return handleButtons(interaction, client);
        if (interaction.isModalSubmit()) return handleModals(interaction, client);
    }
};
