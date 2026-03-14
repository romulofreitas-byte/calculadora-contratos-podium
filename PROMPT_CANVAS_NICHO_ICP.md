# 🎯 PROMPT COMPLETO: Canvas de Nicho e ICP - Método Pódium

## 📋 CONTEXTO DO PROJETO

Você está criando uma aplicação web standalone chamada **Canvas de Nicho e ICP - Método Pódium**. Esta é uma ferramenta interativa para ajudar empreendedores a definir seu nicho de mercado e perfil de cliente ideal (ICP) usando a metodologia Pódium.

---

## 🎨 ESTRUTURA DO PROJETO

O projeto deve ter a seguinte estrutura de arquivos:

```
canvas-nicho-icp-podium/
├── index.html              (Página principal do Canvas)
├── script.js               (Lógica JavaScript)
├── styles.css              (Estilos CSS)
├── config.js               (Configuração do Supabase)
├── package.json            (Dependências do projeto)
├── vercel.json             (Configuração de deploy)
├── .env.example            (Exemplo de variáveis de ambiente)
├── GUIA_CANVAS.md          (Guia de utilização)
├── GUIA_SUPABASE.md        (Instruções do Supabase)
├── DEPLOY_VERCEL.md        (Instruções de deploy)
└── supabase-security-policies.sql (Políticas de segurança)
```

---

## 🔐 AUTENTICAÇÃO E PROTEÇÃO

### Modal de Senha (Simplificado)

**IMPORTANTE:** A aplicação deve ter um modal de senha simples que aparece ao carregar a página:

- **Senha:** `mundopodium`
- **Comportamento:**
  - Modal aparece sempre que a página é carregada
  - Verifica se a senha já foi validada (localStorage)
  - Se senha correta: libera acesso ao canvas
  - Se senha incorreta: mantém modal bloqueado
  - A senha validada deve ser salva no localStorage por 30 dias
  - Não envia dados para o Supabase (apenas valida localmente)

**Código de referência para o modal:**

```html
<!-- Modal de Senha -->
<div id="passwordModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h2>🏁 Canvas Exclusivo - Método Pódium</h2>
            <p>Digite a senha para acessar</p>
        </div>
        
        <form id="passwordForm" class="password-form">
            <div class="form-group">
                <label for="password">Senha de Acesso</label>
                <input type="password" id="password" name="password" placeholder="Digite a senha" required>
            </div>
            
            <button type="submit" class="btn-unlock">🔓 Acessar Canvas</button>
        </form>
        
        <div class="modal-footer">
            <p>Entre em contato com a equipe Pódium se você não tem a senha</p>
        </div>
    </div>
</div>
```

---

## 🎨 DESIGN E HTML BASE

Use o HTML fornecido abaixo como base. **IMPORTANTE:** Mantenha TODA a estrutura e funcionalidade do HTML original, apenas adapte para:

1. Adicionar o modal de senha
2. Adicionar o botão da comunidade WhatsApp
3. Integrar com Supabase para salvar dados do canvas
4. Adicionar Vercel Analytics

