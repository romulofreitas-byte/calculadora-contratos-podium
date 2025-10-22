-- =====================================================
-- SUPABASE SECURITY POLICIES - CALCULADORA PÓDIUM
-- =====================================================
-- 
-- Este arquivo implementa políticas de segurança robustas para a tabela 'leads'
-- 
-- RECURSOS IMPLEMENTADOS:
-- ✅ Row Level Security (RLS) habilitado
-- ✅ INSERT público permitido (captura de leads)
-- ✅ SELECT/UPDATE/DELETE negados para usuários anônimos
-- ✅ Rate limiting (máximo 3 envios por IP por hora)
-- ✅ Validação de email (bloqueia domínios descartáveis)
-- ✅ Triggers para validações automáticas
--
-- COMO USAR:
-- 1. Execute este script no SQL Editor do Supabase
-- 2. Verifique se as políticas foram aplicadas corretamente
-- 3. Teste a captura de leads na calculadora
-- =====================================================

-- =====================================================
-- 1. HABILITAR ROW LEVEL SECURITY
-- =====================================================

-- Habilitar RLS na tabela leads
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2. FUNÇÃO DE RATE LIMITING
-- =====================================================

-- Função para verificar limite de envios por IP
CREATE OR REPLACE FUNCTION check_rate_limit(
    ip_address TEXT,
    max_submissions INTEGER DEFAULT 3,
    time_window INTERVAL DEFAULT '1 hour'
)
RETURNS BOOLEAN AS $$
DECLARE
    submission_count INTEGER;
BEGIN
    -- Contar envios do mesmo IP na última hora
    SELECT COUNT(*)
    INTO submission_count
    FROM leads
    WHERE leads.ip_address = check_rate_limit.ip_address
    AND leads.created_at > NOW() - time_window;
    
    -- Retornar true se dentro do limite
    RETURN submission_count < max_submissions;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 3. FUNÇÃO DE VALIDAÇÃO DE EMAIL
-- =====================================================

