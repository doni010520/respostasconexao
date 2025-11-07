# 🚀 DEPLOY NO EASYPANEL - PASSO A PASSO

## ✅ Pré-requisitos

- [x] Código no GitHub
- [x] Easypanel funcionando
- [x] N8N funcionando (sem interferir!)

---

## 📋 PASSO A PASSO (10 minutos)

### 1️⃣ Preparar Código no GitHub

```bash
# Na sua máquina local (onde extraiu o pdf-generator)
cd pdf-generator

# Inicializar Git (se ainda não fez)
git init
git add .
git commit -m "Initial commit - porta 4546"

# Criar repositório no GitHub
# Vá em: https://github.com/new
# Nome: pdf-generator

# Conectar e enviar
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/pdf-generator.git
git push -u origin main
```

**✅ Código no GitHub!**

---

### 2️⃣ Acessar Easypanel

**URL:** `http://seu-ip:3000`

Faça login.

---

### 3️⃣ Criar Novo Projeto

1. Clique em **"+ New Project"** (canto superior)
2. **Project Name:** `pdf-generator`
3. Clique **"Create"**

---

### 4️⃣ Adicionar Serviço (App)

1. Dentro do projeto, clique **"+ Add Service"**
2. Escolha: **"App"**
3. **Service Name:** `pdf-generator`
4. Clique **"Create"**

---

### 5️⃣ Configurar SOURCE (GitHub)

Na aba **"Source"**:

**GitHub:**
1. **Repository:** Clique "Connect GitHub"
   - Autorize o Easypanel
   - Selecione: `seu-usuario/pdf-generator`
2. **Branch:** `main`
3. **Build Method:** `Dockerfile`

**✅ Salve!**

---

### 6️⃣ Configurar ENVIRONMENT

Na aba **"Environment"**:

Adicione estas variáveis:

| Name | Value |
|------|-------|
| `PORT` | `4546` |
| `NODE_ENV` | `production` |
| `API_KEY` | `sua-chave-super-secreta-123` |

**💡 Gerar API Key segura:**
```bash
openssl rand -hex 32
```

Ou use: https://randomkeygen.com/ (Code Igniter Encryption Keys)

**✅ Salve!**

---

### 7️⃣ Configurar NETWORKING

Na aba **"Domains"**:

**Opção A - SEM domínio:**
1. Deixe em branco
2. Acesse via: `http://seu-ip:4546`