### HTML Base (Fornecido pelo Usuário)

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Canvas de Nicho e ICP - Método Pódium</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <!-- HEADER -->
        <div class="header">
            <h1>🏁 Canvas de Nicho e ICP</h1>
            <p>Método Pódium - Primeira Fase: Definição de Nicho e Perfil de Cliente Ideal</p>
            
            <div class="triada-info">
                <div class="triada-item">
                    <div class="triada-icon">✓</div>
                    <span>Eu sei prestar esse serviço</span>
                </div>
                <div class="triada-item">
                    <div class="triada-icon">✓</div>
                    <span>O mercado precisa do meu serviço</span>
                </div>
                <div class="triada-item">
                    <div class="triada-icon">✓</div>
                    <span>O mercado está disposto a pagar</span>
                </div>
            </div>
        </div>

        <!-- CANVAS PRINCIPAL -->
        <form id="canvasForm">
            <div class="canvas-wrapper">
                <!-- TRÍADE DO NICHO -->
                <div class="canvas-section triada">
                    <h2>🎯 A TRÍADE DO NICHO - Validação Fundamental</h2>
                    <p style="margin-bottom: 20px; font-size: 0.95em;">Antes de escolher um nicho, você PRECISA validar esses três pilares. Se um deles falhar, o nicho não é viável.</p>
                    
                    <div class="triada-grid">
                        <div class="triada-box">
                            <h3>1️⃣ EU SEI PRESTAR</h3>
                            <p>Tenho expertise, experiência e capacidade técnica para entregar esse serviço com excelência.</p>
                            <div class="triada-checkbox">
                                <input type="checkbox" id="triada1" name="triada1">
                                <label for="triada1">Validado ✓</label>
                            </div>
                        </div>
                        
                        <div class="triada-box">
                            <h3>2️⃣ MERCADO PRECISA</h3>
                            <p>Existe uma dor real, urgente e recorrente nesse mercado que meu serviço resolve.</p>
                            <div class="triada-checkbox">
                                <input type="checkbox" id="triada2" name="triada2">
                                <label for="triada2">Validado ✓</label>
                            </div>
                        </div>
                        
                        <div class="triada-box">
                            <h3>3️⃣ MERCADO PAGA</h3>
                            <p>O mercado tem orçamento e está disposto a pagar pelo meu serviço.</p>
                            <div class="triada-checkbox">
                                <input type="checkbox" id="triada3" name="triada3">
                                <label for="triada3">Validado ✓</label>
                            </div>
                        </div>
                    </div>

                    <div class="resultado" id="resultadoTriada">
                        <h4>✅ TRÍADE VALIDADA!</h4>
                        <p>Você passou na validação fundamental. Agora é hora de detalhar seu nicho e ICP.</p>
                    </div>
                </div>

                <!-- SEÇÕES DO CANVAS -->
                <div class="canvas-grid">
                    <!-- 1. NICHO -->
                    <div class="canvas-section">
                        <h2>1. NICHO</h2>
                        <p style="font-size: 0.9em; color: #666; margin-bottom: 15px;">Qual é o segmento de mercado específico que você vai focar?</p>
                        <textarea id="nicho" name="nicho" placeholder="Ex: Barbearias, Advogados autônomos, Engenheiros, etc."></textarea>
                        <p style="font-size: 0.85em; color: #999; margin-top: 10px;">💡 Dica: Quanto mais específico, melhor!</p>
                    </div>

                    <!-- 2. DORES DO MERCADO -->
                    <div class="canvas-section">
                        <h2>2. DORES PRINCIPAIS</h2>
                        <p style="font-size: 0.9em; color: #666; margin-bottom: 15px;">Quais são as 3 principais dores desse mercado?</p>
                        <textarea id="dores" name="dores" placeholder="1. Dor 1&#10;2. Dor 2&#10;3. Dor 3"></textarea>
                    </div>

                    <!-- 3. CAPACIDADE FINANCEIRA -->
                    <div class="canvas-section">
                        <h2>3. CAPACIDADE FINANCEIRA</h2>
                        <p style="font-size: 0.9em; color: #666; margin-bottom: 15px;">Qual é o orçamento típico desse mercado?</p>
                        <textarea id="financeiro" name="financeiro" placeholder="Faturamento mensal, orçamento disponível, ticket médio esperado, etc."></textarea>
                    </div>

                    <!-- 4. ACESSO AO DECISOR -->
                    <div class="canvas-section">
                        <h2>4. ACESSO AO DECISOR</h2>
                        <p style="font-size: 0.9em; color: #666; margin-bottom: 15px;">Como você vai encontrar e contatar o tomador de decisão?</p>
                        <textarea id="acesso" name="acesso" placeholder="Google Maps, LinkedIn, OAB, CREA, Portais específicos, etc."></textarea>
                    </div>

                    <!-- 5. ENTREGÁVEIS (JORNADAS) -->
                    <div class="canvas-section">
                        <h2>5. ENTREGÁVEIS (JORNADAS)</h2>
                        <p style="font-size: 0.9em; color: #666; margin-bottom: 15px;">Quais são os serviços/soluções que você vai oferecer?</p>
                        <textarea id="entregaveis" name="entregaveis" placeholder="Jornada 1: ...&#10;Jornada 2: ...&#10;Jornada 3: ..."></textarea>
                    </div>

                    <!-- 6. PRECIFICAÇÃO -->
                    <div class="canvas-section">
                        <h2>6. PRECIFICAÇÃO</h2>
                        <p style="font-size: 0.9em; color: #666; margin-bottom: 15px;">Qual é o preço de cada jornada?</p>
                        <textarea id="precificacao" name="precificacao" placeholder="Jornada 1: R$ ...&#10;Jornada 2: R$ ...&#10;Jornada 3: R$ ..."></textarea>
                    </div>
                </div>

                <!-- SEÇÃO DE ANÁLISE -->
                <div class="analise-section">
                    <h3>✓ CHECKLIST DE VALIDAÇÃO</h3>
                    <p style="margin-bottom: 20px; color: #666;">Antes de começar a prospectar, valide esses pontos:</p>
                    
                    <div class="checklist">
                        <div class="checklist-item">
                            <input type="checkbox" id="check1" name="check1">
                            <label for="check1">Tríade do nicho validada (3/3)</label>
                        </div>
                        <div class="checklist-item">
                            <input type="checkbox" id="check2" name="check2">
                            <label for="check2">Nicho específico e bem definido</label>
                        </div>
                        <div class="checklist-item">
                            <input type="checkbox" id="check3" name="check3">
                            <label for="check3">Dores do mercado claramente identificadas</label>
                        </div>
                        <div class="checklist-item">
                            <input type="checkbox" id="check4" name="check4">
                            <label for="check4">Capacidade financeira validada</label>
                        </div>
                        <div class="checklist-item">
                            <input type="checkbox" id="check5" name="check5">
                            <label for="check5">Acesso ao decisor confirmado</label>
                        </div>
                        <div class="checklist-item">
                            <input type="checkbox" id="check6" name="check6">
                            <label for="check6">Entregáveis (jornadas) bem estruturadas</label>
                        </div>
                        <div class="checklist-item">
                            <input type="checkbox" id="check7" name="check7">
                            <label for="check7">Precificação estratégica definida</label>
                        </div>
                        <div class="checklist-item">
                            <input type="checkbox" id="check8" name="check8">
                            <label for="check8">Pronto para começar a prospectar</label>
                        </div>
                    </div>
                </div>
            </div>

            <!-- BOTÕES -->
            <div class="button-group">
                <button type="button" class="btn-primary" onclick="salvarDados()">💾 SALVAR DADOS</button>
                <button type="button" class="btn-secondary" onclick="limparDados()">🔄 LIMPAR TUDO</button>
                <button type="button" class="btn-print" onclick="window.print()">🖨️ IMPRIMIR</button>
            </div>
        </form>

        <!-- SEÇÃO DA COMUNIDADE (ADICIONAR ESTA SEÇÃO) -->
        <div class="community-section">
            <div class="community-content">
                <div class="community-icon">📱</div>
                <div class="community-text">
                    <h3>🚀 Comunidade Pódium: Construindo Empresários</h3>
                    <p>Junte-se à nossa comunidade gratuita no WhatsApp e conecte-se com outros empreendedores que estão aplicando o Método Pódium para acelerar seus resultados comerciais.</p>
                    <p><strong>✨ Comunidade 100% gratuita</strong> • Troca de experiências • Networking • Dicas exclusivas</p>
                </div>
            </div>
            <a href="https://chat.whatsapp.com/L4camOPOJMxDb8et6M80oN" target="_blank" rel="noopener noreferrer" class="btn-whatsapp">
                📱 Entrar na Comunidade WhatsApp
            </a>
        </div>

        <!-- FOOTER -->
        <div class="footer">
            <p>Canvas de Nicho e ICP - Método Pódium</p>
            <p>Desenvolvido para a Primeira Fase do Método Pódium: Definição de Nicho e ICP</p>
            <p style="margin-top: 10px; color: #999;">Seus dados são salvos localmente e no Supabase</p>
        </div>
    </div>

    <!-- ADICIONAR: Modal de Senha -->
    <div id="passwordModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>🏁 Canvas Exclusivo - Método Pódium</h2>
                <p>Digite a senha para acessar</p>
            </div>
            
            <form id="passwordForm" class="password-form">
                <div class="form-group">
                    <label for="password">Senha de Acesso</label>
                    <input type="password" id="password" name="password" placeholder="Digite a senha" required>
                </div>
                
                <button type="submit" class="btn-unlock">🔓 Acessar Canvas</button>
            </form>
            
            <div class="modal-footer">
                <p>Entre em contato com a equipe Pódium se você não tem a senha</p>
            </div>
        </div>
    </div>
    
    <script src="config.js"></script>
    <script src="script.js"></script>
    
    <!-- Vercel Analytics -->
    <script>
        window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
    </script>
    <script defer src="/_vercel/insights/script.js"></script>
    
    <!-- Fallback Analytics Script -->
    <script>
        setTimeout(() => {
            if (typeof window.va !== 'function') {
                console.warn('⚠️ Vercel Analytics não carregou automaticamente');
                const script = document.createElement('script');
                script.src = '/_vercel/insights/script.js';
                script.defer = true;
                document.head.appendChild(script);
            } else {
                console.log('✅ Vercel Analytics carregado com sucesso');
            }
        }, 3000);
    </script>
