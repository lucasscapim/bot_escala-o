const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

async function channelVictory(interaction, client) {

    const modalAction = new ModalBuilder()
        .setCustomId('channelVictoryModal')
        .setTitle('Canal de Vitória');

    const idChannel = new TextInputBuilder()
        .setCustomId('channelId')
        .setLabel('Id do Canal de Vitória')
        .setRequired(true)
        .setPlaceholder('Ex: 123456789012345678')
        .setStyle(TextInputStyle.Short);


    const row1 = new ActionRowBuilder().addComponents(idChannel);
    modalAction.addComponents(row1);

    await interaction.showModal(modalAction);
    console.log(`[DEBUG] MODAL ENVIADO: Config canal de vitoria por ${interaction.user.tag}`);


}

async function channelDefeat(interaction, client) {

    const modalAction = new ModalBuilder()
        .setCustomId('channelDefeatModal')
        .setTitle('Canal de Derrota');

    const idChannel = new TextInputBuilder()
        .setCustomId('channelId')
        .setLabel('Id do Canal de Derrota')
        .setRequired(true)
        .setPlaceholder('Ex: 123456789012345678')
        .setStyle(TextInputStyle.Short);


    const row1 = new ActionRowBuilder().addComponents(idChannel);
    modalAction.addComponents(row1);

    await interaction.showModal(modalAction);
    console.log(`[DEBUG] MODAL ENVIADO: Config canal de derrota por ${interaction.user.tag}`);


}

async function channelCancel(interaction, client) {

    const modalAction = new ModalBuilder()
        .setCustomId('channelCancelModal')
        .setTitle('Canal de Cancelamento');

    const idChannel = new TextInputBuilder()
        .setCustomId('channelId')
        .setLabel('Id do Canal de Cancelamento')
        .setRequired(true)
        .setPlaceholder('Ex: 123456789012345678')
        .setStyle(TextInputStyle.Short);


    const row1 = new ActionRowBuilder().addComponents(idChannel);
    modalAction.addComponents(row1);

    await interaction.showModal(modalAction);
    console.log(`[DEBUG] MODAL ENVIADO: Config canal de cancelamento por ${interaction.user.tag}`);


}

module.exports = {
    channelVictory,
    channelDefeat,
    channelCancel
};
