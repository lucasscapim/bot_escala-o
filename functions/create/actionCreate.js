const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const dotenv  = require('dotenv').config();
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

async function actionSelect(interaction, client) {

    const ESCALACAO_ID = process.env.ESCALACAO_ID;

    if (!ESCALACAO_ID) {
        console.error('[ERROR] ESCALACAO_ID não está definido no .env');
        return interaction.reply({
            content: 'Erro ao processar a ação. Por favor, contate o administrador.',
            ephemeral: true
        });
    }

    const canal_escalacao = await client.channels.fetch(ESCALACAO_ID).catch(err => {
        console.error(`[ERROR] Não foi possível encontrar o canal com ID ${ESCALACAO_ID}:`, err);
        return interaction.reply({
            content: 'Erro ao encontrar o canal de escalação. Por favor, contate o administrador.',
            ephemeral: true
        });
    })

    const acaoId = interaction.values[0].split('_')[1]; // Pega os valores selecionados como array
    console.log(`[DEBUG] Valores selecionados: ${interaction.values}`);

    const result = await prisma.acao.findUnique({
        where: {
            id: acaoId
        }
    });

    if (!result) {
        console.error(`[ERROR] Ação com ID ${acaoId} não encontrada.`);
        return interaction.reply({
            content: 'Erro ao encontar a ação selecionada. Por favor, contate o administrador.',
            ephemeral: true
        });
    }

    const embed = new EmbedBuilder()
        .setColor('#237feb')
        .setTitle('Relátorio de Ação')
        .setDescription(`Ação selecionada: ${result.nome}\n Armamento ${result.armamento} \n Categoria: ${result.categoria}\n \nRequisitos:\n\n Minimo: ${result.minParticip}\n Máximo: ${result.maxParticip}\n\n Participantes:\n`)
        .setFooter({ text: `ID da Ação: ${acaoId}` });

    const entrar_acao = new ButtonBuilder()
        .setCustomId('entry_action')
        .setLabel('Entrar na Ação')
        .setStyle(ButtonStyle.Primary);

    const sair_acao = new ButtonBuilder()
        .setCustomId('exit_action')
        .setLabel('Sair da Ação')
        .setStyle(ButtonStyle.Danger);

    console.log(`[DEBUG] Ação selecionada: ${result.nome}`);

    const row = new ActionRowBuilder()
        .addComponents(entrar_acao, sair_acao);

    const resposta = await canal_escalacao.send({
        embeds: [embed],
        components: [row]
    }).catch(err => {
        console.error(`[ERROR] Não foi possível enviar a mensagem no canal de escalação:`, err);
        return interaction.reply({
            content: 'Erro ao enviar a mensagem de ação. Por favor, contate o administrador.',
            ephemeral: true
        });
    });

    const action_db = await prisma.log.create({
            data: {
                acaoId: acaoId,
                //membros: [interaction.user.id],
                mensagemId: resposta.id,
            }
        });

    console.log(`[DEBUG] Resposta enviada para o usuário: ${resposta.id}`);

}

module.exports = { actionSelect };