/**
 * Calculadora de Contratos Pódium
 * Ferramenta de Previsibilidade Comercial - Método Pódium
 * 
 * Autor: Rômulo Freitas
 * Versão: 2.1 (Com Integração Supabase)
 * Data: Outubro 2025
 */

/**
 * Classe para gerenciar o Modal de Captura de Leads
 */
class CapturadeLeads {
    constructor() {
        this.modal = document.getElementById('leadModal');
        this.form = document.getElementById('leadForm');
        this.telefoneInput = document.getElementById('leadTelefone');
        this.init();
    }
    
    init() {
        // Verificar se o lead já foi capturado
        if (!this.jaFoiCapturado()) {
            this.mostrarModal();
        } else {
            this.esconderModal();
        }
        
        // Adicionar listener para o formulário
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Adicionar máscara de telefone
        this.telefoneInput.addEventListener('input', (e) => this.formatarTelefone(e));
    }
    
    /**
     * Formata o telefone com máscara (XX) 99999-9999
     */
    formatarTelefone(event) {
        let value = event.target.value.replace(/\D/g, '');
        
        if (value.length > 0) {
            if (value.length <= 2) {
                value = `(${value}`;
            } else if (value.length <= 7) {
                value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
            } else {
                value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
            }
        }
        
        event.target.value = value;
    }
    
    /**
     * Verifica se o lead já foi capturado
     */
    jaFoiCapturado() {
        return localStorage.getItem('calculadora-lead-capturado') === 'true';
    }
    
    /**
     * Salva os dados do lead no localStorage
     */
    salvarLeadLocal(dados) {
        localStorage.setItem('calculadora-lead', JSON.stringify(dados));
        localStorage.setItem('calculadora-lead-capturado', 'true');
        localStorage.setItem('calculadora-lead-data', new Date().toISOString());
    }
    
    /**
     * Mostra o modal
     */
    mostrarModal() {
        this.modal.classList.remove('hidden');
    }
    
    /**
     * Esconde o modal
     */
    esconderModal() {
        this.modal.classList.add('hidden');
    }
    
