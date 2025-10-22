# 🏁 Calculadora de Contratos Pódium - Versão 2.1

**Ferramenta de Previsibilidade Comercial - Método Pódium**

Uma calculadora interativa e modular desenvolvida em JavaScript puro que ajuda os pilotos da comunidade Pódium a determinar quantas ligações são necessárias para atingir suas metas de faturamento. **Agora com captura de leads e integração com Supabase!**

---

## ✨ Novidades da Versão 2.1

### 🔓 Pop-up de Captura de Leads
- ✅ Captura automática de dados (Nome, Telefone, E-mail)
- ✅ Máscara de telefone automática
- ✅ Validação de dados
- ✅ Aparece apenas uma vez por navegador

### 📊 Integração com Supabase
- ✅ Envia dados automaticamente para banco de dados em nuvem
- ✅ Visualize todos os leads capturados
- ✅ Dados persistentes e seguros
- ✅ Pronto para integração com outros serviços

### 🎨 Design Aprimorado
- Pop-up elegante com animação suave
- Branding completo do Mundo Pódium
- Responsivo (desktop, tablet, celular)

---

## 📁 Estrutura do Projeto

```
calculadora-podium-js/
├── index.html                  # Arquivo HTML (com modal de leads)
├── styles.css                  # Arquivo CSS (com estilos do modal)
├── script.js                   # Arquivo JavaScript (com Supabase)
├── config.js                   # Configuração do Supabase (NOVO)
├── README.md                   # Este arquivo
├── GUIA_ATUALIZACAO_COMPLETO.md # Guia passo a passo completo
├── GUIA_SUPABASE.md            # Guia detalhado do Supabase
└── DEPLOY_PERMANENTE.md        # Guia de deploy no Vercel
```

---

## 🚀 Como Usar

### 1. Localmente

1. Clone ou baixe os arquivos:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `config.js`

2. Coloque os arquivos na mesma pasta

3. Abra o `index.html` em seu navegador

4. Preencha o formulário de captura de leads

5. Acesse a calculadora e comece a usar!

### 2. Online

Acesse: **https://calculadora-podium.vercel.app**

---

## 📊 Como Funciona

### Passo 1: Captura de Leads

Ao acessar a calculadora pela primeira vez, um pop-up aparece solicitando:
- Nome completo
- Telefone com DDD (formato: (XX) 99999-9999)
- E-mail

Os dados são salvos no Supabase automaticamente.

### Passo 2: Desbloqueio da Calculadora

Após preencher o formulário, o pop-up desaparece e você tem acesso completo à calculadora.

### Passo 3: Use a Calculadora

- Preencha sua meta de faturamento
- Preencha seu ticket médio
- Ajuste as taxas de conversão
- Veja o resultado: quantas ligações você precisa fazer!

---

## 🔧 Funcionalidades

### Calculadora
- ✅ Cálculos automáticos em tempo real
- ✅ Persistência de dados (localStorage)
- ✅ Compartilhamento via URL
- ✅ Exportação de dados em JSON
- ✅ Impressão
- ✅ Responsivo (desktop, tablet, celular)

### Captura de Leads
- ✅ Pop-up elegante com animação
- ✅ Máscara de telefone automática
- ✅ Validação de dados
- ✅ Persistência (aparece apenas uma vez)
- ✅ Dados salvos no Supabase
- ✅ Pronto para integração com serviços externos

---

## ⚙️ Configuração do Supabase

### Pré-requisitos

1. Conta no Supabase (gratuita)
2. Projeto criado
3. Tabela "leads" criada
4. Credenciais obtidas (URL e ANON_KEY)

### Configurar a Calculadora

1. Abra o arquivo `config.js`
2. Substitua os valores:

```javascript
const SUPABASE_CONFIG = {
    URL: 'https://seu-projeto.supabase.co',  // Sua Project URL
    ANON_KEY: 'sua-chave-publica-aqui',      // Sua ANON_KEY
    TABLE_NAME: 'leads'
};
```

3. Salve o arquivo

Para instruções detalhadas, consulte **GUIA_SUPABASE.md**

---

## 💾 Dados Capturados

Os dados do lead são salvos no Supabase com:

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

## 🎨 Customização

### Mudar Cores

Edite `styles.css`:
```css
.modal-header {
    border-bottom: 3px solid #F2b705; /* Cor principal */
}

.btn-unlock {
    background-color: #F2b705; /* Cor do botão */
}
```

### Mudar Textos

