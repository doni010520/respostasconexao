# 🐳 Teste Local com Docker

## 🚀 Início Rápido (3 Comandos)

### 1. Build da imagem:
```bash
docker build -t pdf-generator .
```

### 2. Rodar o container:
```bash
docker run -d \
  --name pdf-generator \
  -p 4545:4545 \
  -e API_KEY=teste-local-123 \
  pdf-generator
```

### 3. Testar:
```bash
curl http://localhost:4545/health
```

**Deve retornar:**
```json
{"status":"ok","version":"1.0.0","uptime":...}
```

---

## 🧪 Testar Geração de PDF

```bash
curl -X POST http://localhost:4545/gerar-pdf \
  -H "Content-Type: application/json" \
  -H "x-api-key: teste-local-123" \
  -d '{
    "nome": "Teste Docker",
    "email": "teste@docker.com",
    "predominante": "TEMPO",
    "menosDesenvolvido": "ACAO",
    "pontuacoes": {
      "PESSOAS": 35,
      "ACAO": 20,
      "TEMPO": 40,
      "MENSAGEM": 38
    }
  }' \
  --output teste-docker.pdf
```

Se gerou `teste-docker.pdf`, **funcionou!** 🎉

---

## 🔧 Usando Docker Compose (mais fácil)

### 1. Criar arquivo .env:
```bash
echo "API_KEY=teste-local-123" > .env
```

### 2. Subir o serviço:
```bash
docker-compose up -d
```

### 3. Ver logs:
```bash
docker-compose logs -f
```

### 4. Parar:
```bash
docker-compose down
```

---

## 📊 Comandos Úteis

### Ver logs:
```bash
docker logs pdf-generator
docker logs -f pdf-generator  # tempo real
```

### Status:
```bash
docker ps
```

### Parar:
```bash
docker stop pdf-generator
```

### Remover:
```bash
docker rm pdf-generator
```

### Rebuild (após mudanças):
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## 🐛 Debug

### Entrar no container:
```bash
docker exec -it pdf-generator /bin/bash
```

### Ver uso de recursos:
```bash
docker stats pdf-generator
```

### Ver health check:
```bash
docker inspect --format='{{json .State.Health}}' pdf-generator | jq
```

---

## 🎯 Pronto para Produção?

Se funcionou localmente:
1. ✅ Commit e push para GitHub
2. ✅ Deploy no Easypanel (ver EASYPANEL.md)
3. ✅ Configure no N8N

---

## 💡 Dicas

- Use `.env` para variáveis locais
- Não commite `.env` (já está no .gitignore)
- Teste com diferentes perfis (TEMPO, ACAO, PESSOAS, MENSAGEM)
- Monitore uso de memória: `docker stats`