    /**
     * Envia os dados do lead para o Supabase
     */
    async enviarParaSupabase(dados) {
        try {
            // Validar configuração
            if (!window.SUPABASE_CONFIG || !window.SUPABASE_CONFIG.URL || !window.SUPABASE_CONFIG.ANON_KEY) {
                console.error('❌ Configuração do Supabase não encontrada. Verifique o arquivo config.js');
                return false;
            }
            
            // Preparar dados
            const payload = {
                nome: dados.nome,
                telefone: dados.telefone,
                email: dados.email,
                data_captura: dados.data,
                user_agent: navigator.userAgent,
                ip_address: await this.obterIP()
            };
            
            // Fazer requisição para Supabase
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
                console.log('✅ Lead enviado para Supabase com sucesso!');
                return true;
            } else {
                const error = await response.json();
                console.error('❌ Erro ao enviar lead para Supabase:', error);
                
                // Tratar erros específicos de segurança
                if (response.status === 429) {
                    throw new Error('RATE_LIMIT_EXCEEDED');
                } else if (response.status === 400 && error.message) {
                    if (error.message.includes('rate limit')) {
                        throw new Error('RATE_LIMIT_EXCEEDED');
                    } else if (error.message.includes('email') || error.message.includes('domain')) {
                        throw new Error('EMAIL_DOMAIN_BLOCKED');
                    } else if (error.message.includes('validation') || error.message.includes('invalid')) {
                        throw new Error('VALIDATION_FAILED');
                    }
                }
                
                return false;
            }
        } catch (error) {
            console.error('❌ Erro ao conectar com Supabase:', error);
            
            // Re-lançar erros específicos para tratamento no frontend
            if (error.message === 'RATE_LIMIT_EXCEEDED' || 
                error.message === 'EMAIL_DOMAIN_BLOCKED' || 
                error.message === 'VALIDATION_FAILED') {
                throw error;
            }
            
            return false;
        }
    }
    
    /**
     * Obtém o IP do usuário (usando serviço externo)
     */
    async obterIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.warn('⚠️ Não foi possível obter o IP do usuário');
            return 'desconhecido';
        }
    }
    
    /**
     * Handle do submit do formulário
     */
    async handleSubmit(event) {
        event.preventDefault();
        
        // Obter dados do formulário
        const dados = {
            nome: document.getElementById('leadNome').value,
            telefone: document.getElementById('leadTelefone').value,
            email: document.getElementById('leadEmail').value,
            data: new Date().toISOString()
        };
        
        // Validar dados
        if (!this.validarDados(dados)) {
            alert('Por favor, use dados reais.');
            return;
        }
        
        // Mostrar loading
        const botao = this.form.querySelector('button[type="submit"]');
        const textoOriginal = botao.textContent;
        botao.textContent = '⏳ Enviando...';
        botao.disabled = true;
        
        try {
            // Salvar lead localmente
            this.salvarLeadLocal(dados);
            
            // Enviar para Supabase
            const enviado = await this.enviarParaSupabase(dados);
            
            // Esconder modal
            this.esconderModal();
            
            // Mostrar mensagem de sucesso
            if (enviado) {
                alert('Bem-vindo ao Mundo Pódium! 🏁\n\nAcesse a calculadora e comece a planejar seu faturamento.');
            } else {
                alert('Bem-vindo ao Mundo Pódium! 🏁\n\n(Nota: Houve um problema ao enviar seus dados, mas você pode continuar usando a calculadora)');
            }
        } catch (error) {
            // Tratar erros específicos de segurança
            if (error.message === 'RATE_LIMIT_EXCEEDED') {
                alert('⏰ Limite de envios atingido!\n\nVocê já enviou dados recentemente. Aguarde 1 hora antes de tentar novamente.\n\nPor enquanto, você pode continuar usando a calculadora.');
            } else if (error.message === 'EMAIL_DOMAIN_BLOCKED') {
                alert('📧 Email temporário detectado!\n\nPor favor, use um email válido (Gmail, Outlook, etc.) para continuar.\n\nEmails temporários são bloqueados por segurança.');
            } else if (error.message === 'VALIDATION_FAILED') {
                alert('❌ Dados inválidos!\n\nVerifique se:\n• Nome tem pelo menos 3 caracteres\n• Telefone está no formato (XX) XXXXX-XXXX\n• Email está correto\n\nTente novamente com dados válidos.');
            } else {
                alert('❌ Erro inesperado!\n\nHouve um problema ao enviar seus dados. Tente novamente em alguns minutos.\n\nPor enquanto, você pode continuar usando a calculadora.');
            }
            
            // Esconder modal mesmo com erro
            this.esconderModal();
        } finally {
            // Restaurar botão
            botao.textContent = textoOriginal;
            botao.disabled = false;
        }
    }
    
    /**
     * Valida os dados do formulário
     */
    validarDados(dados) {
        // Validar nome
        if (!dados.nome || dados.nome.trim().length < 3) {
            return false;
        }
        
        // Validar telefone (formato: (XX) 99999-9999)
        const telefonePadrao = /^\(\d{2}\) \d{5}-\d{4}$/;
        if (!telefonePadrao.test(dados.telefone)) {
            return false;
        }
        
        // Validar email
        const emailPadrao = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPadrao.test(dados.email)) {
            return false;
        }
        
        // Validar dados de teste
        if (!this.validarNome(dados.nome) || 
            !this.validarEmailTeste(dados.email) || 
            !this.validarTelefone(dados.telefone)) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Valida se o nome não contém padrões de teste
     */
    validarNome(nome) {
        const nomeLower = nome.toLowerCase().trim();
        const padroesTeste = [
            'teste', 'test', 'demo', 'exemplo', 'exemplo', 'fulano', 
            'beltrano', 'ciclano', 'joão', 'maria', 'josé', 'ana',
            'abc', 'xyz', '123', 'sample', 'amostra', 'fake', 'falso'
        ];
        
        return !padroesTeste.some(padrao => nomeLower.includes(padrao));
    }
    
    /**
     * Valida se o email não contém padrões de teste ou domínios temporários
     */
    validarEmailTeste(email) {
        const emailLower = email.toLowerCase();
        
        // Padrões de teste no email
        const padroesTeste = [
            'teste', 'test', 'demo', 'exemplo', 'example', 'noreply', 
            'no-reply', 'sample', 'fake', 'falso', 'abc', 'xyz'
        ];
        
        // Verificar se contém padrões de teste
        if (padroesTeste.some(padrao => emailLower.includes(padrao))) {
            return false;
        }
        
        // Domínios de teste e temporários
        const dominiosBloqueados = [
            'teste.com', 'test.com', 'example.com', 'example.org', 
            'example.net', 'test.org', 'demo.com', 'sample.com',
            '10minutemail.com', 'tempmail.org', 'guerrillamail.com',
            'mailinator.com', 'throwaway.email', 'temp-mail.org',
            'getnada.com', 'maildrop.cc', 'sharklasers.com'
        ];
        
        const dominio = emailLower.split('@')[1];
        return !dominiosBloqueados.includes(dominio);
    }
    
    /**
     * Valida se o telefone não contém padrões de teste
     */
    validarTelefone(telefone) {
        // Extrair apenas os números do telefone
        const numeros = telefone.replace(/\D/g, '');
        
        // Verificar se todos os dígitos são iguais (11111, 22222, etc.)
        if (/^(\d)\1+$/.test(numeros)) {
            return false;
        }
        
        // Verificar sequências óbvias (12345, 54321, etc.)
        const sequenciasBloqueadas = [
            '1234567890', '0987654321', '123456789', '987654321',
            '12345678', '87654321', '1234567', '7654321',
            '123456', '654321', '12345', '54321'
        ];
        
        if (sequenciasBloqueadas.includes(numeros)) {
            return false;
        }
        
        // Verificar padrões específicos como 99999-9999
        if (telefone.includes('99999-9999') || telefone.includes('11111-1111') || 
            telefone.includes('22222-2222') || telefone.includes('33333-3333')) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Obtém os dados do lead capturado
     */
    obterDados() {
        const dados = localStorage.getItem('calculadora-lead');
        return dados ? JSON.parse(dados) : null;
    }
    
    /**
     * Reseta a captura de leads (para testes)
     */
    resetar() {
        localStorage.removeItem('calculadora-lead');
        localStorage.removeItem('calculadora-lead-capturado');
        localStorage.removeItem('calculadora-lead-data');
        this.form.reset();
        this.mostrarModal();
    }
}

