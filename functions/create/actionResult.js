const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const configPath = path.resolve(__dirname, '../../config.json');

async function actionResult(interaction, client, type) {
    const message = interaction.message;
    const embedAntiga = message.embeds[0];
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const nickname = interaction.member?.nickname || interaction.user.username;

    const baseFooter = embedAntiga.footer?.text || `Ação criada por: ${nickname}`;
    const baseIcon = embedAntiga.footer?.iconURL || interaction.user.displayAvatarURL();

    const actions = {
        victory: {
            status: 'VITORIA',
            color: '#00ff00',
            suffix: 'Vitória',
            canal: config.CANAL_VITORIA,
            successMsg: 'Vitória registrada com sucesso!',
            logPrefix: 'vitórias'
        },
        defeat: {
            status: 'DERROTA',
            color: '#ff0000',
            suffix: 'Derrota',
            canal: config.CANAL_DERROTA,
            successMsg: 'Derrota registrada com sucesso!',
            logPrefix: 'derrotas'
        },
        cancel: {
            status: 'CANCELADA',
            color: '#FFA500',
            suffix: 'Cancelada',
            canal: config.CANAL_CANCELADA,
            successMsg: 'Cancelamento registrado com sucesso!',
            logPrefix: 'cancelamentos'
        }
    };

    const action = actions[type];

    if (!action) {
        console.warn(`[WARN] Tipo de ação inválido: ${type}`);
        return;
    }

    switch (type) {
        case "victory":
            await prisma.log.updateMany({
                where: { mensagemId: message.id },
                data: { status: "VITORIA" },
            });
            break;

        case "defeat":
            await prisma.log.updateMany({
                where: { mensagemId: message.id },
                data: { status: "DERROTA" },
            });
            break;

        case "cancel":
            await prisma.log.updateMany({
                where: { mensagemId: message.id },
                data: { status: "CANCELADA" },
            });
            break;

        default:
            console.warn("Tipo inválido");
    }

    console.log(`[BUTTON] Ação de ${type} iniciada por ${interaction.user.tag}`);

    const embed = new EmbedBuilder()
        .setTitle(`${embedAntiga.title} - ${action.suffix}`)
        .setDescription(`${embedAntiga.description}\n\n${action.suffix} confirmada por: ${nickname}`)
        .setColor(action.color)
        .setFooter({ text: baseFooter, iconURL: baseIcon });

    if (!action.canal) {
        console.warn(`[WARN] ID do canal de ${action.logPrefix} não definido no config.json`);
        return;
    }

    try {
        const logChannel = await client.channels.fetch(action.canal);
        if (logChannel?.isTextBased()) {
            const msg = await logChannel.send({ embeds: [embed] });

            await interaction.message.delete();

            await interaction.reply({
                content: `${action.successMsg} ${msg.url}`,
                ephemeral: true
            });

            console.log(`[DEBUG] Embed enviado para canal de ${action.logPrefix} (${logChannel.id})`);
        } else {
            console.warn(`[WARN] O canal de ${action.logPrefix} definido não é de texto ou não foi encontrado.`);
        }
    } catch (err) {
        console.error(`[ERROR] Falha ao enviar embed para canal de ${action.logPrefix}: `, err);
    }
}

module.exports = actionResult;
