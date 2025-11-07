# ✅ ATUALIZADO - PORTA 4546

## 🎯 O que mudou

✅ **Porta alterada:** 4545 → **4546**  
✅ **Deploy via Easypanel:** Isolado e seguro  
✅ **Recursos limitados:** Não interfere com N8N  
✅ **Guia atualizado:** Passo a passo específico  

---

## 📦 Arquivos Atualizados

```
pdf-generator/
├── .env.example          ✏️ PORT=4546
├── Dockerfile            ✏️ EXPOSE 4546
├── docker-compose.yml    ✏️ 4546:4546
├── server.js             ✏️ (já usava variável PORT)
└── EASYPANEL_4546.md     ⭐ NOVO - Guia completo
```

---

## 🚀 Como Usar AGORA

### 1️⃣ Subir para GitHub

```bash
cd pdf-generator
git init
git add .
git commit -m "Porta 4546 para Easypanel"
git remote add origin https://github.com/seu-usuario/pdf-generator.git
git push -u origin main
```

### 2️⃣ Deploy no Easypanel

**Siga:** [EASYPANEL_4546.md](EASYPANEL_4546.md)

**Resumo:**
1. Easypanel → New Project → "pdf-generator"
2. Add Service → "App"
3. Connect GitHub → seu repo
4. Environment vars:
   - `PORT=4546`
   - `API_KEY=sua-chave`
5. Resources:
   - CPU: 0.5
   - Memory: 512 MB
6. Deploy!

**Tempo:** 10 minutos

---

## ⚠️ IMPORTANTE

### ❌ NÃO USE:
- `install.sh` (quebra o Easypanel!)
- `docker-compose up` manualmente
- Instalação via linha de comando

### ✅ USE APENAS:
- **Easypanel interface web**
- Deploy via GitHub
- Recursos limitados

---

## 🎯 Vantagens da Porta 4546

- ✅ Não conflita com nada (4545 pode estar em uso)
- ✅ Isolada do N8N (5678)
- ✅ Isolada do Easypanel (3000)
- ✅ Fácil de lembrar

---

## 🔗 URLs Finais

**N8N:** `http://seu-ip:5678` ✅  
**Easypanel:** `http://seu-ip:3000` ✅  
**PDF Generator:** `http://seu-ip:4546` ⭐ NOVA  

---

## 📊 Configuração N8N

HTTP Request Node:
- **URL:** `http://seu-ip:4546/gerar-pdf`
- **Header:** `x-api-key: sua-chave`
- **Method:** POST
- **Response:** File

---

## 🎉 Pronto!

Agora você tem:
- ✅ N8N funcionando (porta 5678)
- ✅ PDF Generator funcionando (porta 4546)
- ✅ Tudo isolado no Easypanel
- ✅ Sem conflitos
- ✅ Sem derrubar nada

**Próximo passo:** Siga o [EASYPANEL_4546.md](EASYPANEL_4546.md)!

---

**Tempo total:** 15 minutos do GitHub ao ar! 🚀
