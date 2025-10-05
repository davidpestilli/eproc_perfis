-- ===========================
-- CRIAR TABELA MATRIZ DE ACESSO
-- ===========================

-- Criar tipo ENUM para as opções SIM/NÃO
CREATE TYPE opcao_sim_nao AS ENUM ('SIM', 'NÃO', 'N/A');

-- Criar tabela matriz_acesso
CREATE TABLE IF NOT EXISTS matriz_acesso (
    id BIGSERIAL PRIMARY KEY,
    vista_mp opcao_sim_nao NOT NULL DEFAULT 'N/A',
    procurador_vinculado opcao_sim_nao NOT NULL DEFAULT 'NÃO',
    sigilo_processo INTEGER NOT NULL DEFAULT 0 CHECK (sigilo_processo >= 0 AND sigilo_processo <= 5),
    sigilo_documento INTEGER NOT NULL DEFAULT 0 CHECK (sigilo_documento >= 0 AND sigilo_documento <= 5),
    tipo_acesso TEXT NOT NULL,
    observacoes TEXT,
    processo TEXT,
    fonte TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_matriz_vista_mp ON matriz_acesso(vista_mp);
CREATE INDEX IF NOT EXISTS idx_matriz_procurador ON matriz_acesso(procurador_vinculado);
CREATE INDEX IF NOT EXISTS idx_matriz_sigilo_proc ON matriz_acesso(sigilo_processo);
CREATE INDEX IF NOT EXISTS idx_matriz_sigilo_doc ON matriz_acesso(sigilo_documento);

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para atualizar updated_at
CREATE TRIGGER update_matriz_acesso_updated_at
    BEFORE UPDATE ON matriz_acesso
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ===========================
-- CONFIGURAR RLS (Row Level Security)
-- Acesso mais permissivo possível
-- ===========================

-- Habilitar RLS
ALTER TABLE matriz_acesso ENABLE ROW LEVEL SECURITY;

-- Política para permitir SELECT (leitura) para todos
CREATE POLICY "Permitir leitura para todos"
    ON matriz_acesso
    FOR SELECT
    USING (true);

-- Política para permitir INSERT (inserção) para todos
CREATE POLICY "Permitir inserção para todos"
    ON matriz_acesso
    FOR INSERT
    WITH CHECK (true);

-- Política para permitir UPDATE (atualização) para todos
CREATE POLICY "Permitir atualização para todos"
    ON matriz_acesso
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Política para permitir DELETE (exclusão) para todos
CREATE POLICY "Permitir exclusão para todos"
    ON matriz_acesso
    FOR DELETE
    USING (true);

-- Comentários na tabela e colunas para documentação
COMMENT ON TABLE matriz_acesso IS 'Matriz de controle de acesso - Analista Procuradoria';
COMMENT ON COLUMN matriz_acesso.vista_mp IS 'Indica se o MP está vinculado ao processo (SIM/NÃO/N/A)';
COMMENT ON COLUMN matriz_acesso.procurador_vinculado IS 'Indica se o procurador está associado ao analista e vinculado ao processo (SIM/NÃO/N/A)';
COMMENT ON COLUMN matriz_acesso.sigilo_processo IS 'Nível de sigilo do processo (0-5)';
COMMENT ON COLUMN matriz_acesso.sigilo_documento IS 'Nível de sigilo do documento (0-5)';
COMMENT ON COLUMN matriz_acesso.tipo_acesso IS 'Tipo de acesso concedido (TOTAL, PARCIAL, NEGADO, etc)';
COMMENT ON COLUMN matriz_acesso.observacoes IS 'Observações e comentários sobre o cenário de acesso';
COMMENT ON COLUMN matriz_acesso.processo IS 'Número do processo utilizado no teste';
COMMENT ON COLUMN matriz_acesso.fonte IS 'Fonte dos dados (ANALISE_GERAL, COM_INTIMACAO_MP, SEM_INTIMACAO_MP)';