const { MongoClient } = require('mongodb');

const uri = process.env.DATABASE_URL;
const client = new MongoClient(uri);

async function testConnection() {
    try {
        await client.connect();
        console.log('✅ Conectado ao MongoDB com MongoClient nativo!');

        // Você pode listar os bancos de dados para testar:
        const collections = await client.db('estudos').listCollections().toArray();
        console.log('Coleções no banco estudos:', collections.map(c => c.name));
    } catch (error) {
        console.error('❌ Erro ao conectar no MongoDB:', error);
    } finally {
        await client.close();
    }
}

// Só chame o teste em algum lugar para rodar
testConnection();
