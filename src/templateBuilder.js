const fs = require('fs').promises;
const path = require('path');

// Carregar dados JSON
let conteudosBase = null;
let relatorios = null;

async function loadData() {
  if (!conteudosBase) {
    const capaPath = path.join(__dirname, '../data/conteudos_base.json');
    conteudosBase = JSON.parse(await fs.readFile(capaPath, 'utf-8'));
  }

  if (!relatorios) {
    const relPath = path.join(__dirname, '../data/relatorios.json');
    relatorios = JSON.parse(await fs.readFile(relPath, 'utf-8'));
  }
}

// Converter imagem para base64
async function imageToBase64(imagePath) {
  const imageBuffer = await fs.readFile(imagePath);
  return `data:image/png;base64,${imageBuffer.toString('base64')}`;
}

// Mapear nome do perfil para título
function getPerfilTitulo(predominante, menosDesenvolvido) {
  const titulos = {
    'PESSOAS': 'Orientado para Pessoas (Relacional)',
    'ACAO': 'Orientado para Ação (Processo)',
    'TEMPO': 'Orientado para Tempo (Solução imediata)',
    'MENSAGEM': 'Orientado para Mensagem (Conteúdo/Analítico)'
  };

  return {
    predominante: titulos[predominante] || predominante,
    menosDesenvolvido: titulos[menosDesenvolvido] || menosDesenvolvido
  };
}

