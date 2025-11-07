const axios = require('axios');
const fs = require('fs');

const API_URL = process.env.API_URL || 'http://localhost:4545';
const API_KEY = process.env.API_KEY || 'sua-chave-secreta';

async function testarGeracao() {
  console.log('🧪 Testando geração de PDF...\n');
  
  const testData = {
    nome: 'Adonias Santos',
    email: 'teste@email.com',
    predominante: 'TEMPO',
    menosDesenvolvido: 'ACAO',
    pontuacoes: {
      PESSOAS: 37,
      ACAO: 18,
      TEMPO: 41,
      MENSAGEM: 38
    }
  };
  
  console.log('📊 Dados do teste:');
  console.log(JSON.stringify(testData, null, 2));
  console.log('');
  
  try {
    console.log('📡 Enviando requisição para:', `${API_URL}/gerar-pdf`);
    
    const response = await axios.post(`${API_URL}/gerar-pdf`, testData, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      responseType: 'arraybuffer',
      timeout: 60000
    });
    
    const filename = `teste_${Date.now()}.pdf`;
    fs.writeFileSync(filename, response.data);
    
    console.log('✅ PDF gerado com sucesso!');
    console.log(`📄 Arquivo salvo: ${filename}`);
    console.log(`📦 Tamanho: ${(response.data.length / 1024).toFixed(2)} KB`);
    
  } catch (error) {
    console.error('❌ Erro ao gerar PDF:');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados:', error.response.data);
    } else if (error.request) {
      console.error('Sem resposta do servidor');
      console.error('Verifique se a API está rodando em', API_URL);
    } else {
      console.error(error.message);
    }
    
    process.exit(1);
  }
}

// Teste do health check
async function testarHealth() {
  console.log('🏥 Testando health check...\n');
  
  try {
    const response = await axios.get(`${API_URL}/health`);
    console.log('✅ API está online!');
    console.log('Status:', response.data);
    console.log('');
    return true;
  } catch (error) {
    console.error('❌ API não está respondendo');
    console.error('Verifique se a aplicação está rodando em', API_URL);
    return false;
  }
}

// Executar testes
(async () => {
  const isHealthy = await testarHealth();
  
  if (isHealthy) {
    await testarGeracao();
  } else {
    console.log('\n💡 Para iniciar a aplicação, execute:');
    console.log('   npm start\n');
    process.exit(1);
  }
})();