-- Função para validar domínio de email
CREATE OR REPLACE FUNCTION validate_email_domain(email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    domain TEXT;
    disposable_domains TEXT[] := ARRAY[
        -- Domínios de teste e temporários
        'teste.com', 'test.com', 'example.com', 'example.org', 
        'example.net', 'test.org', 'demo.com', 'sample.com',
        -- Domínios descartáveis mais comuns
        '10minutemail.com', 'tempmail.org', 'guerrillamail.com',
        'mailinator.com', 'throwaway.email', 'temp-mail.org',
        'getnada.com', 'maildrop.cc', 'sharklasers.com',
        'grr.la', 'guerrillamailblock.com', 'pokemail.net',
        'spam4.me', 'bccto.me', 'chacuo.net', 'dispostable.com',
        'mailnesia.com', 'meltmail.com', 'mohmal.com',
        'mytrashmail.com', 'nada.email', 'nada.ltd',
        'nada.pro', 'nada.today', 'nada.website',
        'nada.win', 'nada.ws', 'nada.zone',
        'nadaemail.com', 'nadaemail.net', 'nadaemail.org',
        'nadaemail.us', 'nadaemail.ws', 'nadaemail.zone',
        'nadaemails.com', 'nadaemails.net', 'nadaemails.org',
        'nadaemails.us', 'nadaemails.ws', 'nadaemails.zone',
        'nadaemails.info', 'nadaemails.co', 'nadaemails.biz',
        'nadaemails.name', 'nadaemails.mobi', 'nadaemails.tel',
        'nadaemails.asia', 'nadaemails.travel', 'nadaemails.jobs',
        'nadaemails.museum', 'nadaemails.aero', 'nadaemails.coop',
        'nadaemails.arpa', 'nadaemails.int', 'nadaemails.eu',
        'nadaemails.uk', 'nadaemails.de', 'nadaemails.fr',
        'nadaemails.it', 'nadaemails.es', 'nadaemails.br',
        'nadaemails.com.br', 'nadaemails.net.br', 'nadaemails.org.br',
        'nadaemails.gov.br', 'nadaemails.mil.br', 'nadaemails.ind.br',
        'nadaemails.adv.br', 'nadaemails.arq.br', 'nadaemails.art.br',
        'nadaemails.ato.br', 'nadaemails.bio.br', 'nadaemails.blog.br',
        'nadaemails.bmd.br', 'nadaemails.cim.br', 'nadaemails.cng.br',
        'nadaemails.cnt.br', 'nadaemails.com.br', 'nadaemails.coop.br',
        'nadaemails.ecn.br', 'nadaemails.eco.br', 'nadaemails.edu.br',
        'nadaemails.emp.br', 'nadaemails.eng.br', 'nadaemails.esp.br',
        'nadaemails.etc.br', 'nadaemails.eti.br', 'nadaemails.far.br',
        'nadaemails.flog.br', 'nadaemails.fm.br', 'nadaemails.fnd.br',
        'nadaemails.fot.br', 'nadaemails.fst.br', 'nadaemails.g12.br',
        'nadaemails.ggf.br', 'nadaemails.gov.br', 'nadaemails.imb.br',
        'nadaemails.ind.br', 'nadaemails.inf.br', 'nadaemails.jor.br',
        'nadaemails.lel.br', 'nadaemails.mat.br', 'nadaemails.med.br',
        'nadaemails.mil.br', 'nadaemails.mus.br', 'nadaemails.net.br',
        'nadaemails.nom.br', 'nadaemails.not.br', 'nadaemails.ntr.br',
        'nadaemails.odo.br', 'nadaemails.org.br', 'nadaemails.ppg.br',
        'nadaemails.pro.br', 'nadaemails.psc.br', 'nadaemails.psi.br',
        'nadaemails.qsl.br', 'nadaemails.radio.br', 'nadaemails.rec.br',
        'nadaemails.slg.br', 'nadaemails.srv.br', 'nadaemails.tax.br',
        'nadaemails.teo.br', 'nadaemails.tmp.br', 'nadaemails.trd.br',
        'nadaemails.tur.br', 'nadaemails.tv.br', 'nadaemails.udi.br',
        'nadaemails.vet.br', 'nadaemails.vlog.br', 'nadaemails.wiki.br',
        'nadaemails.zlg.br'
    ];
BEGIN
    -- Extrair domínio do email
    domain := LOWER(SPLIT_PART(email, '@', 2));
    
    -- Verificar se o domínio está na lista de descartáveis
    RETURN NOT (domain = ANY(disposable_domains));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 3.1. FUNÇÃO DE VALIDAÇÃO DE DADOS DE TESTE
-- =====================================================

-- Função para validar se os dados não são de teste
CREATE OR REPLACE FUNCTION validate_test_data(
    nome TEXT,
    email TEXT,
    telefone TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    nome_lower TEXT;
    email_lower TEXT;
    telefone_numeros TEXT;
    test_patterns TEXT[] := ARRAY[
        'teste', 'test', 'demo', 'exemplo', 'example', 'fulano', 
        'beltrano', 'ciclano', 'joão', 'maria', 'josé', 'ana',
        'abc', 'xyz', '123', 'sample', 'amostra', 'fake', 'falso',
        'noreply', 'no-reply'
    ];
    blocked_sequences TEXT[] := ARRAY[
        '1234567890', '0987654321', '123456789', '987654321',
        '12345678', '87654321', '1234567', '7654321',
        '123456', '654321', '12345', '54321'
    ];
BEGIN
    -- Converter para minúsculas para comparação
    nome_lower := LOWER(TRIM(nome));
    email_lower := LOWER(email);
    
    -- Extrair apenas números do telefone
    telefone_numeros := REGEXP_REPLACE(telefone, '[^0-9]', '', 'g');
    
    -- Validar nome - não pode conter padrões de teste
    IF EXISTS (
        SELECT 1 FROM unnest(test_patterns) AS pattern 
        WHERE nome_lower LIKE '%' || pattern || '%'
    ) THEN
        RETURN FALSE;
    END IF;
    
    -- Validar email - não pode conter padrões de teste
    IF EXISTS (
        SELECT 1 FROM unnest(test_patterns) AS pattern 
        WHERE email_lower LIKE '%' || pattern || '%'
    ) THEN
        RETURN FALSE;
    END IF;
    
    -- Validar telefone - não pode ter todos os dígitos iguais
    IF telefone_numeros ~ '^(\d)\1+$' THEN
        RETURN FALSE;
    END IF;
    
    -- Validar telefone - não pode ser sequência óbvia
    IF telefone_numeros = ANY(blocked_sequences) THEN
        RETURN FALSE;
    END IF;
    
    -- Validar padrões específicos de telefone
    IF telefone LIKE '%99999-9999%' OR telefone LIKE '%11111-1111%' OR 
       telefone LIKE '%22222-2222%' OR telefone LIKE '%33333-3333%' THEN
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 4. POLÍTICAS RLS
-- =====================================================

-- Política para INSERT (permitir captura de leads)
CREATE POLICY "Permitir INSERT público para captura de leads" ON leads
    FOR INSERT 
    TO anon, authenticated
    WITH CHECK (
        -- Verificar rate limiting
        check_rate_limit(ip_address, 3, '1 hour') AND
        -- Verificar domínio de email
        validate_email_domain(email) AND
        -- Validar dados de teste
        validate_test_data(nome, email, telefone) AND
        -- Validar dados obrigatórios
        nome IS NOT NULL AND 
        telefone IS NOT NULL AND 
        email IS NOT NULL AND
        LENGTH(nome) >= 3 AND
        LENGTH(email) >= 5
    );

-- Política para SELECT (negar acesso de leitura para usuários anônimos)
CREATE POLICY "Negar SELECT para usuários anônimos" ON leads
    FOR SELECT 
    TO anon
    USING (false);

-- Política para UPDATE (negar atualizações para usuários anônimos)
CREATE POLICY "Negar UPDATE para usuários anônimos" ON leads
    FOR UPDATE 
    TO anon
    USING (false)
    WITH CHECK (false);

-- Política para DELETE (negar exclusões para usuários anônimos)
CREATE POLICY "Negar DELETE para usuários anônimos" ON leads
    FOR DELETE 
    TO anon
    USING (false);

-- =====================================================
-- 5. TRIGGERS PARA VALIDAÇÕES ADICIONAIS
-- =====================================================

-- Trigger para validações antes do INSERT
CREATE OR REPLACE FUNCTION validate_lead_insert()
RETURNS TRIGGER AS $$
BEGIN
    -- Validar formato do telefone (deve ter pelo menos 10 dígitos)
    IF NOT (NEW.telefone ~ '^[0-9() -]+$' AND LENGTH(REGEXP_REPLACE(NEW.telefone, '[^0-9]', '', 'g')) >= 10) THEN
        RAISE EXCEPTION 'Formato de telefone inválido. Use o formato (XX) XXXXX-XXXX';
    END IF;
    
    -- Validar formato do email
    IF NOT (NEW.email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$') THEN
        RAISE EXCEPTION 'Formato de email inválido';
    END IF;
    
    -- Validar nome (não pode conter apenas números)
    IF NEW.nome ~ '^[0-9\s]+$' THEN
        RAISE EXCEPTION 'Nome deve conter pelo menos algumas letras';
    END IF;
    
    -- Validar dados de teste
    IF NOT validate_test_data(NEW.nome, NEW.email, NEW.telefone) THEN
        RAISE EXCEPTION 'Por favor, use dados reais';
    END IF;
    
    -- Definir timestamps se não fornecidos
    IF NEW.data_captura IS NULL THEN
        NEW.data_captura := NOW();
    END IF;
    
    IF NEW.created_at IS NULL THEN
        NEW.created_at := NOW();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger na tabela leads
DROP TRIGGER IF EXISTS trigger_validate_lead_insert ON leads;
CREATE TRIGGER trigger_validate_lead_insert
    BEFORE INSERT ON leads
    FOR EACH ROW
    EXECUTE FUNCTION validate_lead_insert();

-- =====================================================
-- 6. ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índice para rate limiting (IP + timestamp)
CREATE INDEX IF NOT EXISTS idx_leads_rate_limit 
ON leads(ip_address, created_at);

-- Índice para validação de email
CREATE INDEX IF NOT EXISTS idx_leads_email_domain 
ON leads(SPLIT_PART(email, '@', 2));

-- =====================================================
-- 7. COMENTÁRIOS E DOCUMENTAÇÃO
-- =====================================================

-- Comentários na tabela
COMMENT ON TABLE leads IS 'Tabela de leads capturados pela Calculadora Pódium com políticas de segurança RLS';

-- Comentários nas colunas
COMMENT ON COLUMN leads.id IS 'ID único do lead (auto-incremento)';
COMMENT ON COLUMN leads.nome IS 'Nome completo do lead (mínimo 3 caracteres)';
COMMENT ON COLUMN leads.telefone IS 'Telefone com DDD (formato: (XX) XXXXX-XXXX)';
COMMENT ON COLUMN leads.email IS 'Email válido (domínios descartáveis bloqueados)';
COMMENT ON COLUMN leads.data_captura IS 'Data e hora da captura do lead';
COMMENT ON COLUMN leads.user_agent IS 'User Agent do navegador';
COMMENT ON COLUMN leads.ip_address IS 'Endereço IP do usuário (para rate limiting)';
COMMENT ON COLUMN leads.created_at IS 'Timestamp de criação do registro';

-- =====================================================
-- 8. FUNÇÕES AUXILIARES PARA ADMINISTRAÇÃO
-- =====================================================

-- Função para verificar estatísticas de rate limiting
CREATE OR REPLACE FUNCTION get_rate_limit_stats()
RETURNS TABLE(
    ip_address TEXT,
    submissions_last_hour INTEGER,
    last_submission TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        l.ip_address,
        COUNT(*)::INTEGER as submissions_last_hour,
        MAX(l.created_at) as last_submission
    FROM leads l
    WHERE l.created_at > NOW() - INTERVAL '1 hour'
    GROUP BY l.ip_address
    ORDER BY submissions_last_hour DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para limpar dados antigos (manutenção)
CREATE OR REPLACE FUNCTION cleanup_old_leads(days_to_keep INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM leads 
    WHERE created_at < NOW() - (days_to_keep || ' days')::INTERVAL;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 9. CONFIGURAÇÕES DE SEGURANÇA ADICIONAIS
-- =====================================================

-- Garantir que apenas o service_role possa executar funções administrativas
REVOKE EXECUTE ON FUNCTION get_rate_limit_stats() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION cleanup_old_leads(INTEGER) FROM anon, authenticated;

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================

-- Verificar se RLS está habilitado
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_class 
        WHERE relname = 'leads' 
        AND relrowsecurity = true
    ) THEN
        RAISE EXCEPTION 'RLS não foi habilitado na tabela leads';
    END IF;
    
    RAISE NOTICE '✅ RLS habilitado com sucesso na tabela leads';
    RAISE NOTICE '✅ Políticas de segurança aplicadas';
    RAISE NOTICE '✅ Rate limiting configurado (3 envios/IP/hora)';
    RAISE NOTICE '✅ Validação de email implementada';
    RAISE NOTICE '✅ Triggers de validação ativos';
END $$;

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================
