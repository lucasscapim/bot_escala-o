const { EmbedBuilder } = require('discord.js');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function identificarTamanhoCategoria(texto) {
    const normalizado = texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    if (/pequen|^p$|^peq$/.test(normalizado)) return "Pequena";
    if (/medi|^m$|^med$/.test(normalizado)) return "Média";
    if (/grand|gigant|^g$|^gr/.test(normalizado)) return "Grande";

    return "Desconhecida";
}

function extrairMinMaxParticipantes(input) {
    const limpo = input.replace(/[^0-9\-~a-z]/gi, '');
    const regex = /(\d+)[a-z\-~]*(\d+)/i;

    const match = limpo.match(regex);
    if (match) {
        const minimo = parseInt(match[1], 10);
        const maximo = parseInt(match[2], 10);
        return { minimo, maximo };
    }

    const unicoNumero = input.match(/\d+/);
    if (unicoNumero) {
        const valor = parseInt(unicoNumero[0], 10);
        return { minimo: valor, maximo: valor };
    }

    return { minimo: 0, maximo: 0 };
}

async function actionCreate(interaction) {
    const actionName = interaction.fields.getTextInputValue('actionNameInput');
    const actionLevel = interaction.fields.getTextInputValue('actionLevelInput');
    const actionDescription = interaction.fields.getTextInputValue('actionDescriptionInput');
    const actionNumber = interaction.fields.getTextInputValue('actionNumberInput');
    const actionFire = interaction.fields.getTextInputValue('actionFireInput');

    const categoria = identificarTamanhoCategoria(actionLevel);
    const { minimo, maximo } = extrairMinMaxParticipantes(actionNumber);

    console.log(`[DEBUG] Ação criada: ${actionName} - ${actionDescription} - ${actionFire} - Categoria: ${categoria} - Participantes: ${minimo} a ${maximo}`);

    await prisma.acao.create({
        data: {
            nome: actionName,
            categoria: categoria,
            descricao: actionDescription,
            minParticip: minimo,
            maxParticip: maximo,
            armamento: actionFire
        }
    });

    const embed = new EmbedBuilder()
        .setColor('#237feb')
        .setTitle('✔ Ação Criada')
        .setDescription('Nova ação adicionada com sucesso ao sistema!\nEm até 1 minuto será liberada para uso de todos os oficiais!')
        .addFields(
            { name: '🔖 Nome', value: actionName, inline: true },
            { name: '📌 Categoria', value: actionLevel, inline: true },
            { name: '📑 Descrição', value: actionDescription },
            { name: '👮🏻‍♂️ Participantes', value: `${minimo} - ${maximo}`, inline: true },
            { name: '🔫 Armamentos', value: actionFire, inline: true }
        )
        .setFooter({ text: `Ação criada por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

    await interaction.reply({
        embeds: [embed],
        ephemeral: true
    });
}

module.exports = { actionCreate };
