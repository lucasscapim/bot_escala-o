const { actionCreate } = require('../../functions/register/actionRegister');
const channelConfig = require('../../functions/config/channelConfig');

module.exports = async (interaction, client) => {
    if (!interaction.isModalSubmit()) return;
    console.log(`[MODAL] ${interaction.customId} enviado por ${interaction.user.tag}`);
    if (interaction.customId === 'actionModal') {
        await actionCreate(interaction);
    }

    if (interaction.customId === 'channelVictoryModal') {
        await channelConfig(interaction, 'victory');
    }
    if (interaction.customId === 'channelDefeatModal') {
        await channelConfig(interaction, 'defeat');
    }
    if (interaction.customId === 'channelCancelModal') {
        await channelConfig(interaction, 'cancel');
    }
};
