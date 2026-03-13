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
        this.prazoMesesInput = document.getElementById('prazo-meses');
        
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

        // Elementos da seção de planejamento
        this.objetivoResumo = document.getElementById('objetivo-resumo');
        this.ligacoesTotais = document.getElementById('ligacoes-totais');
        this.ligacoesDecisor = document.getElementById('ligacoes-decisor');
        this.ligacoesPorDia = document.getElementById('ligacoes-por-dia');
        this.planejamentoDataFinal = document.getElementById('planejamento-data-final');
        this.planejamentoSemanas = document.getElementById('planejamento-semanas');
        this.planejamentoDias = document.getElementById('planejamento-dias');
        this.planejamentoLigacoesTotaisFormula = document.getElementById('planejamento-ligacoes-totais-formula');
        this.planejamentoLigacoesDecisorFormula = document.getElementById('planejamento-ligacoes-decisor-formula');
        
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
        this.taxa1Input.addEventListener('input', () => this.handleTaxaInput(this.taxa1Input));
        this.taxa2Input.addEventListener('input', () => this.handleTaxaInput(this.taxa2Input));
        this.taxa3Input.addEventListener('input', () => this.handleTaxaInput(this.taxa3Input));
        this.taxa4Input.addEventListener('input', () => this.handleTaxaInput(this.taxa4Input));
        this.taxa1Input.addEventListener('blur', () => this.handleTaxaBlur(this.taxa1Input));
        this.taxa2Input.addEventListener('blur', () => this.handleTaxaBlur(this.taxa2Input));
        this.taxa3Input.addEventListener('blur', () => this.handleTaxaBlur(this.taxa3Input));
        this.taxa4Input.addEventListener('blur', () => this.handleTaxaBlur(this.taxa4Input));
        if (this.prazoMesesInput) {
            this.prazoMesesInput.addEventListener('input', () => this.handlePrazoMesesInput());
        }

        // Normalizar campos de taxa no padrão "N%"
        this.normalizarTaxasInputs();
        
        // Calcular na carga da página
        window.addEventListener('load', () => this.calcular());
        
        // Calcular imediatamente
        this.calcular();
    }

    /**
     * Mantém o input de taxa editável durante digitação
     */
    handleTaxaInput(input) {
        input.value = this.sanitizarPercentualInputValue(input.value);
        this.calcular();
    }

    /**
     * Aplica sufixo de percentual ao sair do campo
     */
    handleTaxaBlur(input) {
        input.value = this.formatarPercentualInputValue(input.value);
        this.calcular();
    }

    /**
     * Extrai e limita percentual entre 1 e 100
     */
    extrairPercentual(input) {
        const numeros = String(input.value || '').replace(/\D/g, '');
        if (!numeros) return 0;
        const valor = parseInt(numeros, 10);
        return Math.min(100, Math.max(1, valor));
    }

    /**
     * Formata texto para padrão "N%"
     */
    formatarPercentualInputValue(valor) {
        const numeros = this.sanitizarPercentualInputValue(valor);
        if (!numeros) return '';
        return `${numeros}%`;
    }

    /**
     * Mantém apenas dígitos e limita percentual entre 1 e 100
     */
    sanitizarPercentualInputValue(valor) {
        const numeros = String(valor || '').replace(/\D/g, '');
        if (!numeros) return '';
        return String(Math.min(100, Math.max(1, parseInt(numeros, 10))));
    }

    /**
     * Aplica formatação percentual aos quatro campos
     */
    normalizarTaxasInputs() {
        this.taxa1Input.value = this.formatarPercentualInputValue(this.taxa1Input.value);
        this.taxa2Input.value = this.formatarPercentualInputValue(this.taxa2Input.value);
        this.taxa3Input.value = this.formatarPercentualInputValue(this.taxa3Input.value);
        this.taxa4Input.value = this.formatarPercentualInputValue(this.taxa4Input.value);
    }

    /**
     * Mantém o input de prazo apenas com meses inteiros positivos
     */
    handlePrazoMesesInput() {
        if (!this.prazoMesesInput) return;
        const numeros = String(this.prazoMesesInput.value || '').replace(/\D/g, '');
        this.prazoMesesInput.value = numeros ? String(Math.max(1, parseInt(numeros, 10))) : '';
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
     * Extrai o prazo em meses informado pelo usuário
     */
    extrairPrazoMeses() {
        if (!this.prazoMesesInput) return 0;
        const meses = parseInt(this.prazoMesesInput.value, 10);
        return Number.isFinite(meses) && meses > 0 ? meses : 0;
    }
    
    /**
     * Função principal de cálculo
     */
    calcular() {
        // Obter valores dos inputs
        const meta = this.extrairValorNumerico(this.metaInput);
        const ticket = this.extrairValorNumerico(this.ticketInput);
        const taxa1 = this.extrairPercentual(this.taxa1Input) / 100 || 0.2;
        const taxa2 = this.extrairPercentual(this.taxa2Input) / 100 || 0.7;
        const taxa3 = this.extrairPercentual(this.taxa3Input) / 100 || 0.8;
        const taxa4 = this.extrairPercentual(this.taxa4Input) / 100 || 0.5;
        
        // Manter saída zerada enquanto meta/ticket não forem preenchidos
        if (meta <= 0 || ticket <= 0) {
            this.atualizarDisplays(meta, ticket, 0, taxa1, taxa2, taxa3, taxa4, 0, 0, 0, 0);
            return;
        }

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
        this.projetos.textContent = this.formatarInteiro(projetos);
        
        // Atualizar displays de meta e ticket
        this.metaDisplay.textContent = this.formatarMoeda(meta);
        this.ticketDisplay.textContent = this.formatarMoeda(ticket);
        this.contratosDisplay.textContent = this.formatarInteiro(projetos);
        
        // Atualizar displays de taxas
        this.taxa1Display.textContent = (taxa1 * 100).toFixed(0);
        this.taxa2Display.textContent = (taxa2 * 100).toFixed(0);
        this.taxa3Display.textContent = (taxa3 * 100).toFixed(0);
        this.taxa4Display.textContent = (taxa4 * 100).toFixed(0);
        
        // Atualizar passos do cálculo regressivo
        this.passo1.textContent = this.formatarInteiro(projetos);
        this.passo2.textContent = this.formatarInteiro(negociações);
        this.passo3.textContent = this.formatarInteiro(r2s);
        this.passo4.textContent = this.formatarInteiro(r1s);
        this.passo5.textContent = this.formatarInteiro(ligações);
        
        // Atualizar resultado final
        this.resultado.textContent = this.formatarInteiro(ligações);

        // Atualizar seção de planejamento
        this.atualizarPlanejamento(meta, ligações);
        
        // Salvar no localStorage para persistência
        this.salvarDados({
            meta,
            ticket,
            taxa1: taxa1 * 100,
            taxa2: taxa2 * 100,
            taxa3: taxa3 * 100,
            taxa4: taxa4 * 100,
            prazoMeses: this.extrairPrazoMeses()
        });
    }

    /**
     * Atualiza os dados de execução de ligações até a data final
     */
    atualizarPlanejamento(meta, ligacoesComDecisor) {
        if (!this.objetivoResumo || !this.ligacoesTotais || !this.ligacoesDecisor || !this.ligacoesPorDia) {
            return;
        }

        const meses = this.extrairPrazoMeses();

        if (meta <= 0 || ligacoesComDecisor <= 0 || meses <= 0) {
            this.objetivoResumo.textContent = 'Defina meta, ticket e prazo para gerar o planejamento.';
            this.ligacoesTotais.textContent = '0';
            this.ligacoesDecisor.textContent = '0';
            this.ligacoesPorDia.textContent = '0';
            this.atualizarDetalhamentoPlanejamento('-', 0, 0, 0, 0);
            return;
        }

        const hoje = new Date();
        const dataFinal = new Date(hoje);
        dataFinal.setMonth(dataFinal.getMonth() + meses);

        const diffMs = Math.max(0, dataFinal.getTime() - hoje.getTime());
        const semanas = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24 * 7)));
        const diasProspeccao = semanas * 3;
        const ligacoesTotais = ligacoesComDecisor * 3;
        const ligacoesPorDia = Math.ceil(ligacoesTotais / diasProspeccao);
        const labelMeses = meses === 1 ? 'mês' : 'meses';

        this.objetivoResumo.textContent = `Meta de R$ ${this.formatarMoeda(meta)} em ${meses} ${labelMeses}, com execução prevista até ${dataFinal.toLocaleDateString('pt-BR')}.`;
        this.ligacoesTotais.textContent = this.formatarInteiro(ligacoesTotais);
        this.ligacoesDecisor.textContent = this.formatarInteiro(ligacoesComDecisor);
        this.ligacoesPorDia.textContent = this.formatarInteiro(ligacoesPorDia);
        this.atualizarDetalhamentoPlanejamento(
            dataFinal.toLocaleDateString('pt-BR'),
            semanas,
            diasProspeccao,
            ligacoesTotais,
            ligacoesComDecisor
        );
    }

    /**
     * Atualiza bloco textual com as premissas numéricas do planejamento
     */
    atualizarDetalhamentoPlanejamento(dataFinal, semanas, diasProspeccao, ligacoesTotais, ligacoesComDecisor) {
        if (this.planejamentoDataFinal) {
            this.planejamentoDataFinal.textContent = dataFinal;
        }
        if (this.planejamentoSemanas) {
            this.planejamentoSemanas.textContent = this.formatarInteiro(semanas);
        }
        if (this.planejamentoDias) {
            this.planejamentoDias.textContent = this.formatarInteiro(diasProspeccao);
        }
        if (this.planejamentoLigacoesTotaisFormula) {
            this.planejamentoLigacoesTotaisFormula.textContent = this.formatarInteiro(ligacoesTotais);
        }
        if (this.planejamentoLigacoesDecisorFormula) {
            this.planejamentoLigacoesDecisorFormula.textContent = this.formatarInteiro(ligacoesComDecisor);
        }
    }

    /**
     * Formata inteiros para facilitar leitura (pt-BR)
     */
    formatarInteiro(valor) {
        return Number(valor || 0).toLocaleString('pt-BR');
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
            if (dados.meta <= 0 || dados.ticket <= 0) {
                return;
            }
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
                this.metaInput.value = parsed.meta > 0 ? this.formatarMoedaInputValue(parsed.meta) : '';
                this.ticketInput.value = parsed.ticket > 0 ? this.formatarMoedaInputValue(parsed.ticket) : '';
                if (this.prazoMesesInput) {
                    this.prazoMesesInput.value = parsed.prazoMeses > 0 ? String(parsed.prazoMeses) : '';
                }
            }
        } catch (e) {
            console.warn('Não foi possível carregar os dados do localStorage:', e);
        }
    }
    
    /**
     * Reseta todos os valores para os padrões
     */
    resetar() {
        this.metaInput.value = '';
        this.ticketInput.value = '';
        this.taxa1Input.value = '20%';
        this.taxa2Input.value = '70%';
        this.taxa3Input.value = '80%';
        this.taxa4Input.value = '50%';
        if (this.prazoMesesInput) {
            this.prazoMesesInput.value = '';
        }
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
        
        this.calcular();
    }
}

