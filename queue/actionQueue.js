const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { EmbedBuilder } = require('discord.js');

// const delay = (ms = 2000) => new Promise(resolve => setTimeout(resolve, ms));
const queues = new Map();

function addToQueue(interaction, client, type = 'toggle') {
    const messageId = interaction.message.id;

    if (!queues.has(messageId)) {
        queues.set(messageId, {
            queue: [],
            processing: false,
        });
    }

    const actionQueue = queues.get(messageId);
    actionQueue.queue.push({ interaction, client, type });

    processQueue(messageId);
}

async function processQueue(messageId) {
    const actionQueue = queues.get(messageId);
    if (!actionQueue || actionQueue.processing) return;
    if (actionQueue.queue.length === 0) return;

    actionQueue.processing = true;
    const { interaction, client, type: inputType } = actionQueue.queue.shift();

    let logMsg = '';

    const updateReply = async (line) => {
        logMsg += `${line}\n`;
        await interaction.editReply({ content: logMsg });
    };

    try {
        const message = interaction.message;
        const embedAntiga = message.embeds[0];

        await interaction.editReply('⏳ Processando sua solicitação...');
        await updateReply('<:db:1379782988031590430> Verificando seus dados no banco...');

        const result = await prisma.log.findFirst({ where: { mensagemId: message.id } });

        if (!result) {
            await updateReply('❌ Ação não encontrada no banco de dados.');
            actionQueue.processing = false;
            processQueue(messageId);
            return;
        }

        const resultAction = await prisma.acao.findUnique({ where: { id: result.acaoId } });

        if (!resultAction) {
            await updateReply('❌ Dados da ação não encontrados.');
            actionQueue.processing = false;
            processQueue(messageId);
            return;
        }

        let type = inputType;

        // Lógica do botão toggle
        const jaParticipa = result.membros.includes(interaction.user.id);

        if (type === 'toggle') {
            type = jaParticipa ? 'remove' : 'add';
        }

        if (type === 'add') {
            if (jaParticipa) {
                await updateReply('⚠️ Você já está participando desta ação.');
                actionQueue.processing = false;
                processQueue(messageId);
                return;
            }

            if (result.membros.length >= resultAction.maxParticip) {
                await updateReply('⚠️ Esta ação já atingiu o número máximo de participantes.');
                actionQueue.processing = false;
                processQueue(messageId);
                return;
            }

            await updateReply('<a:loading:1379072239613247571> Adicionando você à ação...');

            const updatedMembers = [...result.membros, interaction.user.id];
            await prisma.log.updateMany({
                where: { mensagemId: message.id },
                data: { membros: updatedMembers }
            });

            await updateReply('<:anexo:1379784100164010024> Atualizando mensagem...');

            const membrosList = updatedMembers.map((id, i) => `${i + 1}. <@${id}>`).join('\n');
            const embedAtualizada = EmbedBuilder.from(embedAntiga).setDescription(
                `Ação selecionada: ${resultAction.nome}\n` +
                `Armamento: ${resultAction.armamento}\n` +
                `Categoria: ${resultAction.categoria}\n\n` +
                `Requisitos:\n\n` +
                `Minimo: ${resultAction.minParticip}\n` +
                `Máximo: ${resultAction.maxParticip}\n\n` +
                `Participantes: \n${membrosList}`
            );

            await message.edit({ embeds: [embedAtualizada] });
            await updateReply(`<:confirm:1379784098394144808> Você foi **adicionado** com sucesso na ação **${resultAction.nome}**.`);

        } else if (type === 'remove') {
            if (!jaParticipa) {
                await updateReply('⚠️ Você **não está participando** desta ação.');
                actionQueue.processing = false;
                processQueue(messageId);
                return;
            }

            await updateReply('<a:loading:1379072239613247571> Removendo você da ação...');

            const updatedMembers = result.membros.filter(id => id !== interaction.user.id);
            await prisma.log.updateMany({
                where: { mensagemId: message.id },
                data: { membros: updatedMembers }
            });

            await updateReply('<:anexo:1379784100164010024> Atualizando mensagem...');

            const membrosList = updatedMembers.map((id, i) => `${i + 1}. <@${id}>`).join('\n') || '_Sem participantes no momento_';
            const embedAtualizada = EmbedBuilder.from(embedAntiga).setDescription(
                `Ação selecionada: ${resultAction.nome}\n` +
                `Armamento: ${resultAction.armamento}\n` +
                `Categoria: ${resultAction.categoria}\n\n` +
                `Requisitos:\n\n` +
                `Minimo: ${resultAction.minParticip}\n` +
                `Máximo: ${resultAction.maxParticip}\n\n` +
                `Participantes: \n${membrosList}`
            );

            await message.edit({ embeds: [embedAtualizada] });
            await updateReply(`<:confirm:1379784098394144808> Você foi **removido** com sucesso da ação **${resultAction.nome}**.`);
        }

    } catch (error) {
        console.error('[ERROR] Erro ao processar interação na fila:', error);
        try {
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ content: '❌ Erro interno, tente novamente.', ephemeral: true });
            } else {
                await updateReply('❌ Erro interno, tente novamente.');
            }
        } catch (_) {}
    } finally {
        actionQueue.processing = false;
        processQueue(messageId);
    }
}

module.exports = { addToQueue };
