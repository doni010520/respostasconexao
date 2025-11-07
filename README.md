# 📊 PDF Generator - Perfil de Escuta

API para geração automática de PDFs personalizados de Perfil de Comunicação e Escuta em Vendas.

## 🎯 Funcionalidades

- ✅ Gera PDFs personalizados com nome e pontuações do participante
- ✅ Contém capa + introdução + perfil de estilos + relatório específico
- ✅ 12 perfis diferentes (PESSOAS, AÇÃO, TEMPO, MENSAGEM)
- ✅ Design profissional com logos e gráficos
- ✅ API REST simples
- ✅ Autenticação via API Key
- ✅ Performance otimizada com browser reutilizável

## 📋 Pré-requisitos

- Node.js 18+ 
- 2GB RAM (mínimo)
- Linux/Ubuntu (recomendado para produção)

## 🚀 Instalação

### Opção 1: Docker (Recomendado) 🐳

**Teste local:**
```bash
docker build -t pdf-generator .
docker run -d -p 4545:4545 -e API_KEY=sua-chave pdf-generator
```

**Docker Compose:**
```bash
echo "API_KEY=sua-chave-secreta" > .env
docker-compose up -d
```

**Deploy com Easypanel:**
Ver guia completo: [EASYPANEL.md](EASYPANEL.md)

### Opção 2: Manual (VPS Ubuntu)

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/pdf-generator.git
cd pdf-generator
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
nano .env
```

Edite o `.env`:
```env
PORT=4545
API_KEY=sua-chave-secreta-super-forte
NODE_ENV=production
```

💡 **Gerar API Key segura:**
```bash
openssl rand -hex 32
```

### 4. Inicie a aplicação

**Desenvolvimento:**
```bash
npm run dev
```

**Produção:**
```bash
npm start
```

**Com PM2 (recomendado):**
```bash
npm install -g pm2
pm2 start server.js --name pdf-generator
pm2 save
pm2 startup
```

## 📡 API

### Endpoint: Gerar PDF

**POST** `/gerar-pdf`

**Headers:**
```
Content-Type: application/json
x-api-key: sua-chave-secreta
```

**Body:**
```json
{
  "nome": "Adonias Santos",
  "email": "email@example.com",
  "predominante": "TEMPO",
  "menosDesenvolvido": "ACAO",
  "pontuacoes": {
    "PESSOAS": 37,
    "ACAO": 18,
    "TEMPO": 41,
    "MENSAGEM": 38
  }
}
```

**Response:**
- Status: `200 OK`
- Content-Type: `application/pdf`
- Body: PDF binário (pronto para download)

**Estilos válidos:**
- `PESSOAS` - Orientado para Pessoas (Relacional)
- `ACAO` - Orientado para Ação (Processo)
- `TEMPO` - Orientado para Tempo (Solução imediata)
- `MENSAGEM` - Orientado para Mensagem (Conteúdo/Analítico)

### Health Check

**GET** `/health`

**Response:**
```json
{
  "status": "ok",
  "version": "1.0.0",
  "uptime": 12345
}
```

## 🧪 Teste Local

### Via cURL:

```bash
curl -X POST http://localhost:4545/gerar-pdf \
  -H "Content-Type: application/json" \
  -H "x-api-key: sua-chave-secreta" \
  -d '{
    "nome": "Teste Silva",
    "email": "teste@email.com",
    "predominante": "TEMPO",
    "menosDesenvolvido": "ACAO",
    "pontuacoes": {
      "PESSOAS": 35,
      "ACAO": 20,
      "TEMPO": 40,
      "MENSAGEM": 38
    }
  }' \
  --output teste.pdf
```

### Via Node.js:

```javascript
const axios = require('axios');
const fs = require('fs');

const response = await axios.post('http://localhost:4545/gerar-pdf', {
  nome: 'Teste Silva',
  email: 'teste@email.com',
  predominante: 'TEMPO',
  menosDesenvolvido: 'ACAO',
  pontuacoes: {
    PESSOAS: 35,
    ACAO: 20,
    TEMPO: 40,
    MENSAGEM: 38
  }
}, {
  headers: {
    'x-api-key': 'sua-chave-secreta'
  },
  responseType: 'arraybuffer'
});

fs.writeFileSync('teste.pdf', response.data);
```

## 🔗 Integração com N8N

### HTTP Request Node:

**Configuração:**
- **Method:** POST
- **URL:** `https://sua-vps.com:4545/gerar-pdf`
- **Authentication:** None (usa header)
- **Headers:**
  ```json
  {
    "Content-Type": "application/json",
    "x-api-key": "sua-chave-secreta"
  }
  ```

