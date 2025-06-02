const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder, StringSelectMenuOptionBuilder
} = require('discord.js');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup_escalacao')
        .setDescription('Permite iniciar o processo de escalação de ações'),

    async execute(interaction) {
        console.log('[DEBUG] Comando /setup_escalacao executado');

        const acoes = await prisma.acao.findMany({
            where: { categoria: 'Pequena' }
        });

        const acoesMedias = await prisma.acao.findMany({
            where: { categoria: 'Média' }
        });

        const acoesGrandes = await prisma.acao.findMany({
            where: { categoria: 'Grande' }
        });
        if (acoes.length === 0 && acoesMedias.length === 0 && acoesGrandes.length === 0) {
            return interaction.reply({
                content: 'Nenhuma ação cadastrada. Por favor, cadastre ações antes de iniciar uma escalação.',
                ephemeral: true
            });
        }
        // Cria as opções para o select menu
        const optionsPeq = acoes.map(acao => ({
            label: acao.nome,
            value: `acao_${acao.id}`,
            description: acao.descricao || 'Sem descrição',
            emoji: '🟢',
        }));

        const optionsMed = acoesMedias.map(acao => ({
            label: acao.nome,
            value: `acao_${acao.id}`,
            description: acao.descricao || 'Sem descrição',
            emoji: '🟡',
        }));

        const optionsGra = acoesGrandes.map(acao => ({
            label: acao.nome,
            value: `acao_${acao.id}`,
            description: acao.descricao || 'Sem descrição',
            emoji: '🔴',
        }));

        const embed = new EmbedBuilder()
            .setColor('#237feb')
            .setTitle('Sistema de Ações')
            .setDescription('Selecione a baixo qual ação deseja iniciar!\n📌 **Instruções**\n\nApenas Cabo+ pode declarar derrota/vitória.\nApenas Sargento+ pode cancelar qualquer ação.\nCrie apenas uma escalação para cada ação.\n\n🟢 Ações Pequenas\n🟡 Ações Médias\n🔴 Ações Grandes');

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('acoes_pequenas')
            .setPlaceholder('🟢 Ações Pequenas')
            .addOptions(optionsPeq);

        const selectMenuMédia = new StringSelectMenuBuilder()
            .setCustomId('acoes_medias')
            .setPlaceholder('🟡 Ações Médias')
            .addOptions(optionsMed);

        const selectMenuGrande = new StringSelectMenuBuilder()
            .setCustomId('acoes_grandes')
            .setPlaceholder('🔴 Ações Grandes')
            .addOptions(optionsGra);

        const row = new ActionRowBuilder().addComponents(selectMenu);
        const row2 = new ActionRowBuilder().addComponents(selectMenuMédia);
        const row3 = new ActionRowBuilder().addComponents(selectMenuGrande);
        interaction.reply({
            embeds: [embed],
            components: [row, row2, row3],
            ephemeral: false
        });
    }
};


