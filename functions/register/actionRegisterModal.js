const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

async function actionRegister(interaction, client) {

    const modalAction = new ModalBuilder()
        .setCustomId('actionModal')
        .setTitle('Adicionar Nova Ação');

    const nameAction = new TextInputBuilder()
        .setCustomId('actionNameInput')
        .setLabel('Nome da Ação')
        .setPlaceholder('Ex: Banco Central')
        .setStyle(TextInputStyle.Short);

    const levelAction = new TextInputBuilder()
        .setCustomId('actionLevelInput')
        .setLabel('Categoria (Pequena, Média, Grande)')
        .setPlaceholder('Ex: Pequena, Média, Grande')
        .setStyle(TextInputStyle.Short);

    const descriptionAction = new TextInputBuilder()
        .setCustomId('actionDescriptionInput')
        .setLabel('Descrição da Ação')
        .setPlaceholder('Ex: Roubo de Banco, Assalto a Metrô')
        .setStyle(TextInputStyle.Paragraph);

    const numberAction = new TextInputBuilder()
        .setCustomId('actionNumberInput')
        .setLabel('Min/Max Participantes (formato: Min, Max)')
        .setPlaceholder('Ex: 1, 10')
        .setStyle(TextInputStyle.Short);

    const fireAction = new TextInputBuilder()
        .setCustomId('actionFireInput')
        .setLabel('Armamentos Ação')
        .setPlaceholder('Ex: Fuzil, Pistola')
        .setStyle(TextInputStyle.Short);

    const row1 = new ActionRowBuilder().addComponents(nameAction);
    const row2 = new ActionRowBuilder().addComponents(levelAction);
    const row3 = new ActionRowBuilder().addComponents(descriptionAction);
    const row4 = new ActionRowBuilder().addComponents(numberAction);
    const row5 = new ActionRowBuilder().addComponents(fireAction);
    modalAction.addComponents(row1, row2, row3, row4, row5);

    await interaction.showModal(modalAction);
    console.log(`[DEBUG] MODAL ENVIADO: Criar ação por ${interaction.user.tag}`);
}

module.exports = actionRegister;