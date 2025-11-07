#!/bin/bash

echo "╔════════════════════════════════════════════╗"
echo "║  PDF Generator - Script de Instalação     ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se é root
if [ "$EUID" -ne 0 ]; then 
  echo -e "${RED}❌ Execute como root: sudo bash install.sh${NC}"
  exit 1
fi

echo "📦 Atualizando sistema..."
apt update && apt upgrade -y

echo ""
echo "📥 Instalando Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

echo ""
echo "🔧 Instalando dependências do Puppeteer..."
apt install -y \
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

echo ""
echo "📦 Instalando dependências Node.js..."
npm install --production

echo ""
echo "🔐 Configurando variáveis de ambiente..."
if [ ! -f .env ]; then
  cp .env.example .env
  
  # Gerar API key aleatória
  API_KEY=$(openssl rand -hex 32)
  sed -i "s/sua-chave-secreta-aqui/$API_KEY/" .env
  
  echo -e "${GREEN}✓ Arquivo .env criado${NC}"
  echo -e "${YELLOW}⚠️  API Key gerada: $API_KEY${NC}"
  echo -e "${YELLOW}   Salve esta chave em local seguro!${NC}"
else
  echo -e "${YELLOW}⚠️  Arquivo .env já existe, pulando...${NC}"
fi

echo ""
echo "🚀 Instalando PM2..."
npm install -g pm2

echo ""
echo "🔥 Iniciando aplicação..."
pm2 start server.js --name pdf-generator
pm2 save
pm2 startup | tail -n 1 | bash

echo ""
echo "🔒 Configurando firewall..."
ufw allow 4545/tcp
ufw reload

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║  ✅ Instalação Concluída!                  ║"
echo "╚════════════════════════════════════════════╝"
echo ""
echo "📊 Status da aplicação:"
pm2 status

echo ""
echo "📡 Endpoints disponíveis:"
echo "   Health: http://$(hostname -I | awk '{print $1}'):4545/health"
echo "   API:    http://$(hostname -I | awk '{print $1}'):4545/gerar-pdf"
echo ""
echo "📝 Comandos úteis:"
echo "   Ver logs:      pm2 logs pdf-generator"
echo "   Parar:         pm2 stop pdf-generator"
echo "   Reiniciar:     pm2 restart pdf-generator"
echo "   Status:        pm2 status"
echo ""
echo "🔐 Sua API Key:"
if [ -f .env ]; then
  grep API_KEY .env
fi
echo ""
