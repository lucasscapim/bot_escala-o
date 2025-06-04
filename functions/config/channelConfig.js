const { EmbedBuilder } = require('discord.js');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const configPath = path.resolve(__dirname, '../../config.json');

async function channelConfig(interaction, type) {
    try {
        if (type === 'victory') {
            const canalId = interaction.fields.getTextInputValue('channelId');

            const file = fs.readFileSync(configPath, 'utf8');
            const config = JSON.parse(file);
            config.CANAL_VITORIA = canalId;

            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));


            const embed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('Canal de Vitória')
                .setDescription('Atualizado o canal de vitória com sucesso!\n Lembre-se de que o canal de vitória é usado para registrar vitórias em ações.\n Canal: <#' + canalId + '>')
                .setFooter({ text: `Configuração feita por ${interaction.user.tag}` });

            console.log(`[DEBUG] Canal de vitória atualizado para ${canalId} por ${interaction.user.tag}`);

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        else if (type === 'defeat') {
            const canalId = interaction.fields.getTextInputValue('channelId');

            const file = fs.readFileSync(configPath, 'utf8');
            const config = JSON.parse(file);
            config.CANAL_DERROTA = canalId;

            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));


            const embed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('Canal de Derrota')
                .setDescription('Atualizado o canal de derrota com sucesso!\n Lembre-se de que o canal de derrota é usado para registrar derrotas em ações.\nCanal: <#' + canalId + '>')
                .setFooter({ text: `Configuração feita por ${interaction.user.tag}` });

            console.log(`[DEBUG] Canal de derrota atualizado para ${canalId} por ${interaction.user.tag}`);

            return interaction.reply({ embeds: [embed], ephemeral: true });
        } else if (type === 'cancel') {
            const canalId = interaction.fields.getTextInputValue('channelId');

            const file = fs.readFileSync(configPath, 'utf8');
            const config = JSON.parse(file);
            config.CANAL_CANCELADA = canalId;

            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));


            const embed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('Canal de Cancelamento')
                .setDescription('Atualizado o canal de ação cancelada com sucesso!\n Lembre-se de que o canal de cancelamento é usado para registrar cancelamentos em ações.\nCanal: <#' + canalId + '>')
                .setFooter({ text: `Configuração feita por ${interaction.user.tag}` });

            console.log(`[DEBUG] Canal de cancelamento atualizado para ${canalId} por ${interaction.user.tag}`);

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        else {
            return interaction.reply({
                content: 'Tipo de configuração inválido. Por favor, tente novamente.',
                ephemeral: true
            });
        }
    }

    catch (error) {
        console.error(`[ERROR] Erro ao atualizar o canal de vitória: ${error.message}`);
        return interaction.reply({
            content: 'Erro ao atualizar o canal de vitória. Por favor, tente novamente mais tarde.',
            ephemeral: true
        });
    }
}

module.exports = channelConfig