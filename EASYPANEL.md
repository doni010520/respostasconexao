# 🚀 Deploy no Easypanel - PDF Generator

## 📋 Pré-requisitos

- ✅ Easypanel instalado na sua VPS
- ✅ Código no GitHub
- ✅ Acesso ao Easypanel (painel web)

---

## 🎯 Passo a Passo

### 1️⃣ Acessar Easypanel

Acesse: `http://sua-vps-ip:3000` (ou o domínio do Easypanel)

---

### 2️⃣ Criar Novo Projeto

1. Clique em **"+ New Project"**
2. Nome: `pdf-generator`
3. Clique em **"Create"**

---

### 3️⃣ Adicionar Serviço

1. Dentro do projeto, clique em **"+ Add Service"**
2. Escolha: **"App"** (não Database)
3. Nome do serviço: `pdf-generator`

---

### 4️⃣ Configurar Source (GitHub)

Na aba **"Source"**:

1. **Source Type:** `GitHub`
2. **Repository:** `seu-usuario/pdf-generator`
3. **Branch:** `main` (ou `master`)
4. **Build Type:** `Dockerfile`
5. **Dockerfile Path:** `./Dockerfile` (padrão)

**Se não conectou o GitHub ainda:**
- Clique em "Connect GitHub"
- Autorize o Easypanel
- Selecione o repositório

---

### 5️⃣ Configurar Environment Variables

Na aba **"Environment"**, adicione:

| Key | Value |
|-----|-------|
| `PORT` | `4545` |
| `NODE_ENV` | `production` |
| `API_KEY` | `sua-chave-super-secreta` |

**💡 Gerar API Key segura:**
```bash
openssl rand -hex 32
```

Ou use: https://randomkeygen.com/

---

### 6️⃣ Configurar Networking

Na aba **"Networking"**:

1. **Port:** `4545`
2. **Protocol:** `HTTP`
3. **Domain (opcional):** `pdf-generator.seu-dominio.com`

**Se quiser usar domínio:**
- Marque: ✅ Enable HTTPS
- O Easypanel configurará Let's Encrypt automaticamente

**Se não tiver domínio:**
- Acesse via: `http://sua-vps-ip:4545`

---

### 7️⃣ Configurar Resources (Opcional)

Na aba **"Resources"**:

**Limits:**
- CPU: `1.0` (1 core)
- Memory: `512 MB`

**Reservations:**
- CPU: `0.5` (0.5 core)
- Memory: `256 MB`

---

### 8️⃣ Deploy!

1. Clique em **"Deploy"** no canto superior direito
2. Aguarde o build (~2-3 minutos)
3. Easypanel vai:
   - Clonar seu repositório
   - Fazer build da imagem Docker
   - Iniciar o container
   - Configurar networking

---

## ✅ Verificar se Funcionou

### Via Easypanel:
- Status deve estar: 🟢 **Running**
- Logs devem mostrar:
  ```
  ╔════════════════════════════════════════════╗
  ║  PDF Generator - Perfil de Escuta         ║
  ║  Porta: 4545                              ║
  ║  Status: Running ✓                        ║
  ╚════════════════════════════════════════════╝
  ```

### Via API:
```bash
curl http://sua-vps-ip:4545/health
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "version": "1.0.0",
  "uptime": 12.345
}
```

---

## 🧪 Testar Geração de PDF