class CalculadoraPodium {
    constructor() {
        // Elementos de entrada
        this.metaInput = document.getElementById('meta');
        this.ticketInput = document.getElementById('ticket');
        this.taxa1Input = document.getElementById('taxa1');
        this.taxa2Input = document.getElementById('taxa2');
        this.taxa3Input = document.getElementById('taxa3');
        this.taxa4Input = document.getElementById('taxa4');
        
        // Elementos de exibição
        this.projetos = document.getElementById('projetos');
        this.metaDisplay = document.getElementById('meta-display');
        this.ticketDisplay = document.getElementById('ticket-display');
        this.contratosDisplay = document.getElementById('contratos-display');
        
        this.taxa1Display = document.getElementById('taxa1-display');
        this.taxa2Display = document.getElementById('taxa2-display');
        this.taxa3Display = document.getElementById('taxa3-display');
        this.taxa4Display = document.getElementById('taxa4-display');
        
        this.passo1 = document.getElementById('passo1');
        this.passo2 = document.getElementById('passo2');
        this.passo3 = document.getElementById('passo3');
        this.passo4 = document.getElementById('passo4');
        this.passo5 = document.getElementById('passo5');
        
        this.resultado = document.getElementById('resultado');
        
        // Inicializar
        this.init();
    }
    
