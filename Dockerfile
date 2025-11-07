# Multi-stage build para otimizar tamanho da imagem
FROM node:20-slim AS base

# Instalar Chromium e dependências
RUN apt-get update && apt-get install -y \
    chromium \
    chromium-driver \
    ca-certificates \
    fonts-liberation \
    fonts-noto-color-emoji \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    wget \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Configurar Puppeteer para NÃO baixar Chrome (usará o Chromium instalado)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Criar diretório da aplicação
WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependências (mudei aqui!)
RUN npm install --production && npm cache clean --force

# Copiar código da aplicação
COPY . .

# Criar usuário não-root para segurança
RUN groupadd -r appuser && useradd -r -g appuser appuser \
    && mkdir -p /home/appuser/.cache \
    && chown -R appuser:appuser /app /home/appuser

# Mudar para usuário não-root
USER appuser

# Expor porta
EXPOSE 4546

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:4546/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Comando para iniciar a aplicação
CMD ["node", "server.js"]