Edite `index.html` e procure pela seção `<!-- Modal de Captura de Leads -->`

### Adicionar Campos

Edite `index.html` para adicionar mais campos e `script.js` para validar

---

## 🧪 Testando Localmente

1. Abra o arquivo `index.html` em seu navegador
2. Abra o DevTools (F12)
3. Vá para a aba "Console"
4. Teste os métodos:

```javascript
// Ver dados do lead
console.log(window.capturaLeads.obterDados());

// Resetar captura (para testes)
window.capturaLeads.resetar();

// Ver dados da calculadora
console.log(window.calculadora.exportarDados());
```

---

## 📱 Compatibilidade

- ✅ Chrome, Firefox, Safari, Edge (versões recentes)
- ✅ Desktop, Tablet, Celular
- ✅ Funciona offline (após primeiro carregamento)

---

## 🚀 Deploy no Vercel

A calculadora está hospedada no Vercel com deploy automático:

1. Qualquer mudança no GitHub é detectada automaticamente
2. Deploy acontece em 1-2 minutos
3. Seu site é atualizado instantaneamente

Para instruções detalhadas, consulte **DEPLOY_PERMANENTE.md**

---

## 📊 Estrutura de Dados

### Classe CapturadeLeads

```javascript
class CapturadeLeads {
    jaFoiCapturado()      // Verifica se lead foi capturado
    salvarLeadLocal()     // Salva no localStorage
    enviarParaSupabase()  // Envia para Supabase
    mostrarModal()        // Mostra o pop-up
    esconderModal()       // Esconde o pop-up
    obterDados()          // Obtém dados do lead
    resetar()             // Reseta a captura (testes)
    validarDados()        // Valida os dados
}
```

### Classe CalculadoraPodium

```javascript
class CalculadoraPodium {
    calcular()            // Realiza os cálculos
    atualizarDisplays()   // Atualiza a interface
    salvarDados()         // Salva no localStorage
    carregarDados()       // Carrega do localStorage
    exportarDados()       // Exporta em JSON
    compartilhar()        // Gera URL compartilhável
    resetar()             // Reseta valores
}
```

---

## 🐛 Troubleshooting

### O pop-up não aparece
- Abra em uma aba anônima/privada
- Ou execute: `window.capturaLeads.resetar()`

### Os dados não são salvos
- Verifique se o localStorage está ativado
- Tente em outro navegador

### O lead não é enviado para Supabase
- Verifique se as credenciais em `config.js` estão corretas
- Abra o console (F12) e procure por erros
- Verifique se a tabela "leads" existe no Supabase

### Erro: "Invalid API Key"
- Copie novamente a ANON_KEY do Supabase
- Certifique-se de não ter espaços em branco extras

---

## 📝 Licença

Este projeto é fornecido gratuitamente para a comunidade Pódium.

---

## 📞 Suporte

- 📧 **Email:** romulo.freitas@combustivelmv.com
- 📱 **WhatsApp:** (31) 994293099
- 🌐 **Website:** [Método Pódium](https://www.metodopodium.com.br)

---

## 🎓 Aprendizado

Este projeto demonstra:
- ✅ Programação orientada a objetos em JavaScript
- ✅ Manipulação do DOM
- ✅ localStorage API
- ✅ Fetch API (integração com Supabase)
- ✅ Validação de formulários
- ✅ Máscaras de entrada
- ✅ Responsividade CSS
- ✅ Boas práticas de código

---

## 🏁 Versões

### v2.1 (Outubro 2025)
- ✅ Adicionado pop-up de captura de leads
- ✅ Integração com Supabase
- ✅ Máscara de telefone automática
- ✅ Validação de formulário
- ✅ Persistência de dados
- ✅ Pronto para integração externa

### v2.0 (Outubro 2025)
- ✅ Adicionado pop-up de captura de leads
- ✅ Máscara de telefone automática
- ✅ Validação de formulário
- ✅ Persistência de dados

### v1.0 (Outubro 2025)
- ✅ Versão inicial em JavaScript
- ✅ Classe CalculadoraPodium
- ✅ localStorage e URL sharing
- ✅ Exportação de dados
- ✅ Responsividade completa

---

## 🎉 Agradecimentos

Obrigado a todos os pilotos da comunidade Pódium que testaram e forneceram feedback!

---

**Desenvolvido com 🏁 para os Pilotos Pódium**

**Lembre-se: "Do zero ao contrato fechado, juntos no pódium"**
