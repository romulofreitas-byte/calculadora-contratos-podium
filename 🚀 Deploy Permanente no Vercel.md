# 🚀 GUIA DE DEPLOY PERMANENTE NO VERCEL

## 📍 Situação Atual

Sua calculadora está hospedada no Vercel com a versão 2.1 (com Supabase integrado).

---

## 🎯 O Que é Vercel?

Vercel é uma plataforma de hospedagem gratuita que:
- ✅ Hospeda seu site gratuitamente
- ✅ Faz deploy automático quando você atualiza o GitHub
- ✅ Fornece um domínio profissional
- ✅ Oferece certificado SSL automático
- ✅ Monitora performance e erros

---

## 🔄 Como Funciona o Deploy Automático

```
Você atualiza GitHub
        ↓
Vercel detecta mudanças
        ↓
Vercel faz deploy automático
        ↓
Seu site é atualizado em 1-2 minutos
```

---

## 📊 Seu Projeto no Vercel

- **URL:** https://calculadora-podium.vercel.app
- **Projeto:** calculadora-podium
- **Repositório:** GitHub (seu-usuario/calculadora-podium)
- **Atualizações:** Automáticas quando você faz commit no GitHub

---

## 🔧 Como Atualizar a Calculadora

### Passo 1: Fazer Mudanças no GitHub

1. Acesse seu repositório: https://github.com/seu-usuario/calculadora-podium
2. Edite os arquivos que deseja atualizar
3. Faça commit das mudanças

### Passo 2: Vercel Detecta Automaticamente

1. O Vercel monitora seu repositório GitHub
2. Quando você faz commit, o Vercel detecta automaticamente
3. Um novo deploy inicia em segundos

### Passo 3: Aguardar Deploy

1. Acesse https://vercel.com/dashboard
2. Clique no projeto "calculadora-podium"
3. Você verá um novo deployment iniciando
4. Aguarde 1-2 minutos para completar
5. Você verá "Deployment successful" em verde

### Passo 4: Seu Site é Atualizado

1. A URL https://calculadora-podium.vercel.app é atualizada automaticamente
2. Não é necessário fazer nada manual
3. Seus usuários verão a versão mais recente

---

## 📈 Monitorar o Projeto

### No Vercel Dashboard

1. Acesse https://vercel.com/dashboard
2. Clique em "calculadora-podium"
3. Você verá:
   - **Deployments:** Histórico de todos os deploys
   - **Analytics:** Número de visitas, performance
   - **Settings:** Configurações do projeto
   - **Logs:** Erros e eventos

### Ver Histórico de Deploys

1. No Vercel, clique em "Deployments"
2. Você verá uma lista com:
   - Data e hora do deploy
   - Status (successful, failed, etc)
   - Commit do GitHub
   - Tempo de deploy

### Ver Analytics

1. No Vercel, clique em "Analytics"
2. Você verá:
   - Número total de visitas
   - Visitantes por dia
   - Países de origem
   - Navegadores usados
   - Tempo de carregamento

---

## 🔐 Segurança

### Proteção de Dados

- ✅ Certificado SSL automático (HTTPS)
- ✅ Dados criptografados em trânsito
- ✅ Supabase protege os dados no servidor
- ✅ Chaves públicas seguras para uso no frontend

### Boas Práticas

1. **Nunca compartilhe sua ANON_KEY** do Supabase em público
2. **Use apenas a chave pública** no frontend (config.js)
3. **Mantenha seu GitHub privado** se tiver dados sensíveis
4. **Faça backup regular** dos seus dados no Supabase

---

## 🆘 Troubleshooting

### Deploy não inicia

**Solução:**
1. Aguarde alguns segundos
2. Atualize a página do Vercel
3. Verifique se o commit foi feito no GitHub
4. Verifique se não há erros no código

### Deploy falha

**Solução:**
1. Clique no deployment que falhou
2. Veja a mensagem de erro
3. Corrija o erro no GitHub
4. Faça novo commit

### Site não atualiza

**Solução:**
1. Aguarde 2-3 minutos
2. Limpe o cache do navegador (Ctrl+Shift+Delete)
3. Abra em uma aba anônima
4. Verifique se o deployment foi bem-sucedido

### Erro 404 na página

**Solução:**
1. Verifique se o arquivo index.html existe no GitHub
2. Verifique se o arquivo está na raiz do repositório
3. Faça novo commit

---

## 📊 Relatórios e Análises

### Exportar Dados de Leads