/**
 * Proteção contra Cópias
 * Implementa medidas básicas para dificultar cópias não autorizadas
 */
function inicializarProtecaoContraCopias() {
    const isEditableTarget = (target) => {
        if (!target || !target.tagName) return false;
        return target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.tagName === 'SELECT' ||
            target.isContentEditable;
    };

    // Desabilitar clique direito
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        console.warn('⚠️ Clique direito desabilitado - Propriedade Intelectual Protegida');
        return false;
    });
    
    // Desabilitar atalhos de teclado para cópia, inspeção, etc.
    document.addEventListener('keydown', (e) => {
        const targetEditavel = isEditableTarget(e.target);
        const key = String(e.key || '').toLowerCase();

        // Em campos de formulário, preservar atalhos básicos de edição
        if (targetEditavel && e.ctrlKey && (key === 'c' || key === 'v' || key === 'a' || key === 'x')) {
            return true;
        }

        // Ctrl+C, Ctrl+V, Ctrl+A, Ctrl+X
        if (e.ctrlKey && (key === 'c' || key === 'v' || key === 'a' || key === 'x')) {
            e.preventDefault();
            console.warn('⚠️ Atalho de teclado bloqueado - Propriedade Intelectual Protegida');
            return false;
        }
        
        // Ctrl+U (visualizar código fonte)
        if (e.ctrlKey && key === 'u') {
            e.preventDefault();
            console.warn('⚠️ Visualização de código fonte bloqueada - Propriedade Intelectual Protegida');
            return false;
        }
        
        // Ctrl+S (salvar página)
        if (e.ctrlKey && key === 's') {
            e.preventDefault();
            console.warn('⚠️ Salvamento bloqueado - Propriedade Intelectual Protegida');
            return false;
        }
        
        // F12 (DevTools)
        if (e.key === 'F12') {
            e.preventDefault();
            console.warn('⚠️ DevTools bloqueado - Propriedade Intelectual Protegida');
            return false;
        }
        
        // Ctrl+Shift+I (DevTools)
        if (e.ctrlKey && e.shiftKey && key === 'i') {
            e.preventDefault();
            console.warn('⚠️ DevTools bloqueado - Propriedade Intelectual Protegida');
            return false;
        }
        
        // Ctrl+Shift+C (DevTools Inspector)
        if (e.ctrlKey && e.shiftKey && key === 'c') {
            e.preventDefault();
            console.warn('⚠️ Inspector bloqueado - Propriedade Intelectual Protegida');
            return false;
        }
    });
    
    // Desabilitar seleção de texto (mas permitir em inputs)
    document.addEventListener('selectstart', (e) => {
        // Permitir seleção apenas em inputs, textareas e elementos editáveis
        if (e.target.tagName === 'INPUT' || 
            e.target.tagName === 'TEXTAREA' || 
            e.target.isContentEditable) {
            return true;
        }
        e.preventDefault();
        return false;
    });
    
    // Watermark no console
    console.log('%c⚠️ PROPRIEDADE INTELECTUAL PROTEGIDA ⚠️', 'color: #f2b705; font-size: 16px; font-weight: bold;');
    console.log('%cEste código é propriedade do Mundo Pódium®', 'color: #f2b705; font-size: 12px;');
    console.log('%cCópias não autorizadas são ilegais.', 'color: #ff0000; font-size: 12px; font-weight: bold;');
    console.log('%c© 2025 Mundo Pódium - Todos os direitos reservados', 'color: #999; font-size: 10px;');
    
    // Tentar detectar DevTools
    let devtools = {open: false};
    const element = new Image();
    Object.defineProperty(element, 'id', {
        get: function() {
            devtools.open = true;
            console.warn('⚠️ DevTools detectado - Propriedade Intelectual Protegida');
        }
    });
    
    setInterval(() => {
        devtools.open = false;
        console.log(element);
        console.clear();
    }, 1000);
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
    
    // Adicionar tracking ao botão WhatsApp flutuante
    const whatsappFloat = document.querySelector('.whatsapp-float');
    if (whatsappFloat) {
        whatsappFloat.addEventListener('click', () => {
            if (typeof window.va === 'function') {
                window.va('track', 'WhatsApp Float Button Click', {
                    source: 'floating-button',
                    position: 'bottom-right'
                });
            }
        });
    }

    // Inicializar interações da camada premium (tabs e accordion)
    inicializarConteudoInterativo();
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
    const inputs = ['meta', 'ticket', 'taxa1', 'taxa2', 'taxa3', 'taxa4', 'prazo-meses'];
    
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

    const workshopButton = document.getElementById('btnWorkshopHero');
    if (workshopButton) {
        workshopButton.addEventListener('click', () => {
            if (typeof window.va === 'function') {
                window.va('track', 'Workshop CTA Click', {
                    source: 'workshop-hero'
                });
            }
        });
    }
}

