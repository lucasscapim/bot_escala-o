const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { dotenv } = require('dotenv').config();
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

const { actionSelect } = require('../../functions/create/actionCreate');

module.exports = async (interaction, client) => {
    console.log(`[SELECT] ${interaction.customId} selecionado por ${interaction.user.tag}`);

    await actionSelect(interaction, client);
}