1. Acesse o Supabase: https://app.supabase.com
2. Clique em "Table Editor"
3. Clique na tabela "leads"
4. Clique no menu (⋮) no canto superior direito
5. Clique em "Export as CSV"
6. Você terá um arquivo CSV com todos os leads

### Criar Relatórios Customizados

No Supabase SQL Editor, você pode criar queries:

```sql
-- Total de leads
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

## 🎯 Próximos Passos

### 1. Monitorar Leads

- Verifique regularmente os leads capturados no Supabase
- Analise padrões e tendências
- Identifique oportunidades

### 2. Integrar com Outros Serviços

- Hotmart (sincronizar leads)
- RD Station (automação de marketing)
- Zapier (automações customizadas)
- WhatsApp (notificações automáticas)

### 3. Melhorar a Calculadora

- Coletar feedback dos pilotos
- Adicionar novas funcionalidades
- Otimizar performance
- Melhorar design

### 4. Escalar

- Aumentar o número de pilotos
- Criar versões para outros produtos
- Integrar com sua plataforma principal

---

## 📞 Suporte

### Documentação

- **Vercel:** https://vercel.com/docs
- **Supabase:** https://supabase.com/docs
- **GitHub:** https://docs.github.com

### Comunidades

- **Vercel Discord:** https://discord.gg/vercel
- **Supabase Discord:** https://discord.supabase.com
- **GitHub Discussions:** https://github.com/discussions

---

## 💡 Dicas

### 1. Usar Domínio Próprio

Se quiser usar um domínio como `calculadora.mundopodium.com.br`:

1. No Vercel, vá em "Settings" → "Domains"
2. Adicione seu domínio
3. Siga as instruções para apontar o DNS
4. Seu site estará disponível no domínio personalizado

### 2. Configurar Variáveis de Ambiente do Supabase

**IMPORTANTE:** Para usar a integração com Supabase, você precisa configurar as variáveis de ambiente no Vercel.

#### Passo 1: Obter Credenciais do Supabase

1. Acesse https://supabase.com
2. Faça login na sua conta
3. Selecione seu projeto
4. Vá em **Settings** → **API**
5. Copie as seguintes informações:
   - **Project URL** (exemplo: https://xyzabc.supabase.co)
   - **anon public** (chave longa que começa com eyJ...)

#### Passo 2: Configurar no Vercel

1. Acesse https://vercel.com/dashboard
2. Clique no projeto "calculadora-podium"
3. Vá em **Settings** → **Environment Variables**
4. Adicione as seguintes variáveis:

   **Variável 1:**
   - **Name:** `VITE_SUPABASE_URL`
   - **Value:** Cole a Project URL do Supabase
   - **Environment:** Production, Preview, Development (marque todos)

   **Variável 2:**
   - **Name:** `VITE_SUPABASE_ANON_KEY`
   - **Value:** Cole a anon public key do Supabase
   - **Environment:** Production, Preview, Development (marque todos)

5. Clique em **Save** para cada variável

#### Passo 3: Fazer Novo Deploy

Após adicionar as variáveis de ambiente:

1. Vá em **Deployments**
2. Clique nos três pontos (...) do último deployment
3. Clique em **Redeploy**
4. Aguarde o novo deploy completar

#### Passo 4: Testar

1. Acesse https://calculadora-podium.vercel.app
2. Abra em uma aba anônima
3. Preencha o formulário de leads
4. Verifique no Supabase se o lead foi registrado

#### Troubleshooting

**Erro: "Configuração do Supabase não encontrada"**
- Verifique se as variáveis de ambiente foram adicionadas corretamente
- Certifique-se de que fez um novo deploy após adicionar as variáveis
- Verifique se os nomes das variáveis estão exatamente como: `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`

**Leads não aparecem no Supabase**
- Verifique se a tabela "leads" existe no Supabase
- Verifique se as permissões RLS estão configuradas
- Abra o console do navegador (F12) para ver mensagens de erro

### 3. Webhooks

Configure webhooks para:
- Notificações quando há novo deploy
- Integração com Slack
- Automações customizadas

---

## 🏁 Você Conseguiu!

Sua calculadora está online permanentemente no Vercel com:

✅ Hospedagem gratuita
✅ Domínio profissional
✅ Deploy automático
✅ Certificado SSL
✅ Analytics
✅ Integração com Supabase

---

**Desenvolvido com 🏁 para os Pilotos Pódium**

**Lembre-se: "Do zero ao contrato fechado, juntos no pódium"**
