# 🚀 GUIA RÁPIDO DE DEPLOY

## ⚡ Deploy em 5 Minutos

### 1️⃣ Na sua máquina local:

```bash
# Subir para o GitHub
cd pdf-generator
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/pdf-generator.git
git push -u origin main
```

### 2️⃣ Na sua VPS (Ubuntu):

```bash
# SSH na VPS
ssh usuario@sua-vps-ip

# Clonar repositório
cd /opt
sudo git clone https://github.com/SEU-USUARIO/pdf-generator.git
cd pdf-generator

# Executar instalação automática
sudo bash install.sh
```

**Pronto! A API estará rodando em `http://sua-vps-ip:4545` 🎉**

---

## 🧪 Testar a API

```bash
# Dentro da pasta pdf-generator
node test.js
```

Se aparecer ✅, está funcionando!

---

## 🔗 Configurar no N8N

### HTTP Request Node:

- **URL:** `http://sua-vps-ip:4545/gerar-pdf`
- **Method:** POST
- **Headers:** 
  ```json
  {
    "x-api-key": "sua-api-key-aqui"
  }
  ```
- **Body:** (Ver README.md)
- **Response Format:** File

### Pegar a API Key:

```bash
# Na VPS
cd /opt/pdf-generator
cat .env | grep API_KEY
```

Copie a chave e cole no N8N!

---

## 📊 Verificar Status

```bash
pm2 status
pm2 logs pdf-generator
```

---

## 🔄 Atualizar a Aplicação

```bash
# Na VPS
cd /opt/pdf-generator
git pull
npm install
pm2 restart pdf-generator
```

---

## 🆘 Problemas?

### API não responde:
```bash
pm2 logs pdf-generator --lines 50
```

### Reiniciar tudo:
```bash
pm2 restart pdf-generator
```

### Ver uso de memória:
```bash
pm2 monit
```

---

## ⚙️ Configurações Avançadas

### Aumentar limite de memória:
```bash
pm2 delete pdf-generator
pm2 start server.js --name pdf-generator --max-memory-restart 500M
pm2 save
```

### Múltiplas instâncias (cluster):
```bash
pm2 delete pdf-generator
pm2 start server.js --name pdf-generator -i 2
pm2 save
```

### Auto-restart on error:
```bash
pm2 start server.js --name pdf-generator --max-restarts 10
pm2 save
```

---

## 🔐 Segurança

### Trocar API Key:
```bash
# Gerar nova
openssl rand -hex 32

# Editar .env
nano .env
# Trocar API_KEY

# Reiniciar
pm2 restart pdf-generator
```

### Backup das configurações:
```bash
cd /opt
tar -czf pdf-generator-backup.tar.gz pdf-generator/
```

---

## 📈 Monitoramento

### Ver logs em tempo real:
```bash
pm2 logs pdf-generator --lines 100
```

### Estatísticas:
```bash
pm2 monit
```

### Limpar logs:
```bash
pm2 flush
```

---

## 🎯 Checklist Pós-Deploy

- [ ] API responde em `/health`
- [ ] Teste gerou PDF com sucesso
- [ ] N8N consegue acessar a API
- [ ] Firewall liberou porta 4545
- [ ] PM2 configurado para auto-start
- [ ] API Key está segura
- [ ] Backup da configuração feito

---

**Dúvidas?** Consulte o README.md completo!