```bash
curl -X POST http://sua-vps-ip:4545/gerar-pdf \
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

Se gerou `teste.pdf`, **está funcionando!** 🎉

---

## 🔄 Atualizar a Aplicação

Quando fizer mudanças no código:

1. **Commit e push** para o GitHub:
   ```bash
   git add .
   git commit -m "Atualizações"
   git push
   ```

2. No **Easypanel**:
   - Clique em **"Redeploy"**
   - Ou ative **Auto Deploy** nas configurações

---

## 🔧 Configurações Avançadas

### Auto Deploy (CI/CD)

Na aba **"Source"**:
- Marque: ✅ **Auto Deploy on Push**
- Easypanel vai fazer redeploy automático a cada push no GitHub!

### Health Check

Easypanel usa o health check do Dockerfile automaticamente:
- Endpoint: `/health`
- Intervalo: 30s
- Timeout: 10s

### Logs

Ver logs em tempo real:
1. Clique no serviço
2. Aba **"Logs"**
3. Ou via CLI: `docker logs -f pdf-generator`

### Backup

Easypanel faz backup automático das configurações.

Para backup do código:
- Está no GitHub ✅

Para backup das env vars:
- Anote em local seguro (1Password, etc.)

---

## 🌐 Usar com Domínio (Opcional)

### 1. Adicionar DNS:

No seu provedor de domínio (GoDaddy, Cloudflare, etc):

```
Type: A
Name: pdf-generator (ou @)
Value: IP-DA-SUA-VPS
TTL: 3600
```

### 2. Configurar no Easypanel:

Na aba **"Networking"**:
- Domain: `pdf-generator.seu-dominio.com`
- ✅ Enable HTTPS
- Save

Aguarde ~5 minutos para propagação DNS + SSL.

**Acesso final:**
- `https://pdf-generator.seu-dominio.com/health`
- `https://pdf-generator.seu-dominio.com/gerar-pdf`

---

## 📊 Monitoramento

### No Easypanel:

- **CPU/Memory:** Aba "Metrics"
- **Status:** Indicador 🟢/🔴
- **Logs:** Aba "Logs"
- **Uptime:** Estatísticas

### Alertas (opcional):

Configure webhooks no Easypanel para ser notificado se:
- Container parar
- Erro no deploy
- Alto uso de recursos

---

## 🐛 Troubleshooting

### Container não inicia:

**Ver logs:**
```bash
# No Easypanel ou via SSH:
docker logs pdf-generator
```

**Problemas comuns:**
- API_KEY não configurada → Adicione nas env vars
- Porta em conflito → Mude a porta
- Memória insuficiente → Aumente o limite

### Build falha:

**Causas comuns:**
1. Dockerfile com erro → Verifique sintaxe
2. Dependências faltando → Reinstale no package.json
3. GitHub não conectado → Reconecte

**Solução:**
- Verifique logs do build no Easypanel
- Teste o build localmente:
  ```bash
  docker build -t pdf-generator .
  ```

### API não responde:

1. **Verificar status:** Container está rodando?
2. **Verificar porta:** 4545 está aberta no firewall?
3. **Verificar logs:** Algum erro?
4. **Testar health:** `curl http://localhost:4545/health`

### Performance lenta:

**Aumentar recursos:**
- CPU: 2 cores
- Memory: 1GB

**Otimizar:**
- Habilitar cache de PDFs
- Usar múltiplas instâncias (scale)

---

## ⚡ Scale (Múltiplas Instâncias)

Para alto volume:

1. No Easypanel, aba **"Scaling"**
2. **Replicas:** `2` (ou mais)
3. Easypanel fará load balancing automático!

---

## 💰 Custos

**Easypanel:** Grátis (self-hosted)  
**VPS:** $5-10/mês (DigitalOcean, Hetzner, etc.)  
**Domínio:** $10-15/ano (opcional)  
**SSL:** Grátis (Let's Encrypt via Easypanel)

**Total:** ~$5-10/mês

---

## 🎯 Checklist Final

Antes de usar em produção:

- [ ] Código no GitHub
- [ ] Easypanel conectado ao GitHub
- [ ] Serviço criado e deployado
- [ ] Environment variables configuradas
- [ ] API_KEY segura e salva
- [ ] Health check respondendo
- [ ] Teste de PDF gerado com sucesso
- [ ] N8N configurado e testado
- [ ] Domínio configurado (se usar)
- [ ] HTTPS ativo (se usar domínio)
- [ ] Auto-deploy configurado
- [ ] Logs monitorados

---

## 🎉 Pronto!

Sua aplicação está rodando no Easypanel! 🚀

**Vantagens do Easypanel:**
- ✅ Deploy com 1 clique
- ✅ SSL automático
- ✅ Logs em tempo real
- ✅ Fácil de escalar
- ✅ Auto-deploy no push
- ✅ Interface visual
- ✅ Health checks automáticos

**Próximo passo:** Configure no N8N usando a URL do Easypanel!

---

## 📞 Suporte

**Easypanel:**
- Docs: https://easypanel.io/docs
- Discord: https://discord.gg/easypanel

**PDF Generator:**
- README.md do projeto
- Issues no GitHub
