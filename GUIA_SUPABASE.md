# 🚀 GUIA COMPLETO - INTEGRAÇÃO COM SUPABASE

## 📋 O QUE FOI ADICIONADO?

A calculadora agora envia automaticamente os dados dos leads capturados para o Supabase, um banco de dados em nuvem gratuito e poderoso.

### Dados Enviados:
- ✅ Nome completo
- ✅ Telefone com DDD
- ✅ E-mail
- ✅ Data e hora da captura
- ✅ User Agent (navegador/dispositivo)
- ✅ IP do usuário

---

## 🎯 PASSO A PASSO PARA CONFIGURAR

### PASSO 1: Criar Conta no Supabase

1. Acesse **https://supabase.com**
2. Clique em **"Sign Up"**
3. Escolha uma opção de login (Google, GitHub, etc)
4. Complete o cadastro

### PASSO 2: Criar um Novo Projeto

1. No dashboard do Supabase, clique em **"New Project"**
2. Preencha os dados:
   - **Name:** `calculadora-podium`
   - **Database Password:** Crie uma senha forte
   - **Region:** Escolha a região mais próxima (ex: South America - São Paulo)
3. Clique em **"Create new project"**
4. Aguarde 2-3 minutos para o projeto ser criado

### PASSO 3: Criar a Tabela de Leads

1. Após o projeto ser criado, clique em **"SQL Editor"** (no menu lateral)
2. Clique em **"New Query"**
3. Cole este código SQL:

```sql
CREATE TABLE leads (
  id BIGSERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  email TEXT NOT NULL,
  data_captura TIMESTAMP DEFAULT NOW(),
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Criar índice para melhor performance
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_telefone ON leads(telefone);
CREATE INDEX idx_leads_data ON leads(data_captura);
```

4. Clique em **"Run"** (botão azul)
5. Você verá a mensagem "Success" se tudo deu certo

### PASSO 4: Configurar Políticas de Segurança (RLS)

**⚠️ IMPORTANTE:** Este passo implementa políticas de segurança robustas para proteger seus dados contra spam e abuso.

1. Clique em **"SQL Editor"** (menu lateral)
2. Clique em **"New Query"**
3. Copie todo o conteúdo do arquivo `supabase-security-policies.sql` (criado na raiz do projeto)
4. Cole o código SQL no editor
5. Clique em **"Run"** (botão azul)
6. Você verá mensagens de sucesso se tudo foi aplicado corretamente

**🔐 O que este script implementa:**
- ✅ **Row Level Security (RLS)** habilitado
- ✅ **INSERT público** permitido (captura de leads)
- ✅ **SELECT/UPDATE/DELETE negados** para usuários anônimos
- ✅ **Rate limiting** (máximo 3 envios por IP por hora)
- ✅ **Validação de email** (bloqueia domínios descartáveis)
- ✅ **Triggers de validação** automáticos

### PASSO 5: Obter as Credenciais