    /**
     * Inicializa os listeners de eventos
     */
    init() {
        // Adicionar listeners para recalcular quando os valores mudam
        this.metaInput.addEventListener('input', (e) => this.formatarMoedaInput(e, this.metaInput));
        this.ticketInput.addEventListener('input', (e) => this.formatarMoedaInput(e, this.ticketInput));
        this.taxa1Input.addEventListener('input', () => this.calcular());
        this.taxa2Input.addEventListener('input', () => this.calcular());
        this.taxa3Input.addEventListener('input', () => this.calcular());
        this.taxa4Input.addEventListener('input', () => this.calcular());
        
        // Calcular na carga da página
        window.addEventListener('load', () => this.calcular());
        
        // Calcular imediatamente
        this.calcular();
    }
    
    /**
     * Formata o input de moeda brasileira
     */
    formatarMoedaInput(event, input) {
        let valor = event.target.value.replace(/\D/g, '');
        
        if (valor === '') {
            input.value = '';
            this.calcular();
            return;
        }
        
        // Converter para número e formatar
        const numero = parseInt(valor);
        const formatado = this.formatarMoedaInputValue(numero);
        input.value = formatado;
        
        // Recalcular
        this.calcular();
    }
    
    /**
     * Formata um valor numérico para moeda brasileira no input
     */
    formatarMoedaInputValue(valor) {
        return valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    }
    
    /**
     * Extrai o valor numérico de um input formatado
     */
    extrairValorNumerico(input) {
        const valor = input.value.replace(/[^\d]/g, '');
        return valor === '' ? 0 : parseInt(valor);
    }
    
    /**
     * Função principal de cálculo
     */
    calcular() {
        // Obter valores dos inputs
        const meta = this.extrairValorNumerico(this.metaInput);
        const ticket = this.extrairValorNumerico(this.ticketInput);
        const taxa1 = parseFloat(this.taxa1Input.value) / 100 || 0.2;
        const taxa2 = parseFloat(this.taxa2Input.value) / 100 || 0.7;
        const taxa3 = parseFloat(this.taxa3Input.value) / 100 || 0.8;
        const taxa4 = parseFloat(this.taxa4Input.value) / 100 || 0.5;
        
        // Realizar cálculos
        const projetos = Math.ceil(meta / ticket);
        const negociações = Math.ceil(projetos / taxa4);
        const r2s = Math.ceil(negociações / taxa3);
        const r1s = Math.ceil(r2s / taxa2);
        const ligações = Math.ceil(r1s / taxa1);
        
        // Atualizar displays
        this.atualizarDisplays(meta, ticket, projetos, taxa1, taxa2, taxa3, taxa4, negociações, r2s, r1s, ligações);
    }
    
    /**
     * Atualiza todos os elementos de exibição
     */
    atualizarDisplays(meta, ticket, projetos, taxa1, taxa2, taxa3, taxa4, negociações, r2s, r1s, ligações) {
        // Atualizar quantidade de projetos
        this.projetos.textContent = projetos;
        
        // Atualizar displays de meta e ticket
        this.metaDisplay.textContent = this.formatarMoeda(meta);
        this.ticketDisplay.textContent = this.formatarMoeda(ticket);
        this.contratosDisplay.textContent = projetos;
        
        // Atualizar displays de taxas
        this.taxa1Display.textContent = (taxa1 * 100).toFixed(0);
        this.taxa2Display.textContent = (taxa2 * 100).toFixed(0);
        this.taxa3Display.textContent = (taxa3 * 100).toFixed(0);
        this.taxa4Display.textContent = (taxa4 * 100).toFixed(0);
        
        // Atualizar passos do cálculo regressivo
        this.passo1.textContent = projetos;
        this.passo2.textContent = negociações;
        this.passo3.textContent = r2s;
        this.passo4.textContent = r1s;
        this.passo5.textContent = ligações;
        
        // Atualizar resultado final
        this.resultado.textContent = ligações;
        
        // Salvar no localStorage para persistência
        this.salvarDados({
            meta,
            ticket,
            taxa1: taxa1 * 100,
            taxa2: taxa2 * 100,
            taxa3: taxa3 * 100,
            taxa4: taxa4 * 100
        });
    }
    