/**
 * Inicializa tabs e accordions da seção de conteúdo interativo
 */
function inicializarConteudoInterativo() {
    const tabs = Array.from(document.querySelectorAll('.knowledge-tab'));
    const panels = Array.from(document.querySelectorAll('.knowledge-panel'));
    const accordionTriggers = Array.from(document.querySelectorAll('.accordion-trigger'));
    const workshopTabs = Array.from(document.querySelectorAll('.workshop-tab'));
    const workshopPanels = Array.from(document.querySelectorAll('.workshop-panel'));

    if (tabs.length > 0 && panels.length > 0) {
        const ativarTab = (tab) => {
            const targetId = tab.getAttribute('data-tab-target');
            const targetPanel = document.getElementById(targetId);
            if (!targetPanel) return;

            tabs.forEach((btn) => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
                btn.setAttribute('tabindex', '-1');
            });

            panels.forEach((panel) => {
                panel.classList.remove('active');
            });

            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            tab.setAttribute('tabindex', '0');
            targetPanel.classList.add('active');
            tab.focus();
        };

        tabs.forEach((tab, index) => {
            tab.addEventListener('click', () => ativarTab(tab));
            tab.addEventListener('keydown', (event) => {
                if (event.key === 'ArrowRight') {
                    event.preventDefault();
                    const nextTab = tabs[(index + 1) % tabs.length];
                    ativarTab(nextTab);
                }
                if (event.key === 'ArrowLeft') {
                    event.preventDefault();
                    const prevTab = tabs[(index - 1 + tabs.length) % tabs.length];
                    ativarTab(prevTab);
                }
            });
        });
    }

    if (accordionTriggers.length > 0) {
        accordionTriggers.forEach((trigger) => {
            trigger.addEventListener('click', () => {
                const content = trigger.nextElementSibling;
                if (!content || !content.classList.contains('accordion-content')) return;

                const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
                trigger.setAttribute('aria-expanded', String(!isExpanded));
                content.classList.toggle('open', !isExpanded);
            });

            trigger.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    trigger.click();
                }
            });
        });
    }

    if (workshopTabs.length > 0 && workshopPanels.length > 0) {
        const ativarWorkshopTab = (tab) => {
            const targetId = tab.getAttribute('data-workshop-target');
            const targetPanel = document.getElementById(targetId);
            if (!targetPanel) return;

            workshopTabs.forEach((btn) => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            workshopPanels.forEach((panel) => panel.classList.remove('active'));

            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            targetPanel.classList.add('active');
        };

        workshopTabs.forEach((tab, index) => {
            tab.addEventListener('click', () => ativarWorkshopTab(tab));
            tab.addEventListener('keydown', (event) => {
                if (event.key === 'ArrowRight') {
                    event.preventDefault();
                    ativarWorkshopTab(workshopTabs[(index + 1) % workshopTabs.length]);
                } else if (event.key === 'ArrowLeft') {
                    event.preventDefault();
                    ativarWorkshopTab(workshopTabs[(index - 1 + workshopTabs.length) % workshopTabs.length]);
                }
            });
        });
    }

    const depoimentoViewer = document.getElementById('igorDepoimentoViewer');
    const depoimentoTrigger = document.getElementById('igorDepoimentoTrigger');
    const depoimentoClose = document.getElementById('igorDepoimentoClose');

    if (depoimentoViewer && depoimentoTrigger && depoimentoClose) {
        const abrirDepoimento = () => {
            depoimentoViewer.classList.add('open');
            depoimentoViewer.setAttribute('aria-hidden', 'false');
            depoimentoTrigger.setAttribute('aria-expanded', 'true');
        };

        const fecharDepoimento = () => {
            depoimentoViewer.classList.remove('open');
            depoimentoViewer.setAttribute('aria-hidden', 'true');
            depoimentoTrigger.setAttribute('aria-expanded', 'false');
        };

        depoimentoTrigger.addEventListener('click', () => {
            const aberto = depoimentoViewer.classList.contains('open');
            if (aberto) {
                fecharDepoimento();
                return;
            }
            abrirDepoimento();
            depoimentoViewer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });

        depoimentoClose.addEventListener('click', fecharDepoimento);
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