1. Clique em **"Settings"** (menu lateral)
2. Clique em **"API"**
3. Você verá:
   - **Project URL:** Copie este valor (ex: https://xyzabc.supabase.co)
   - **anon public:** Copie este valor (é a chave pública)

### PASSO 6: Configurar a Calculadora

1. Abra o arquivo **`config.js`** da calculadora
2. Substitua os valores:

```javascript
const SUPABASE_CONFIG = {
    URL: 'https://seu-projeto.supabase.co',  // Cole a Project URL aqui
    ANON_KEY: 'sua-chave-publica-aqui',      // Cole a anon public aqui
    TABLE_NAME: 'leads'
};
```

3. Salve o arquivo

### PASSO 7: Testar Localmente

1. Abra o arquivo `index.html` em seu navegador
2. Abra em uma **aba anônima** (para ver o pop-up)
3. Preencha o formulário de leads
4. Clique em **"Desbloquear Calculadora"**
5. Você verá a mensagem "✅ Lead enviado para Supabase com sucesso!" no console

### PASSO 8: Verificar os Dados no Supabase

1. Acesse o dashboard do Supabase
2. Clique em **"Table Editor"** (menu lateral)
3. Procure pela tabela **"leads"**
4. Você verá os dados capturados listados!

### PASSO 9: Atualizar no GitHub

1. Adicione os arquivos atualizados ao seu repositório:
   - `config.js` (NOVO)
   - `script.js` (ATUALIZADO)
   - `index.html` (ATUALIZADO)

2. Faça commit:
   ```
   git add config.js script.js index.html
   git commit -m "Adicionar integração com Supabase"
   git push origin main
   ```

3. O Vercel detectará as mudanças e fará deploy automaticamente

### PASSO 10: Testar Online

1. Acesse sua calculadora: https://calculadora-podium.vercel.app
2. Abra em uma **aba anônima**
3. Preencha o formulário
4. Verifique no Supabase se o lead foi registrado

---

## 🔐 SEGURANÇA

### Políticas de Segurança Implementadas

A calculadora agora possui **políticas de segurança robustas** que protegem contra:

#### 🛡️ Rate Limiting
- **Máximo 3 envios por IP por hora**
- Previne spam e ataques automatizados
- Mensagem amigável quando limite é atingido

#### 📧 Validação de Email
- **Bloqueia domínios descartáveis** (tempmail.org, 10minutemail.com, etc.)
- Lista com mais de 100 domínios temporários conhecidos
- Validação de formato de email

#### 🔒 Row Level Security (RLS)
- **INSERT público** - Qualquer um pode enviar leads
- **SELECT/UPDATE/DELETE negados** - Dados só visíveis no Dashboard
- **Triggers de validação** - Verificações automáticas antes do INSERT

#### ✅ Validações Automáticas
- **Nome:** Mínimo 3 caracteres, não pode ser só números
- **Telefone:** Formato válido com pelo menos 10 dígitos
- **Email:** Formato válido + domínio não descartável
- **Timestamps:** Definidos automaticamente

### Chave Pública vs Chave Privada

- **anon public (usada na calculadora):** Segura para usar no frontend com RLS
- **service_role (NÃO use no frontend):** Use apenas no backend/admin

### Personalização das Políticas

Para ajustar as configurações de segurança, edite o arquivo `supabase-security-policies.sql`:

```sql
-- Alterar limite de rate limiting (padrão: 3 envios/hora)
check_rate_limit(ip_address, 5, '1 hour')  -- 5 envios por hora

-- Adicionar novos domínios descartáveis
'novodominio.com', 'outrodescartavel.net'
```

---

## 📊 VISUALIZAR OS DADOS

### No Supabase Dashboard

1. Clique em **"Table Editor"**
2. Procure pela tabela **"leads"**
3. Veja todos os leads capturados

### Exportar Dados

1. Clique na tabela **"leads"**
2. Clique no menu (⋮) no canto superior direito
3. Clique em **"Export as CSV"**
4. Você terá um arquivo CSV com todos os dados

### Criar Relatórios

1. Clique em **"SQL Editor"**
2. Crie queries customizadas:

```sql
-- Contar total de leads
SELECT COUNT(*) as total_leads FROM leads;

-- Leads por dia
SELECT DATE(data_captura) as data, COUNT(*) as total 
FROM leads 
GROUP BY DATE(data_captura);

-- Leads por domínio de e-mail
SELECT SPLIT_PART(email, '@', 2) as dominio, COUNT(*) as total 
FROM leads 
GROUP BY SPLIT_PART(email, '@', 2);
```

---

## 🔧 TROUBLESHOOTING

### O lead não está sendo enviado

**Solução 1:** Verifique o console (F12 → Console)
- Se vir erro de CORS, configure as permissões no Supabase
- Se vir erro de rate limiting, aguarde 1 hora ou use outro IP

**Solução 2:** Verifique a configuração em `config.js`
- URL e ANON_KEY estão corretos?
- Não há espaços em branco extras?

**Solução 3:** Verifique se a tabela existe
- No Supabase, vá em "Table Editor"
- A tabela "leads" está lá?

**Solução 4:** Verifique as políticas de segurança
- As políticas RLS foram aplicadas corretamente?
- Execute o script `supabase-security-policies.sql` novamente

### Erro: "Invalid API Key"

**Solução:** Você copiou a chave corretamente?
- Vá em Settings → API
- Copie novamente a "anon public"
- Cole em `config.js`

### Erro: "CORS error"

**Solução:** Configure CORS no Supabase
1. Vá em Settings → API
2. Procure por "CORS"
3. Adicione sua URL do Vercel

### Erro: "Rate limit exceeded"

**Solução:** Limite de envios atingido
- Máximo 3 envios por IP por hora
- Aguarde 1 hora ou teste de outro dispositivo/rede
- Para desenvolvimento, ajuste o limite no SQL

### Erro: "Email domain not allowed"

**Solução:** Email descartável detectado
- Use um email válido (Gmail, Outlook, etc.)
- Domínios temporários são bloqueados por segurança
- Para desenvolvimento, remova o domínio da lista no SQL

### Erro: "Validation failed"

**Solução:** Dados inválidos
- **Nome:** Mínimo 3 caracteres, não pode ser só números
- **Telefone:** Use formato (XX) XXXXX-XXXX
- **Email:** Formato válido (usuario@dominio.com)

---

## 📱 DADOS CAPTURADOS

Cada lead registrado no Supabase contém:

```json
{
  "id": 1,
  "nome": "João Silva",
  "telefone": "(31) 99429-3099",
  "email": "joao@email.com",
  "data_captura": "2025-10-21T15:30:00.000Z",
  "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
  "ip_address": "192.168.1.1",
  "created_at": "2025-10-21T15:30:00.000Z"
}
```

---

## 🚀 PRÓXIMOS PASSOS

### 1. Automações com Supabase Functions

Você pode criar funções serverless para:
- Enviar e-mail de boas-vindas
- Integrar com Hotmart
- Sincronizar com CRM

### 2. Webhooks

Configure webhooks para:
- Enviar dados para Zapier
- Integrar com RD Station
- Sincronizar com WhatsApp

### 3. Dashboard em Tempo Real

Use Supabase Realtime para:
- Ver leads chegando em tempo real
- Criar dashboard customizado
- Notificações automáticas

---

## 📞 SUPORTE

### Documentação Supabase

- **Oficial:** https://supabase.com/docs
- **SQL Editor:** https://supabase.com/docs/guides/database/sql-editor
- **Table Editor:** https://supabase.com/docs/guides/database/tables
- **API:** https://supabase.com/docs/guides/api

### Comunidade

- **Discord:** https://discord.supabase.com
- **GitHub:** https://github.com/supabase/supabase

---

## 💡 DICAS

### 1. Backup Regular

1. Vá em Settings → Backups
2. Configure backups automáticos
3. Você pode restaurar a qualquer momento

### 2. Monitoramento

1. Vá em Settings → Logs
2. Veja todas as requisições
3. Identifique problemas

### 3. Performance

Para melhor performance:
- Crie índices nas colunas mais consultadas
- Use paginação ao buscar muitos dados
- Limite o número de colunas retornadas

---

## 🎯 CHECKLIST FINAL

- [ ] Conta Supabase criada
- [ ] Projeto Supabase criado
- [ ] Tabela "leads" criada
- [ ] **Políticas de segurança aplicadas** (supabase-security-policies.sql)
- [ ] RLS habilitado e funcionando
- [ ] Rate limiting testado
- [ ] Validação de email testada
- [ ] Credenciais obtidas
- [ ] `config.js` preenchido
- [ ] Testado localmente
- [ ] Dados aparecem no Supabase
- [ ] Arquivos atualizados no GitHub
- [ ] Deploy no Vercel concluído
- [ ] Testado online

---

## 🏁 VOCÊ CONSEGUIU!

Sua calculadora agora está capturando leads e enviando para o Supabase! 🎉

**Próximo passo:** Integrar com Hotmart, RD Station ou outro serviço que você use.

---

**Desenvolvido com 🏁 para os Pilotos Pódium**

**Lembre-se: "Do zero ao contrato fechado, juntos no pódium"**
