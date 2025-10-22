/**
 * Configuração do Supabase
 * 
 * IMPORTANTE: 
 * 1. Para produção: Configure as variáveis de ambiente no Vercel (VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY)
 * 2. Para desenvolvimento: Substitua os valores padrão abaixo pelas suas credenciais
 * 3. Veja o arquivo .env.example para mais detalhes
 */

// Função para obter variáveis de ambiente (compatível com Vercel)
function getEnvVar(name, defaultValue = null) {
    // No Vercel, as variáveis são injetadas automaticamente no window object
    // Para desenvolvimento local, você pode usar um arquivo .env
    // Tentar diferentes formas de acessar as variáveis no navegador
    return window?.[`__ENV_${name}`] || 
           window?.[name] || 
           defaultValue;
}

const SUPABASE_CONFIG = {
    // URL do seu projeto Supabase
    URL: getEnvVar('VITE_SUPABASE_URL', "https://zqscitdvsqfkhzddzaeh.supabase.co"),
    
    // Chave pública do Supabase (ANON KEY)
    ANON_KEY: getEnvVar('VITE_SUPABASE_ANON_KEY', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpxc2NpdGR2c3Fma2h6ZGR6YWVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNzA0MzAsImV4cCI6MjA3NjY0NjQzMH0.JZmkmdxJTTf42UYY3M4ruunnS5HupXHiTMwK_YDJmAY"),
    
    // Nome da tabela
    TABLE_NAME: 'leads'
};

// Expor configuração para o window object (necessário para script.js)
window.SUPABASE_CONFIG = SUPABASE_CONFIG;

/**
 * Validar configuração
 */
function validarConfiguracao() {
    if (!SUPABASE_CONFIG.URL || SUPABASE_CONFIG.URL === 'https://seu-projeto.supabase.co' ) {
        console.error('❌ ERRO: Configure a URL do Supabase nas variáveis de ambiente (VITE_SUPABASE_URL) ou em config.js');
        return false;
    }
    
    if (!SUPABASE_CONFIG.ANON_KEY || SUPABASE_CONFIG.ANON_KEY === 'sua-chave-publica-aqui') {
        console.error('❌ ERRO: Configure a ANON_KEY do Supabase nas variáveis de ambiente (VITE_SUPABASE_ANON_KEY) ou em config.js');
        return false;
    }
    
    console.log('✅ Configuração do Supabase validada com sucesso!');
    console.log('📊 URL:', SUPABASE_CONFIG.URL);
    console.log('🔑 ANON_KEY:', SUPABASE_CONFIG.ANON_KEY.substring(0, 20) + '...');
    return true;
}

// Validar ao carregar
window.addEventListener('DOMContentLoaded', () => {
    validarConfiguracao();
});