    /**
     * Formata um número como moeda brasileira
     */
    formatarMoeda(valor) {
        return valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).replace('R$', '').trim();
    }
    
    /**
     * Salva os dados no localStorage para persistência
     */
    salvarDados(dados) {
        try {
            localStorage.setItem('calculadora-podium-dados', JSON.stringify(dados));
        } catch (e) {
            console.warn('Não foi possível salvar os dados no localStorage:', e);
        }
    }
    
    /**
     * Carrega os dados do localStorage se existirem
     */
    carregarDados() {
        try {
            const dados = localStorage.getItem('calculadora-podium-dados');
            if (dados) {
                const parsed = JSON.parse(dados);
                this.metaInput.value = this.formatarMoedaInputValue(parsed.meta || 20000);
                this.ticketInput.value = this.formatarMoedaInputValue(parsed.ticket || 5000);
                this.taxa1Input.value = parsed.taxa1 || 20;
                this.taxa2Input.value = parsed.taxa2 || 70;
                this.taxa3Input.value = parsed.taxa3 || 80;
                this.taxa4Input.value = parsed.taxa4 || 50;
            }
        } catch (e) {
            console.warn('Não foi possível carregar os dados do localStorage:', e);
        }
    }
    
    /**
     * Reseta todos os valores para os padrões
     */
    resetar() {
        this.metaInput.value = this.formatarMoedaInputValue(20000);
        this.ticketInput.value = this.formatarMoedaInputValue(5000);
        this.taxa1Input.value = 20;
        this.taxa2Input.value = 70;
        this.taxa3Input.value = 80;
        this.taxa4Input.value = 50;
        this.calcular();
    }
    
    /**
     * Exporta os dados em formato JSON
     */
    exportarDados() {
        const dados = {
            meta: parseFloat(this.metaInput.value),
            ticket: parseFloat(this.ticketInput.value),
            taxa1: parseFloat(this.taxa1Input.value),
            taxa2: parseFloat(this.taxa2Input.value),
            taxa3: parseFloat(this.taxa3Input.value),
            taxa4: parseFloat(this.taxa4Input.value),
            resultado: this.resultado.textContent,
            data: new Date().toISOString()
        };
        
        return JSON.stringify(dados, null, 2);
    }
    
    /**
     * Imprime a calculadora
     */
    imprimir() {
        window.print();
    }
    
    /**
     * Compartilha os dados via URL
     */
    compartilhar() {
        const dados = {
            meta: this.metaInput.value,
            ticket: this.ticketInput.value,
            taxa1: this.taxa1Input.value,
            taxa2: this.taxa2Input.value,
            taxa3: this.taxa3Input.value,
            taxa4: this.taxa4Input.value
        };
        
        const url = new URL(window.location);
        Object.keys(dados).forEach(key => {
            url.searchParams.set(key, dados[key]);
        });
        
        return url.toString();
    }
    
    /**
     * Carrega dados da URL se existirem
     */
    carregarDadosDaURL() {
        const params = new URLSearchParams(window.location.search);
        
        if (params.has('meta')) this.metaInput.value = this.formatarMoedaInputValue(parseInt(params.get('meta')));
        if (params.has('ticket')) this.ticketInput.value = this.formatarMoedaInputValue(parseInt(params.get('ticket')));
        if (params.has('taxa1')) this.taxa1Input.value = params.get('taxa1');
        if (params.has('taxa2')) this.taxa2Input.value = params.get('taxa2');
        if (params.has('taxa3')) this.taxa3Input.value = params.get('taxa3');
        if (params.has('taxa4')) this.taxa4Input.value = params.get('taxa4');
        
        this.calcular();
    }
}

