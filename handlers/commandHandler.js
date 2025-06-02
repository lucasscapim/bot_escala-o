const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');

module.exports = (client) => {
    client.commands = new Map();

    const commands = [];
    const commandsPath = path.join(__dirname, '../commands');

    if (!fs.existsSync(commandsPath)) {
        console.warn('⚠️ Pasta "commands" não encontrada!');
        return;
    }

    // Função recursiva para pegar arquivos .js em subpastas
    function getAllCommandFiles(dir) {
        const files = fs.readdirSync(dir, { withFileTypes: true });
        let commandFiles = [];

        for (const file of files) {
            const filePath = path.join(dir, file.name);
            if (file.isDirectory()) {
                commandFiles = commandFiles.concat(getAllCommandFiles(filePath));
            } else if (file.name.endsWith('.js')) {
                commandFiles.push(filePath);
            }
        }

        return commandFiles;
    }

    const commandFiles = getAllCommandFiles(commandsPath);
    console.log(`📁 Encontrados ${commandFiles.length} arquivos de comando.`);

    for (const filePath of commandFiles) {
        try {
            const command = require(filePath);

            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
                commands.push(command.data.toJSON());
                console.log(`✅ Comando carregado: ${command.data.name}`);
            } else {
                console.warn(`⚠️ Arquivo ignorado (sem data ou execute): ${filePath}`);
            }
        } catch (err) {
            console.error(`❌ Erro ao carregar o comando em ${filePath}:`, err);
        }
    }

    console.log('📋 Comandos carregados:', [...client.commands.keys()]);

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

    (async () => {
        try {
            console.log('🔄 Registrando comandos na guild...');
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                { body: commands }
            );
            console.log('✅ Comandos registrados com sucesso!');
        } catch (error) {
            console.error('❌ Erro ao registrar comandos:', error);
        }
    })();
};
