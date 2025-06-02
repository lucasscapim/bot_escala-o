const actionRegister = require('../../functions/register/actionRegisterModal');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { EmbedBuilder } = require('discord.js');

const interactionQueue = [];
let processing = false;

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function processQueue() {
    if (processing) return;
    if (interactionQueue.length === 0) return;

    processing = true;

    const { interaction, client } = interactionQueue.shift();

    try {
        // Aqui já deferimos a resposta no início, então podemos usar editReply


        const message = interaction.message;
        const embedAntiga = message.embeds[0];

        await interaction.editReply('⏳ Você entrou na fila, logo será adicionado na ação...\n🔍 Verificando seus dados no banco...');
        await delay(400);

        const result = await prisma.log.findFirst({
            where: { mensagemId: message.id }
        });

        if (!result) {
            await interaction.editReply('❌ Ação não encontrada no banco de dados.');
            processing = false;
            processQueue();
            return;
        }

        // Verifica se já está na ação
        if (result.membros.includes(interaction.user.id)) {
            await interaction.editReply('⚠️ Você já está participando desta ação.');
            processing = false;
            processQueue();
            return;
        }

        await interaction.editReply('⏳ Você entrou na fila, logo será adicionado na ação...\n🔍 Verificando seus dados no banco...\n💾 Atualizando banco de dados...');
        await delay(400);

        // Atualiza lista de membros
        const updatedMembers = [...result.membros, interaction.user.id];

        await prisma.log.updateMany({
            where: { mensagemId: message.id },
            data: { membros: updatedMembers }
        });

        await interaction.editReply('⏳ Você entrou na fila, logo será adicionado na ação...\n🔍 Verificando seus dados no banco...\n💾 Atualizando banco de dados...\n📝 Atualizando mensagem com os participantes...');
        await delay(400);

        const resultAction = await prisma.acao.findUnique({
            where: { id: result.acaoId }
        });

        const result2 = updatedMembers.map((id, index) => `${index + 1}. <@${id}>`).join('\n');
        const embedAtualizada = EmbedBuilder.from(embedAntiga).setDescription(
            `Ação selecionada: ${resultAction.nome}\n` +
            `Armamento: ${resultAction.armamento}\n` +
            `Categoria: ${resultAction.categoria}\n\n` +
            `Requisitos:\n\n` +
            `Minimo: ${resultAction.minParticip}\n` +
            `Máximo: ${resultAction.maxParticip}\n\n` +
            `Participantes: \n${result2}`
        );

        await message.edit({ embeds: [embedAtualizada] });

        await interaction.editReply(`⏳ Você entrou na fila, logo será adicionado na ação...\n🔍 Verificando seus dados no banco...\n💾 Atualizando banco de dados...\n📝 Atualizando mensagem com os participantes...\n✅ Você foi adicionado com sucesso na ação **${resultAction.nome}**.`);

    } catch (error) {
        console.error('[ERROR] Erro ao processar interação na fila:', error);
        try {
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ content: 'Erro interno, tente novamente.', ephemeral: true });
            } else {
                await interaction.editReply('Erro interno, tente novamente.');
            }
        } catch (_) { }
    } finally {
        processing = false;
        processQueue(); // processa próximo da fila
    }
}

module.exports = async (interaction, client) => {
    if (interaction.customId === 'addaction') {
        await actionRegister(interaction, client);
        return;
    }

    if (interaction.customId === 'entry_action') {
        try {
            await interaction.deferReply({ ephemeral: true }); // defere logo no começo
            interactionQueue.push({ interaction, client });
            await interaction.editReply('⏳ Você entrou na fila, logo será adicionado na ação...');
            processQueue();
        } catch (error) {
            console.error('[ERROR] Falha ao deferir interação:', error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ content: 'Erro ao processar, tente novamente.', ephemeral: true });
            }
        }
    }
};