/**
 * Inicializar a calculadora quando o DOM estiver pronto
 */
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar captura de leads
    const capturaLeads = new CapturadeLeads();
    
    // Inicializar calculadora
    const calculadora = new CalculadoraPodium();
    
    // Carregar dados da URL se existirem
    calculadora.carregarDadosDaURL();
    
    // Carregar dados do localStorage se não houver dados na URL
    if (!window.location.search) {
        calculadora.carregarDados();
    }
    
    // Expor métodos globais para uso em HTML (opcional)
    window.calculadora = calculadora;
    window.capturaLeads = capturaLeads;
    
    // Inicializar Vercel Analytics
    inicializarVercelAnalytics();
});

/**
 * Inicializa o Vercel Analytics e configura eventos personalizados
 */
function inicializarVercelAnalytics() {
    // Verificar se o Analytics está disponível
    if (typeof window.va === 'function') {
        console.log('✅ Vercel Analytics inicializado');
        
        // Track page view
        window.va('track', 'Page View', {
            page: window.location.pathname,
            title: document.title
        });
        
        // Track calculator usage
        trackCalculatorUsage();
        
        // Track lead capture events
        trackLeadCaptureEvents();
    } else {
        console.warn('⚠️ Vercel Analytics não está disponível');
    }
}

/**
 * Configura tracking de uso da calculadora
 */
function trackCalculatorUsage() {
    // Track quando valores são alterados
    const inputs = ['meta', 'ticket', 'taxa1', 'taxa2', 'taxa3', 'taxa4'];
    
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('change', () => {
                if (typeof window.va === 'function') {
                    window.va('track', 'Calculator Input Changed', {
                        input: inputId,
                        value: input.value
                    });
                }
            });
        }
    });
}

/**
 * Configura tracking de eventos de captura de leads
 */
function trackLeadCaptureEvents() {
    const form = document.getElementById('leadForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            if (typeof window.va === 'function') {
                window.va('track', 'Lead Form Submitted', {
                    form: 'lead-capture-modal'
                });
            }
        });
    }
    
    const whatsappButton = document.querySelector('.btn-whatsapp');
    if (whatsappButton) {
        whatsappButton.addEventListener('click', () => {
            if (typeof window.va === 'function') {
                window.va('track', 'WhatsApp Community Click', {
                    source: 'footer-section'
                });
            }
        });
    }
}

/**
 * Função para trackar eventos personalizados
 */
function trackEvent(eventName, properties = {}) {
    if (typeof window.va === 'function') {
        window.va('track', eventName, properties);
    }
}

/**
 * Funções auxiliares globais
 */

/**
 * Reseta a calculadora
 */
function resetarCalculadora() {
    if (window.calculadora) {
        window.calculadora.resetar();
    }
}

/**
 * Exporta os dados
 */
function exportarDados() {
    if (window.calculadora) {
        const dados = window.calculadora.exportarDados();
        const blob = new Blob([dados], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `calculadora-podium-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

/**
 * Compartilha os dados
 */
function compartilharDados() {
    if (window.calculadora) {
        const url = window.calculadora.compartilhar();
        
        // Copiar para clipboard
        navigator.clipboard.writeText(url).then(() => {
            alert('Link compartilhável copiado para a área de transferência!');
        }).catch(() => {
            // Fallback para navegadores antigos
            const textarea = document.createElement('textarea');
            textarea.value = url;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('Link compartilhável copiado para a área de transferência!');
        });
    }
}

/**
 * Imprime a calculadora
 */
function imprimirCalculadora() {
    if (window.calculadora) {
        window.calculadora.imprimir();
    }
}

/**
 * Reseta a captura de leads (para testes)
 */
function resetarCaptura() {
    if (window.capturaLeads) {
        window.capturaLeads.resetar();
    }
}
