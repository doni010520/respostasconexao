require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { generatePDF } = require('./src/pdfGenerator');

const app = express();
const PORT = process.env.PORT || 4545;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Middleware de autenticação
const authMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (process.env.API_KEY && apiKey !== process.env.API_KEY) {
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Invalid API key' 
    });
  }
  
  next();
};

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    version: '1.0.0',
    uptime: process.uptime()
  });
});

// Endpoint principal: Gerar PDF
app.post('/gerar-pdf', authMiddleware, async (req, res) => {
  try {
    const { nome, email, predominante, menosDesenvolvido, pontuacoes } = req.body;
    
    // Validação
    if (!nome || !predominante || !menosDesenvolvido || !pontuacoes) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: 'Campos obrigatórios: nome, predominante, menosDesenvolvido, pontuacoes'
      });
    }
    
    // Validar estilos
    const estilosValidos = ['PESSOAS', 'ACAO', 'TEMPO', 'MENSAGEM'];
    if (!estilosValidos.includes(predominante) || !estilosValidos.includes(menosDesenvolvido)) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: 'Estilos inválidos. Use: PESSOAS, ACAO, TEMPO, MENSAGEM'
      });
    }
    
    console.log(`[${new Date().toISOString()}] Gerando PDF para: ${nome} (${predominante}-${menosDesenvolvido})`);
    
    // Gerar PDF
    const pdfBuffer = await generatePDF({
      nome,
      email,
      predominante,
      menosDesenvolvido,
      pontuacoes
    });
    
    // Retornar PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Relatorio_Perfil_Escuta_${nome.replace(/\s+/g, '_')}.pdf"`);
    res.send(pdfBuffer);
    
    console.log(`[${new Date().toISOString()}] PDF gerado com sucesso para: ${nome}`);
    
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
});

// Rota de teste
app.get('/', (req, res) => {
  res.json({
    message: 'PDF Generator API - Perfil de Escuta',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      generate: 'POST /gerar-pdf'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: 'Endpoint não encontrado' 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║  PDF Generator - Perfil de Escuta         ║
║  Porta: ${PORT}                              ║
║  Status: Running ✓                        ║
╚════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received, shutting down gracefully...');
  process.exit(0);
});