</body>
</html>
```

---

## 💾 INTEGRAÇÃO COM SUPABASE

### Configuração do Supabase

**Tabela no Supabase:** `canvas_data` (NOVA TABELA - separada da tabela de leads)

**Estrutura da Tabela:**

```sql
CREATE TABLE canvas_data (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Identificação do usuário (anônimo - baseado em fingerprint)
    user_fingerprint TEXT NOT NULL,
    
    -- Dados da Tríade
    triada1 BOOLEAN DEFAULT false,
    triada2 BOOLEAN DEFAULT false,
    triada3 BOOLEAN DEFAULT false,
    
    -- Dados do Canvas
    nicho TEXT,
    dores TEXT,
    financeiro TEXT,
    acesso TEXT,
    entregaveis TEXT,
    precificacao TEXT,
    
    -- Checklist
    checks JSONB,
    
    -- Metadados
    user_agent TEXT,
    ip_address TEXT
);

-- Índices
CREATE INDEX idx_canvas_data_user_fingerprint ON canvas_data(user_fingerprint);
CREATE INDEX idx_canvas_data_created_at ON canvas_data(created_at DESC);

-- RLS (Row Level Security)
ALTER TABLE canvas_data ENABLE ROW LEVEL SECURITY;

-- Política: Permitir INSERT com rate limit
CREATE POLICY "Allow insert canvas data" ON canvas_data
    FOR INSERT
    WITH CHECK (
        -- Rate limit: máximo 10 envios por hora por fingerprint
        (
            SELECT COUNT(*) 
            FROM canvas_data 
            WHERE user_fingerprint = NEW.user_fingerprint 
            AND created_at > NOW() - INTERVAL '1 hour'
        ) < 10
    );