**Body:**
```json
{
  "nome": "={{$json.nome}}",
  "email": "={{$json.email}}",
  "predominante": "={{$json.predominante}}",
  "menosDesenvolvido": "={{$json.menosDesenvolvido}}",
  "pontuacoes": {
    "PESSOAS": "={{$json.pontuacoes.PESSOAS}}",
    "ACAO": "={{$json.pontuacoes.ACAO}}",
    "TEMPO": "={{$json.pontuacoes.TEMPO}}",
    "MENSAGEM": "={{$json.pontuacoes.MENSAGEM}}"
  }
}
```

**Response Format:** File

O PDF estará disponível como binary data para anexar no email!

## 🖥️ Deploy na VPS

### Ubuntu 20.04/22.04:

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar dependências do Puppeteer
sudo apt install -y \
  chromium-browser \
  fonts-liberation \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libatspi2.0-0 \
  libcups2 \
  libdbus-1-3 \
  libdrm2 \
  libgbm1 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libxcomposite1 \
  libxdamage1 \
  libxfixes3 \
  libxkbcommon0 \
  libxrandr2 \
  xdg-utils

# Clonar e configurar
cd /opt
git clone https://github.com/seu-usuario/pdf-generator.git
cd pdf-generator
npm install --production

# Configurar .env
cp .env.example .env
nano .env

# Instalar PM2
npm install -g pm2

# Iniciar
pm2 start server.js --name pdf-generator
pm2 save
pm2 startup

# Ver logs
pm2 logs pdf-generator
```

### Configurar Firewall:

```bash
sudo ufw allow 4545/tcp
sudo ufw reload
```

### Nginx Reverse Proxy (opcional):

```nginx
server {
    listen 80;
    server_name sua-vps.com;
    
    location / {
        proxy_pass http://localhost:4545;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 300s;
    }
}
```

## 📊 Performance

- **Geração:** ~3-5 segundos por PDF
- **Memória:** ~150MB por instância
- **Concurrent:** 10-15 PDFs simultâneos (VPS básica)
- **Browser:** Reutilizado (não recria a cada request)

## 🔒 Segurança

- ✅ Autenticação via API Key
- ✅ Validação de inputs
- ✅ Rate limiting (adicione se necessário)
- ✅ CORS configurável
- ✅ Sem armazenamento de dados sensíveis

## 📝 Logs

Os logs são exibidos no console e podem ser visualizados com:

```bash
pm2 logs pdf-generator
```

## 🐛 Troubleshooting

### Erro: "Failed to launch browser"

**Solução:**
```bash
# Instalar dependências do Chromium
sudo apt install -y chromium-browser
```

### Erro: "EADDRINUSE" (porta em uso)

**Solução:**
```bash
# Verificar o que está usando a porta
sudo lsof -i :4545

# Matar processo
sudo kill -9 <PID>
```

### PDF não gerado

**Verificar:**
1. Todas as 12 combinações de perfil estão no `data/relatorios.json`?
2. Imagens estão em `assets/`?
3. Logs mostram erro específico?

### Memória insuficiente

**Solução:**
```bash
# Adicionar swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

## 📁 Estrutura do Projeto

```
pdf-generator/
├── server.js                 # API Express
├── package.json
├── .env                      # Configuração (não commitar!)
├── .env.example              # Template
├── .gitignore
├── README.md
│
├── src/
│   ├── pdfGenerator.js       # Lógica Puppeteer
│   └── templateBuilder.js    # Monta HTML
│
├── data/
│   ├── conteudos_base.json   # Capa + Perfil Estilos
│   └── relatorios.json       # 12 relatórios
│
├── assets/
│   ├── logo.png              # Logo header
│   └── brain-icon.png        # Capa (criando clientes)
│
└── templates/
    └── (vazio - HTML é gerado dinamicamente)
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: Minha feature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

MIT License - Veja LICENSE para mais detalhes

## 👤 Autor

Desenvolvido para o programa **Conexão Cliente para vendas exponenciais**

## 📞 Suporte

Em caso de dúvidas ou problemas:
1. Verifique os logs: `pm2 logs pdf-generator`
2. Consulte a seção Troubleshooting
3. Abra uma issue no GitHub

---

**Versão:** 1.0.0  
**Última atualização:** Novembro 2025
