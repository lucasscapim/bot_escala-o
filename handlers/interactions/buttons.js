const actionRegister = require('../../functions/register/actionRegisterModal');
const { addToQueue } = require('../../queue/actionQueue');
const { channelVictory, channelDefeat, channelCancel } = require('../../functions/config/channelConfigModal');
const actionResult = require('../../functions/create/actionResult');

module.exports = async (interaction, client) => {
    if (interaction.customId === 'addaction') {
        await actionRegister(interaction, client);
        return;
    }

    if (interaction.customId === 'toggle_acao') {
        await interaction.deferReply({ ephemeral: true });
        addToQueue(interaction, client, 'toggle');
    }

    if (interaction.customId === 'victory_channel') {
        await channelVictory(interaction, client);
        return;
    }
    if (interaction.customId === 'defeat_channel') {
        await channelDefeat(interaction, client);
        return;
    } 
    if (interaction.customId === 'cancel_channel') {
        await channelCancel(interaction, client);
        return;
    }
    if (interaction.customId === 'victory_action') {
        actionResult(interaction, client, 'victory');
        return;
    }
    if (interaction.customId === 'defeat_action') {
        actionResult(interaction, client, 'defeat');
        return;
    }
    if (interaction.customId === 'cancel_action') {
        actionResult(interaction, client, 'cancel');
        return;
    }

};