**Opção B - COM domínio:**
1. **Domain:** `pdf.seu-dominio.com`
2. Marque: ✅ **Enable HTTPS**
3. Easypanel configura SSL automático (Let's Encrypt)

**No seu DNS (GoDaddy, Cloudflare, etc):**
```
Type: A
Name: pdf (ou seu subdomínio)
Value: IP-DA-SUA-VPS
TTL: 3600
```

**✅ Salve!**

---

### 8️⃣ Configurar RESOURCES (Importante!)

Na aba **"Advanced"** → **"Resources"**:

**Limits (Máximo):**
- **CPU:** `0.5` (meio core)
- **Memory:** `512 MB`

**Reservations (Garantido):**
- **CPU:** `0.25`
- **Memory:** `256 MB`

**Por quê?** Para não consumir tudo e derrubar o N8N de novo!

**✅ Salve!**

---

### 9️⃣ DEPLOY! 🚀

1. Clique no botão **"Deploy"** (canto superior direito)
2. Aguarde 2-3 minutos
3. Easypanel vai:
   - ✅ Clonar repositório GitHub
   - ✅ Build da imagem Docker
   - ✅ Criar container
   - ✅ Iniciar serviço

**Acompanhe os logs** na aba "Logs"!

---

### 🔟 Verificar se Funcionou ✅

#### No Easypanel:
- Status deve estar: 🟢 **Running**
- Logs devem mostrar:
  ```
  ╔════════════════════════════════════════════╗
  ║  PDF Generator - Perfil de Escuta         ║
  ║  Porta: 4546                              ║
  ║  Status: Running ✓                        ║
  ╚════════════════════════════════════════════╝
  ```

#### Via terminal (na VPS):
```bash
curl http://localhost:4546/health
```

**Resposta esperada:**
```json
{"status":"ok","version":"1.0.0","uptime":...}
```

#### Via navegador:
```
http://seu-ip:4546/health
```

**Se retornar JSON, FUNCIONOU!** 🎉

---

## 🧪 Testar Geração de PDF

```bash
curl -X POST http://seu-ip:4546/gerar-pdf \
  -H "Content-Type: application/json" \
  -H "x-api-key: sua-chave-secreta-123" \
  -d '{
    "nome": "Teste Easypanel",
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

**Se gerou `teste.pdf`, ESTÁ FUNCIONANDO!** 🎊

---

## 🔄 Configurar Auto-Deploy (Opcional)

Na aba **"Source"**:
- Marque: ✅ **Auto Deploy on Push**

Agora sempre que você fizer push no GitHub, Easypanel faz deploy automático!

---

## 🔗 Configurar no N8N

No N8N, HTTP Request Node:

**URL:** 
- Se sem domínio: `http://seu-ip:4546/gerar-pdf`
- Se com domínio: `https://pdf.seu-dominio.com/gerar-pdf`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "x-api-key": "sua-chave-secreta-123"
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
    "PESSOAS": {{$json.pontuacoes.PESSOAS}},
    "ACAO": {{$json.pontuacoes.ACAO}},
    "TEMPO": {{$json.pontuacoes.TEMPO}},
    "MENSAGEM": {{$json.pontuacoes.MENSAGEM}}
  }
}
```

**Response Format:** `File`

---

## 📊 Monitoramento

### Ver Logs:
- No Easypanel: Aba **"Logs"**

### Ver Métricas:
- No Easypanel: Aba **"Metrics"**
  - CPU usage
  - Memory usage
  - Network

### Ver Status:
- Dashboard do Easypanel
- 🟢 = Running
- 🔴 = Stopped/Error

---

## 🐛 Troubleshooting

### Build falha:

**Ver logs do build** na aba "Logs" do Easypanel

**Causas comuns:**
- GitHub não conectado → Reconecte
- Dockerfile com erro → Verifique sintaxe
- Sem acesso ao repo → Libere permissões

### Container não inicia:

**Ver logs do container:**
1. Vá na aba "Logs"
2. Procure erros em vermelho

**Causas comuns:**
- Variáveis de ambiente faltando
- Porta em conflito (mas 4546 está livre!)
- Memória insuficiente

### API não responde:

1. **Status do container:** Running?
2. **Firewall:** Porta 4546 aberta?
3. **Logs:** Algum erro?

```bash
# Verificar porta
curl http://localhost:4546/health
```

### Memória alta:

**Reduzir limites:**
1. Aba "Advanced" → "Resources"
2. Memory Limit: `384 MB` (reduzir)
3. Redeploy

---

## 🎯 Checklist Final

Antes de usar em produção:

- [ ] Deploy funcionou sem erros
- [ ] Status: 🟢 Running
- [ ] `/health` retorna {"status":"ok"}
- [ ] Teste de PDF gerou arquivo
- [ ] N8N ainda está funcionando
- [ ] API Key segura e salva
- [ ] Recursos limitados (CPU/Memory)
- [ ] Auto-deploy configurado
- [ ] N8N configurado e testado

---

## 🎉 PRONTO!

Sua API está no ar na **porta 4546**, isolada e sem interferir com o N8N!

**Vantagens do Easypanel:**
- ✅ Isolamento completo (não afeta N8N)
- ✅ Interface visual (fácil debug)
- ✅ Logs em tempo real
- ✅ Métricas de uso
- ✅ Auto-deploy
- ✅ SSL automático (se usar domínio)
- ✅ Restart fácil

---

## 📞 URLs Importantes

**Easypanel:** `http://seu-ip:3000`  
**N8N:** `http://seu-ip:5678`  
**PDF Generator:** `http://seu-ip:4546`  
**Health Check:** `http://seu-ip:4546/health`  
**Gerar PDF:** `POST http://seu-ip:4546/gerar-pdf`

---

**Alguma dúvida?** Siga o passo a passo e vai funcionar! 🚀

**Lembre-se:**
- ✅ Porta 4546 (não conflita com nada)
- ✅ Recursos limitados (não derruba N8N)
- ✅ Via Easypanel (isolado e seguro)