// Montar HTML completo
async function buildHTML(data) {
  await loadData();

  const { nome, predominante, menosDesenvolvido, pontuacoes } = data;
  const perfil = `${predominante}-${menosDesenvolvido}`;
  const titulos = getPerfilTitulo(predominante, menosDesenvolvido);

  // Calcular percentuais
  const percentuais = {
    PESSOAS: Math.round((pontuacoes.PESSOAS / 42) * 100),
    ACAO: Math.round((pontuacoes.ACAO / 42) * 100),
    TEMPO: Math.round((pontuacoes.TEMPO / 42) * 100),
    MENSAGEM: Math.round((pontuacoes.MENSAGEM / 42) * 100)
  };

  // Carregar imagens em base64
  const logoPath = path.join(__dirname, '../assets/logo.png');
  const brainPath = path.join(__dirname, '../assets/brain-icon.png');
  const logoBase64 = await imageToBase64(logoPath);
  const brainBase64 = await imageToBase64(brainPath);

  // Obter conteúdo do relatório específico
  const relatorioData = relatorios[perfil];
  if (!relatorioData) {
    throw new Error(`Perfil ${perfil} não encontrado`);
  }

  // HTML completo
  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Relatório de Perfil de Escuta - ${nome}</title>
  <style>
    @page {
      size: A4;
      margin: 0;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Arial', 'Helvetica', sans-serif;
      line-height: 1.6;
      color: #333;
      font-size: 11pt;
    }
    
    /* PÁGINA DE CAPA */
    .capa {
      page-break-after: always;
      height: 297mm;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
      padding: 40px;
      text-align: center;
    }
    
    .capa-brain {
      width: 300px;
      margin-bottom: 40px;
    }
    
    .capa-titulo {
      font-size: 36pt;
      font-weight: bold;
      color: #17a2b8;
      margin-bottom: 20px;
      letter-spacing: 2px;
    }
    
    .capa-subtitulo {
      font-size: 20pt;
      color: #666;
      margin-bottom: 10px;
    }
    
    .capa-nome {
      font-size: 28pt;
      font-weight: bold;
      color: #333;
      margin-top: 40px;
      padding: 20px 40px;
      border-top: 3px solid #17a2b8;
      border-bottom: 3px solid #17a2b8;
    }
    
    /* HEADER COM LOGO (todas as páginas exceto capa) */
    .page-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 60px;
      padding: 10px 80px; /* ALTERADO O PADDING (de 60px para 80px nas laterais) */
      background: white;
      border-bottom: 2px solid #17a2b8;
      z-index: 1000;
      display: flex; /* Adicionado para centralizar a logo verticalmente */
      align-items: center; /* Adicionado para centralizar a logo verticalmente */
    }
    
    .page-header img {
      height: 40px; /* ALTERADO (de 35px para 40px) */
    }
    
    /* CONTEÚDO DAS PÁGINAS */
    .content-page {
      margin-top: 80px;
      /* ALTERADO (padding laterais de 60px para 80px) */
      /* ALTERADO (padding-bottom de 60px para 80px) */
      padding: 30px 80px 80px 80px; 
      page-break-inside: avoid;
    }
    
    .content-page h1 {
      color: #17a2b8;
      font-size: 24pt;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 3px solid #17a2b8;
    }
    
    .content-page h2 {
      color: #17a2b8;
      font-size: 18pt;
      margin-top: 25px;
      margin-bottom: 15px;
    }
    
    .content-page h3 {
      color: #333;
      font-size: 14pt;
      margin-top: 20px;
      margin-bottom: 10px;
    }
    
    .content-page p {
      margin-bottom: 12px;
      text-align: justify;
      line-height: 1.7;
      text-indent: 1.5em; /* ADICIONADO (para indentar o parágrafo) */
    }
    
    .content-page ul {
      margin: 10px 0 10px 30px;
    }
    
    .content-page li {
      margin: 8px 0;
      line-height: 1.6;
    }
    
    /* SEÇÃO DE PONTUAÇÕES */
    .pontuacoes-box {
      background: #f8f9fa;
      border-left: 5px solid #17a2b8;
      padding: 20px;
      margin: 25px 0;
      page-break-inside: avoid;
    }
    
    .pontuacao-item {
      margin: 15px 0;
    }
    
    .pontuacao-label {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-weight: 600;
      font-size: 10pt;
    }
    
    .pontuacao-bar {
      height: 25px;
      background: #e9ecef;
      border-radius: 12px;
      overflow: hidden;
      position: relative;
    }
    
    .pontuacao-fill {
      height: 100%;
      background: linear-gradient(90deg, #17a2b8 0%, #138496 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 12px;
      color: white;
      font-weight: 600;
      font-size: 10pt;
    }
    
    /* DESTAQUE */
    .destaque {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px 20px;
      margin: 20px 0;
      page-break-inside: avoid;
    }
    
    .destaque strong {
      color: #856404;
    }
    
    /* QUEBRA DE PÁGINA */
    .page-break {
      page-break-after: always;
    }
    
    /* ESTILOS ESPECIAIS */
    strong {
      font-weight: 600;
      color: #17a2b8;
    }
    
    .resultado-geral {
      background: #e7f7f9;
      border: 2px solid #17a2b8;
      border-radius: 10px;
      padding: 25px;
      margin: 25px 0;
      page-break-inside: avoid;
    }
    
    .resultado-geral h2 {
      margin-top: 0;
    }
    
    .resultado-item {
      margin: 15px 0;
    }
    
    .resultado-label {
      font-size: 10pt;
      color: #666;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    
    .resultado-valor {
      font-size: 16pt;
      color: #17a2b8;
      font-weight: bold;
      margin-top: 5px;
    }
  </style>
</head>
<body>
  
  <!-- PÁGINA 1: CAPA -->
  <div class="capa">
    <img src="${brainBase64}" alt="Criando Clientes" class="capa-brain">
    <div class="capa-titulo">RELATÓRIO</div>
    <div class="capa-subtitulo">Perfil de Comunicação e Escuta em Vendas</div>
    <div class="capa-nome">${nome}</div>
  </div>
  
  <!-- HEADER (aparece em todas as páginas seguintes) -->
  <div class="page-header">
    <img src="${logoBase64}" alt="Logo">
  </div>
  
  <!-- PÁGINA 2-3: CONTEÚDO DA CAPA ORIGINAL -->
  <div class="content-page">
    ${conteudosBase.capa.map((paragrafo, index) => {
      if (index === 0) {
        return `<h1>${paragrafo}</h1>`;
      } else if (paragrafo.length < 50 && !paragrafo.includes('?')) {
        return `<h2>${paragrafo}</h2>`;
      } else {
        return `<p>${paragrafo}</p>`;
      }
    }).join('\n')}
  </div>
  
  <div class="page-break"></div>
    
  <!-- PÁGINA 4+: RELATÓRIO ESPECÍFICO DA PESSOA -->
  <div class="content-page">
    <h1>Seu Relatório Personalizado</h1>
    
    <!-- Resultado Geral -->
    <div class="resultado-geral">
      <h2>Resultado Geral</h2>
      <div class="resultado-item">
        <div class="resultado-label">Estilo Predominante</div>
        <div class="resultado-valor">${titulos.predominante}</div>
      </div>
      <div class="resultado-item">
        <div class="resultado-label">Estilo Menos Desenvolvido</div>
        <div class="resultado-valor">${titulos.menosDesenvolvido}</div>
      </div>
    </div>
    
    <!-- Pontuações Detalhadas -->
    <div class="pontuacoes-box">
      <h3>📊 Suas Pontuações Detalhadas</h3>
      
      <div class="pontuacao-item">
        <div class="pontuacao-label">
          <span>Orientado para Pessoas (Relacional)</span>
          <span><strong>${pontuacoes.PESSOAS}</strong> / 42</span>
        </div>
        <div class="pontuacao-bar">
          <div class="pontuacao-fill" style="width: ${percentuais.PESSOAS}%">${percentuais.PESSOAS}%</div>
        </div>
      </div>
      
      <div class="pontuacao-item">
        <div class="pontuacao-label">
          <span>Orientado para Ação (Processo)</span>
          <span><strong>${pontuacoes.ACAO}</strong> / 42</span>
        </div>
        <div class="pontuacao-bar">
          <div class="pontuacao-fill" style="width: ${percentuais.ACAO}%">${percentuais.ACAO}%</div>
        </div>
      </div>
      
      <div class="pontuacao-item">
        <div class="pontuacao-label">
          <span>Orientado para Tempo (Solução Imediata)</span>
          <span><strong>${pontuacoes.TEMPO}</strong> / 42</span>
        </div>
        <div class="pontuacao-bar">
          <div class="pontuacao-fill" style="width: ${percentuais.TEMPO}%">${percentuais.TEMPO}%</div>
        </div>
      </div>
      
      <div class="pontuacao-item">
        <div class="pontuacao-label">
          <span>Orientado para Mensagem (Conteúdo/Analítico)</span>
          <span><strong>${pontuacoes.MENSAGEM}</strong> / 42</span>
        </div>
        <div class="pontuacao-bar">
          <div class="pontuacao-fill" style="width: ${percentuais.MENSAGEM}%">${percentuais.MENSAGEM}%</div>
        </div>
      </div>
    </div>
    
    <!-- Conteúdo do Relatório Específico -->
    ${relatorioData.paragrafos.map((item) => {
      const text = item.text;
      
      // Detectar títulos e seções
      if (text.match(/^\d+\./)) {
        return `<h2>${text}</h2>`;
      } else if (text.match(/^[A-ZÇÃÕÁÉÍÓÚ\s\-–()]+$/) && text.length < 100) {
        return `<h3>${text}</h3>`;
      } else if (text.includes('Orientado para')) {
        return `<h3>${text}</h3>`;
      } else {
        return `<p>${text}</p>`;
      }
    }).join('\n')}
    
  </div>
  
</body>
</html>
  `;

  return html;
}

module.exports = { buildHTML };
