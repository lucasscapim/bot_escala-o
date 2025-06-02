const { actionCreate } = require('../../functions/register/actionRegister');

module.exports = async (interaction, client) => {
    console.log(`[MODAL] ${interaction.customId} enviado por ${interaction.user.tag}`);
    if (interaction.customId === 'actionModal') {
        await actionCreate(interaction);
    }
};
