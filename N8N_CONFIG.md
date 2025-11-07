# 🔗 CONFIGURAÇÃO DO N8N

## 📊 Workflow Completo

```
Google Forms Trigger
        ↓
    Function Node (processar respostas - calcular perfil)
        ↓
    HTTP Request (gerar PDF)
        ↓
    Send Email (enviar PDF)
```

---

## 1️⃣ Function Node - Processar Respostas

**Nome:** Calcular Perfil de Escuta

**Código:** (Use o arquivo `n8n_codigo_simples.js` da documentação anterior)

**Output esperado:**
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

---

## 2️⃣ HTTP Request Node - Gerar PDF

### Configurações Básicas:
- **Method:** `POST`
- **URL:** `http://SUA-VPS-IP:4545/gerar-pdf`

### Authentication:
- **Type:** None (usa header customizado)

### Headers:
```json
{
  "Content-Type": "application/json",
  "x-api-key": "SUA-API-KEY-AQUI"
}
```

### Body Content Type:
- **Type:** JSON

### Body (JSON):
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

### Response:
- **Response Format:** `File`
- **Put Output in Field:** `data`

### Options:
- **Timeout:** `60000` (60 segundos)
- **Ignore SSL Issues:** `false`

---

## 3️⃣ Send Email Node - Enviar PDF

### Configurações Gmail:

**To:** `={{$json.email}}`

**Subject:** 
```
🎯 Seu Perfil de Escuta está pronto, {{$json.nome}}!
```

**Email Format:** `HTML`

**Message (HTML):**
```html
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px;">
      <h1 style="margin: 0;">🎉 Seu Perfil de Escuta está Pronto!</h1>
    </div>
    
    <div style="padding: 30px 20px;">
      <p>Olá, <strong>{{$json.nome}}</strong>!</p>
      
      <p>Parabéns por dedicar um tempo para se conhecer melhor! 👏</p>
      
      <p style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <strong style="color: #667eea;">✨ Seu estilo predominante:</strong> {{$json.predominante}}<br>
        <strong style="color: #667eea;">🎯 Área de desenvolvimento:</strong> {{$json.menosDesenvolvido}}
      </p>
      
      <p>Anexo a este email você encontra seu relatório completo em PDF com análise detalhada, pontuações e recomendações práticas personalizadas.</p>
      
      <p>Um abraço,<br>
      <strong>Equipe Conexão Cliente</strong></p>
    </div>
  </div>
</body>
</html>
```

### Attachments:

**Opção 1 - Input Binary Field:**
- **Property Name:** `data`
- **File Name:** `Relatorio_Perfil_Escuta_{{$json.nome}}.pdf`

**Opção 2 - Expression:**
```
={{$binary.data}}
```

---

## 🧪 Testar o Workflow

### 1. Execute manualmente:
- Clique em "Execute Workflow"
- Use dados de teste

### 2. Verifique cada nó:
- ✅ Function processou corretamente?
- ✅ HTTP Request retornou PDF?
- ✅ Email foi enviado?

### 3. Valide o resultado:
- Abra o email
- Baixe o PDF
- Verifique se está correto

---

## 🔧 Troubleshooting N8N

### Erro: "Request failed with status code 401"
**Causa:** API Key inválida
**Solução:** Verificar API Key no header

### Erro: "Request failed with status code 400"
**Causa:** Dados inválidos
**Solução:** Verificar se todos os campos estão preenchidos

### Erro: "ETIMEDOUT" ou "ECONNREFUSED"
**Causa:** N8N não consegue acessar a VPS
**Solução:** 
- Verificar se API está rodando: `pm2 status`
- Verificar firewall: `sudo ufw status`
- Testar curl: `curl http://SUA-VPS-IP:4545/health`

### PDF não é anexado no email
**Causa:** Response format incorreto
**Solução:** Configurar Response Format como "File"

### Email não enviado
**Causa:** Credenciais Gmail ou anexo muito grande
**Solução:**
- Verificar credenciais
- Limite do Gmail: 25MB

---

## 📋 Checklist de Configuração

- [ ] Function Node configurado e testado
- [ ] HTTP Request com URL correta da VPS
- [ ] Header x-api-key configurado
- [ ] Body JSON correto com variáveis N8N
- [ ] Response Format: File
- [ ] Timeout: 60000ms
- [ ] Send Email configurado
- [ ] Template HTML do email ok
- [ ] Attachment configurado
- [ ] Workflow testado end-to-end
- [ ] Email recebido com PDF correto

---

## 💡 Dicas Profissionais

1. **Use variáveis de ambiente no N8N** para API Key e URL
2. **Configure retry** no HTTP Request (3 tentativas)
3. **Adicione validação** antes do HTTP Request
4. **Log erros** em Google Sheets para auditoria
5. **Configure timeout adequado** (60s é bom)
6. **Teste com múltiplos perfis** antes de produção

---

## 📊 Exemplo de Dados de Teste

```json
{
  "Timestamp": "11/06/2025 18:38:53",
  "Nome completo:": "Teste Silva",
  "Informe seu melhor e-mail:": "teste@email.com",
  "1. Tento entender...": 7,
  "2. Espero ter todos...": 4,
  ...
  "24. Bons ouvintes...": 7
}
```

---

## 🎯 Resultado Esperado

1. ✅ Participante responde o Forms
2. ✅ N8N processa em ~5-10 segundos
3. ✅ PDF é gerado na VPS
4. ✅ Email enviado com PDF anexado
5. ✅ Participante recebe em até 1 minuto

---

**Precisa de ajuda?** Consulte os logs:
- N8N: Interface web → Executions
- VPS: `pm2 logs pdf-generator`
