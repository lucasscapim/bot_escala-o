const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const dotenv = require('dotenv').config();
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

async function actionSelect(interaction, client) {
    const nickname = interaction.user.nickname || interaction.user.username;

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
        .setDescription(`Ação selecionada: ${result.nome}\n Armamento ${result.armamento} \n Categoria: ${result.categoria}\n Minimo: ${result.minParticip}\n Máximo: ${result.maxParticip}\n\n Participantes:\n_Sem participantes no momento_\n\n`)
        .setFooter({ 
            iconURL: interaction.user.displayAvatarURL(), 
            text: `Ação criada por: ${nickname}` });

    const toggle_acao = new ButtonBuilder()
        .setCustomId('toggle_acao')
        .setLabel('Entrar/Sair da Ação') // Um único botão para ambos
        .setStyle(ButtonStyle.Primary);

    const vitoria_acao = new ButtonBuilder()
        .setCustomId('victory_action')
        .setLabel('Vitoria')
        .setStyle(ButtonStyle.Success);
    const derrota_acao = new ButtonBuilder()
        .setCustomId('defeat_action')
        .setLabel('Derrota')
        .setStyle(ButtonStyle.Danger);
    const cancelar_acao = new ButtonBuilder()
        .setCustomId('cancel_action')
        .setLabel('Cancelar Ação')
        .setStyle(ButtonStyle.Secondary);

    console.log(`[DEBUG] Ação selecionada: ${result.nome}`);

    const row = new ActionRowBuilder()
        .addComponents(toggle_acao);
    const row2 = new ActionRowBuilder()
        .addComponents(vitoria_acao, derrota_acao, cancelar_acao);
    console.log(`[DEBUG] Enviando mensagem de ação para o canal de escalação: ${canal_escalacao.id}`);

    interaction.reply({
        content: 'Ação selecionada com sucesso! Você pode ver os detalhes abaixo.',
        ephemeral: true
    });
    const resposta = await canal_escalacao.send({
        embeds: [embed],
        components: [row, row2]
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