-- Política: Permitir SELECT apenas do próprio usuário
CREATE POLICY "Allow select own canvas data" ON canvas_data
    FOR SELECT
    USING (user_fingerprint = current_setting('request.jwt.claims', true)::json->>'user_fingerprint');

-- Política: Permitir UPDATE apenas do próprio usuário
CREATE POLICY "Allow update own canvas data" ON canvas_data
    FOR UPDATE
    USING (user_fingerprint = current_setting('request.jwt.claims', true)::json->>'user_fingerprint')
    WITH CHECK (user_fingerprint = current_setting('request.jwt.claims', true)::json->>'user_fingerprint');
```

### Arquivo config.js

```javascript
/**
 * Configuração do Supabase para Canvas de Nicho e ICP
 */

function getEnvVar(name, defaultValue = null) {
    return window?.[`__ENV_${name}`] || 
           window?.[name] || 
           defaultValue;
}

const SUPABASE_CONFIG = {
    // URL do seu projeto Supabase (MESMA URL da calculadora)
    URL: getEnvVar('VITE_SUPABASE_URL', "https://zqscitdvsqfkhzddzaeh.supabase.co"),
    
    // Chave pública do Supabase (MESMA ANON KEY da calculadora)
    ANON_KEY: getEnvVar('VITE_SUPABASE_ANON_KEY', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpxc2NpdGR2c3Fma2h6ZGR6YWVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNzA0MzAsImV4cCI6MjA3NjY0NjQzMH0.JZmkmdxJTTf42UYY3M4ruunnS5HupXHiTMwK_YDJmAY"),
    
    // Nome da tabela (DIFERENTE da calculadora)
    TABLE_NAME: 'canvas_data'
};

// Senha de acesso ao canvas
const CANVAS_PASSWORD = 'mundopodium';

// Expor configuração
window.SUPABASE_CONFIG = SUPABASE_CONFIG;
window.CANVAS_PASSWORD = CANVAS_PASSWORD;

function validarConfiguracao() {
    if (!SUPABASE_CONFIG.URL || SUPABASE_CONFIG.URL === 'https://seu-projeto.supabase.co') {
        console.error('❌ ERRO: Configure a URL do Supabase');
        return false;
    }
    
    if (!SUPABASE_CONFIG.ANON_KEY || SUPABASE_CONFIG.ANON_KEY === 'sua-chave-publica-aqui') {
        console.error('❌ ERRO: Configure a ANON_KEY do Supabase');
        return false;
    }
    
    console.log('✅ Configuração do Supabase validada!');
    return true;
}

window.addEventListener('DOMContentLoaded', () => {
    validarConfiguracao();
});
```

---

## 📝 ARQUIVO SCRIPT.JS

O arquivo `script.js` deve conter:

1. **Classe PasswordAuth:** Gerencia autenticação por senha
2. **Classe CanvasNichoICP:** Gerencia o canvas (salvar/carregar dados)
3. **Integração com Supabase:** Salva dados do canvas automaticamente
4. **User Fingerprinting:** Gera ID único para cada usuário
5. **Vercel Analytics:** Tracking de eventos

### Estrutura Base do script.js

```javascript
/**
 * Canvas de Nicho e ICP - Método Pódium
 * Versão: 1.0
 */

// ========================================
// CLASSE: Password Authentication
// ========================================
class PasswordAuth {
    constructor() {
        this.modal = document.getElementById('passwordModal');
        this.form = document.getElementById('passwordForm');
        this.passwordInput = document.getElementById('password');
        this.correctPassword = window.CANVAS_PASSWORD || 'mundopodium';
        this.init();
    }
    
    init() {
        // Verificar se já está autenticado
        if (!this.isAuthenticated()) {
            this.showModal();
        } else {
            this.hideModal();
        }
        
        // Listener para o form
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    isAuthenticated() {
        const authData = localStorage.getItem('canvas-auth');
        if (!authData) return false;
        
        const parsed = JSON.parse(authData);
        const expiryDate = new Date(parsed.expiry);
        
        // Verificar se ainda está dentro do prazo (30 dias)
        if (new Date() > expiryDate) {
            localStorage.removeItem('canvas-auth');
            return false;
        }
        
        return true;
    }
    
    handleSubmit(event) {
        event.preventDefault();
        
        const password = this.passwordInput.value;
        
        if (password === this.correctPassword) {
            // Salvar autenticação (30 dias)
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 30);
            
            localStorage.setItem('canvas-auth', JSON.stringify({
                authenticated: true,
                expiry: expiryDate.toISOString(),
                date: new Date().toISOString()
            }));
            
            this.hideModal();
            alert('✅ Acesso liberado! Bem-vindo ao Canvas de Nicho e ICP.');
            
            // Track analytics
            if (typeof window.va === 'function') {
                window.va('track', 'Canvas Unlocked');
            }
        } else {
            alert('❌ Senha incorreta! Tente novamente.');
            this.passwordInput.value = '';
            this.passwordInput.focus();
        }
    }
    
    showModal() {
        this.modal.classList.remove('hidden');
    }
    
    hideModal() {
        this.modal.classList.add('hidden');
    }
    
    logout() {
        localStorage.removeItem('canvas-auth');
        this.showModal();
    }
}

// ========================================
// CLASSE: Canvas Nicho ICP
// ========================================
class CanvasNichoICP {
    constructor() {
        this.form = document.getElementById('canvasForm');
        this.userFingerprint = this.generateFingerprint();
        this.init();
    }
    
    init() {
        // Carregar dados salvos
        this.carregarDados();
        
        // Setup da tríade
        this.setupTriada();
        
        // Auto-save a cada 30 segundos
        setInterval(() => this.autoSave(), 30000);
    }
    
    setupTriada() {
        const triada1 = document.getElementById('triada1');
        const triada2 = document.getElementById('triada2');
        const triada3 = document.getElementById('triada3');
        
        [triada1, triada2, triada3].forEach(checkbox => {
            checkbox.addEventListener('change', () => this.validarTriada());
        });
        
        this.validarTriada();
    }
    
    validarTriada() {
        const triada1 = document.getElementById('triada1').checked;
        const triada2 = document.getElementById('triada2').checked;
        const triada3 = document.getElementById('triada3').checked;
        
        const resultado = document.getElementById('resultadoTriada');
        
        if (triada1 && triada2 && triada3) {
            resultado.classList.add('ativo');
        } else {
            resultado.classList.remove('ativo');
        }
    }
    
    generateFingerprint() {
        // Gerar fingerprint único baseado em características do navegador
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('browser-fingerprint', 2, 2);
        
        const fingerprint = canvas.toDataURL();
        const hash = this.hashCode(fingerprint + navigator.userAgent + navigator.language);
        
        return 'user_' + hash;
    }
    
    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(36);
    }
    
    async salvarDados() {
        const dados = this.coletarDados();
        
        // Salvar localmente
        this.salvarLocal(dados);
        
        // Salvar no Supabase
        await this.salvarSupabase(dados);
        
        alert('✅ Dados salvos com sucesso!\n\nSeus dados foram salvos localmente e no Supabase.');
        
        // Track analytics
        if (typeof window.va === 'function') {
            window.va('track', 'Canvas Saved');
        }
    }
    
    coletarDados() {
        return {
            triada1: document.getElementById('triada1').checked,
            triada2: document.getElementById('triada2').checked,
            triada3: document.getElementById('triada3').checked,
            nicho: document.getElementById('nicho').value,
            dores: document.getElementById('dores').value,
            financeiro: document.getElementById('financeiro').value,
            acesso: document.getElementById('acesso').value,
            entregaveis: document.getElementById('entregaveis').value,
            precificacao: document.getElementById('precificacao').value,
            checks: {
                check1: document.getElementById('check1').checked,
                check2: document.getElementById('check2').checked,
                check3: document.getElementById('check3').checked,
                check4: document.getElementById('check4').checked,
                check5: document.getElementById('check5').checked,
                check6: document.getElementById('check6').checked,
                check7: document.getElementById('check7').checked,
                check8: document.getElementById('check8').checked,
            }
        };
    }
    
    salvarLocal(dados) {
        localStorage.setItem('canvasNichoICP', JSON.stringify(dados));
    }
    
    async salvarSupabase(dados) {
        try {
            if (!window.SUPABASE_CONFIG) {
                console.error('❌ Configuração do Supabase não encontrada');
                return false;
            }
            
            const payload = {
                user_fingerprint: this.userFingerprint,
                triada1: dados.triada1,
                triada2: dados.triada2,
                triada3: dados.triada3,
                nicho: dados.nicho,
                dores: dados.dores,
                financeiro: dados.financeiro,
                acesso: dados.acesso,
                entregaveis: dados.entregaveis,
                precificacao: dados.precificacao,
                checks: dados.checks,
                user_agent: navigator.userAgent,
                ip_address: await this.obterIP()
            };
            
            const response = await fetch(
                `${window.SUPABASE_CONFIG.URL}/rest/v1/${window.SUPABASE_CONFIG.TABLE_NAME}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': window.SUPABASE_CONFIG.ANON_KEY,
                        'Authorization': `Bearer ${window.SUPABASE_CONFIG.ANON_KEY}`
                    },
                    body: JSON.stringify(payload)
                }
            );
            
            if (response.ok) {
                console.log('✅ Canvas salvo no Supabase!');
                return true;
            } else {
                console.error('❌ Erro ao salvar no Supabase:', await response.json());
                return false;
            }
        } catch (error) {
            console.error('❌ Erro ao conectar com Supabase:', error);
            return false;
        }
    }
    
    async obterIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch {
            return 'desconhecido';
        }
    }
    
    carregarDados() {
        const dados = localStorage.getItem('canvasNichoICP');
        
        if (dados) {
            const obj = JSON.parse(dados);
            
            document.getElementById('triada1').checked = obj.triada1 || false;
            document.getElementById('triada2').checked = obj.triada2 || false;
            document.getElementById('triada3').checked = obj.triada3 || false;
            document.getElementById('nicho').value = obj.nicho || '';
            document.getElementById('dores').value = obj.dores || '';
            document.getElementById('financeiro').value = obj.financeiro || '';
            document.getElementById('acesso').value = obj.acesso || '';
            document.getElementById('entregaveis').value = obj.entregaveis || '';
            document.getElementById('precificacao').value = obj.precificacao || '';
            
            if (obj.checks) {
                document.getElementById('check1').checked = obj.checks.check1 || false;
                document.getElementById('check2').checked = obj.checks.check2 || false;
                document.getElementById('check3').checked = obj.checks.check3 || false;
                document.getElementById('check4').checked = obj.checks.check4 || false;
                document.getElementById('check5').checked = obj.checks.check5 || false;
                document.getElementById('check6').checked = obj.checks.check6 || false;
                document.getElementById('check7').checked = obj.checks.check7 || false;
                document.getElementById('check8').checked = obj.checks.check8 || false;
            }
            
            this.validarTriada();
        }
    }
    
    limparDados() {
        if (confirm('⚠️ Tem certeza que deseja limpar todos os dados?\n\nEssa ação não pode ser desfeita.')) {
            localStorage.removeItem('canvasNichoICP');
            this.form.reset();
            this.validarTriada();
            alert('✅ Todos os dados foram limpos.');
            
            // Track analytics
            if (typeof window.va === 'function') {
                window.va('track', 'Canvas Cleared');
            }
        }
    }
    
    autoSave() {
        const dados = this.coletarDados();
        this.salvarLocal(dados);
        console.log('💾 Auto-save realizado');
    }
}

// ========================================
// FUNÇÕES GLOBAIS
// ========================================
function salvarDados() {
    if (window.canvas) {
        window.canvas.salvarDados();
    }
}

function limparDados() {
    if (window.canvas) {
        window.canvas.limparDados();
    }
}

// ========================================
// INICIALIZAÇÃO
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar autenticação
    window.passwordAuth = new PasswordAuth();
    
    // Inicializar canvas
    window.canvas = new CanvasNichoICP();
    
    // Inicializar Vercel Analytics
    if (typeof window.va === 'function') {
        window.va('track', 'Page View', {
            page: 'Canvas Nicho ICP'
        });
    }
});
```

---

## 🎨 ESTILOS CSS

Use os estilos fornecidos no HTML original, e adicione os estilos específicos para:

1. Modal de senha (similar ao modal de leads da calculadora)
2. Seção da comunidade WhatsApp
3. Responsividade
4. Animações

**Adicione ao styles.css existente:**

```css
/* Modal de Senha */
.modal {
    display: flex;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    align-items: center;
    justify-content: center;
}

.modal.hidden {
    display: none;
}

.modal-content {
    background-color: white;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    max-width: 450px;
    width: 90%;
    animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
    from {
        transform: translateY(-50px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.modal-header {
    text-align: center;
    margin-bottom: 30px;
    border-bottom: 3px solid #F2b705;
    padding-bottom: 20px;
}

.modal-header h2 {
    color: #000000;
    font-size: 24px;
    margin-bottom: 8px;
}

.modal-header p {
    color: #F2b705;
    font-size: 14px;
    font-weight: bold;
}

.password-form {
    margin-bottom: 20px;
}

.form-group {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
}

.form-group label {
    font-weight: bold;
    color: #000000;
    margin-bottom: 8px;
    font-size: 14px;
}

.form-group input {
    padding: 12px;
    border: 2px solid #F2b705;
    border-radius: 6px;
    font-size: 14px;
    background-color: #fffef0;
}

.form-group input:focus {
    outline: none;
    border-color: #000000;
    box-shadow: 0 0 8px rgba(242, 183, 5, 0.4);
}

.btn-unlock {
    width: 100%;
    padding: 14px;
    background-color: #F2b705;
    color: #000000;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-unlock:hover {
    background-color: #e0a500;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(242, 183, 5, 0.3);
}

.modal-footer {
    text-align: center;
    padding-top: 15px;
    border-top: 1px solid #eee;
}

.modal-footer p {
    color: #666;
    font-size: 12px;
}

/* Community Section (já existe no HTML original, mas garantir que está no CSS) */
.community-section {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border: 2px solid #25D366;
    border-radius: 12px;
    padding: 30px;
    margin: 30px 0;
    text-align: center;
    box-shadow: 0 4px 15px rgba(37, 211, 102, 0.1);
    transition: all 0.3s ease;
}

.community-section:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(37, 211, 102, 0.15);
}

.btn-whatsapp {
    display: inline-block;
    background-color: #25D366;
    color: white;
    padding: 15px 30px;
    border-radius: 8px;
    text-decoration: none;
    font-size: 16px;
    font-weight: bold;
    transition: all 0.3s ease;
}

.btn-whatsapp:hover {
    background-color: #20B358;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(37, 211, 102, 0.4);
}

/* Resultado da Tríade */
.resultado {
    background: linear-gradient(135deg, #F2b705 0%, #d99a04 100%);
    color: white;
    padding: 20px;
    border-radius: 8px;
    margin-top: 20px;
    display: none;
}

.resultado.ativo {
    display: block;
}
```

---

## 📦 ARQUIVOS DE CONFIGURAÇÃO

### package.json

```json
{
  "name": "canvas-nicho-icp-podium",
  "version": "1.0.0",
  "description": "Canvas de Nicho e ICP - Método Pódium",
  "main": "index.html",
  "scripts": {
    "start": "npx serve .",
    "dev": "npx serve . -l 3000",
    "build": "echo 'Static site - no build needed'",
    "deploy": "vercel --prod",
    "vercel-build": "echo 'Static site ready for deployment'"
  },
  "keywords": [
    "canvas",
    "nicho",
    "icp",
    "podium",
    "metodologia"
  ],
  "author": "Rômulo Freitas",
  "license": "MIT",
  "dependencies": {
    "@vercel/analytics": "^1.2.1"
  },
  "devDependencies": {
    "serve": "^14.2.1"
  },
  "engines": {
    "node": ">=14.0.0"
  }
}
```

### vercel.json

```json
{
  "version": 2,
  "outputDirectory": ".",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/$1"
    }
  ]
}
```

### .env.example

```env
# Configuração do Supabase
VITE_SUPABASE_URL=https://zqscitdvsqfkhzddzaeh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Senha de acesso ao canvas
CANVAS_PASSWORD=mundopodium
```

---

## 🚀 DEPLOY NO VERCEL

### ID do Projeto Vercel
```
prj_hTAxPkyoXqwnmXZxfRXloUv8pJAZ
```

### Passos para Deploy

1. **Instalar Vercel CLI:**
```bash
npm install -g vercel
```

2. **Fazer login:**
```bash
vercel login
```

3. **Vincular ao projeto:**
```bash
vercel link --project-id prj_hTAxPkyoXqwnmXZxfRXloUv8pJAZ
```

4. **Deploy:**
```bash
vercel --prod
```

5. **Configurar Variáveis de Ambiente no Vercel:**
   - Acesse o projeto no dashboard do Vercel
   - Settings → Environment Variables
   - Adicione:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

---

## 📚 ARQUIVOS DE DOCUMENTAÇÃO

### GUIA_CANVAS.md

Crie um guia completo explicando:
- Como usar o canvas
- O que é a tríade do nicho
- Como preencher cada seção
- Dicas de validação

### GUIA_SUPABASE.md

Crie instruções sobre:
- Como criar a tabela `canvas_data`
- Como configurar as políticas de segurança
- Como visualizar os dados salvos

### DEPLOY_VERCEL.md

Crie instruções passo a passo sobre:
- Como fazer deploy no Vercel
- Como configurar variáveis de ambiente
- Como vincular ao projeto específico

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

Certifique-se de implementar tudo conforme especificado:

- [ ] Modal de senha com a senha `mundopodium`
- [ ] Autenticação salva por 30 dias no localStorage
- [ ] Canvas completo conforme HTML fornecido
- [ ] Botão da comunidade WhatsApp
- [ ] Integração com Supabase (tabela `canvas_data`)
- [ ] Auto-save a cada 30 segundos
- [ ] Salvamento manual com botão "Salvar Dados"
- [ ] Função de limpar todos os dados
- [ ] Função de imprimir
- [ ] Validação da tríade em tempo real
- [ ] Vercel Analytics integrado
- [ ] Responsividade mobile
- [ ] User fingerprinting para identificação anônima
- [ ] Rate limiting (Supabase RLS)
- [ ] Todos os arquivos de documentação
- [ ] Configuração do Vercel (`vercel.json`)
- [ ] Package.json com scripts de deploy
- [ ] Arquivo `.env.example`

---

## 🎯 FUNCIONALIDADES PRINCIPAIS

1. **Autenticação por Senha:**
   - Senha: `mundopodium`
   - Validação salva por 30 dias
   - Modal não pode ser fechado sem senha correta

2. **Canvas Interativo:**
   - Tríade validada em tempo real
   - Checkboxes para cada pilar da tríade
   - 6 seções de preenchimento
   - Checklist de validação

3. **Persistência de Dados:**
   - Auto-save local a cada 30 segundos
   - Salvamento manual no Supabase
   - Carregamento automático ao abrir

4. **Botão da Comunidade:**
   - Link direto para WhatsApp
   - Design destacado
   - Tracking de cliques

5. **Analytics:**
   - Vercel Analytics integrado
   - Eventos customizados (unlock, save, clear)

---

## 🔧 TECNOLOGIAS UTILIZADAS

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** Supabase (PostgreSQL)
- **Deploy:** Vercel
- **Analytics:** Vercel Analytics
- **Autenticação:** Password local (localStorage)
- **Persistência:** localStorage + Supabase

---

## 📞 SUPORTE E COMUNIDADE

Link da Comunidade WhatsApp:
```
https://chat.whatsapp.com/L4camOPOJMxDb8et6M80oN
```

---

## 🎨 CORES DO MÉTODO PÓDIUM

- **Amarelo Pódium:** `#F2b705`
- **Preto:** `#000000`
- **Branco:** `#FFFFFF`
- **Verde WhatsApp:** `#25D366`

---

## 🏁 CONCLUSÃO

Este prompt contém TODAS as informações necessárias para criar o Canvas de Nicho e ICP do Método Pódium. Siga as instruções cuidadosamente e implemente cada funcionalidade conforme especificado.

**Boa sorte! 🚀**






