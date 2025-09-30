# Configuração do Supabase - Matriz de Acesso

## 📋 Pré-requisitos

- Conta no Supabase (https://supabase.com)
- Acesso ao SQL Editor do Supabase

## 🚀 Passos para Configuração

### 1. Criar a Tabela

1. Acesse seu projeto no Supabase
2. Vá para **SQL Editor** no menu lateral
3. Clique em **New Query**
4. Copie e cole o conteúdo do arquivo `create_table.sql`
5. Clique em **Run** para executar

Isso irá:
- Criar o tipo ENUM `opcao_sim_nao`
- Criar a tabela `matriz_acesso` com todas as colunas
- Criar índices para melhor performance
- Configurar trigger para atualizar `updated_at` automaticamente
- Habilitar RLS (Row Level Security) com acesso permissivo
- Adicionar comentários de documentação

### 2. Popular a Tabela

1. No **SQL Editor**, crie uma **Nova Query**
2. Copie e cole o conteúdo do arquivo `populate_table.sql`
3. Clique em **Run** para executar

Isso irá inserir **38 registros** na tabela com os dados atuais da Matriz de Acesso.

### 3. Verificar a Configuração

Execute a seguinte query para verificar se tudo está correto:

```sql
-- Verificar total de registros
SELECT COUNT(*) FROM matriz_acesso;

-- Visualizar alguns registros
SELECT id, intimacao_mp, vista_mp, procurador_vinculado, sigilo_processo, sigilo_documento, tipo_acesso
FROM matriz_acesso
LIMIT 10;

-- Verificar políticas de RLS
SELECT * FROM pg_policies WHERE tablename = 'matriz_acesso';
```

### 4. Configurar Variáveis de Ambiente

O arquivo `.env` já contém as credenciais necessárias:

```env
VITE_SUPABASE_URL=https://rdkvvigjmowtvhxqlrnp.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📊 Estrutura da Tabela

### Colunas

| Coluna | Tipo | Descrição | Valores Permitidos |
|--------|------|-----------|-------------------|
| `id` | BIGSERIAL | ID único (auto-incremento) | - |
| `intimacao_mp` | ENUM | Indica se MP foi intimado | SIM, NÃO, N/A |
| `vista_mp` | ENUM | Indica se há Vista ao MP | SIM, NÃO, N/A |
| `procurador_vinculado` | ENUM | Procurador vinculado | SIM, NÃO, N/A |
| `sigilo_processo` | INTEGER | Nível de sigilo do processo | 0-5 |
| `sigilo_documento` | INTEGER | Nível de sigilo do documento | 0-5 |
| `tipo_acesso` | TEXT | Tipo de acesso concedido | TOTAL, PARCIAL, NEGADO, etc |
| `observacoes` | TEXT | Comentários sobre o cenário | Texto livre |
| `processo` | TEXT | Número do processo de teste | - |
| `fonte` | TEXT | Origem dos dados | ANALISE_GERAL, COM_INTIMACAO_MP, etc |
| `created_at` | TIMESTAMPTZ | Data de criação | Auto |
| `updated_at` | TIMESTAMPTZ | Data de atualização | Auto |

### Índices Criados

- `idx_matriz_intimacao_mp` - Índice em intimacao_mp
- `idx_matriz_vista_mp` - Índice em vista_mp
- `idx_matriz_procurador` - Índice em procurador_vinculado
- `idx_matriz_sigilo_proc` - Índice em sigilo_processo
- `idx_matriz_sigilo_doc` - Índice em sigilo_documento

## 🔐 Políticas de Segurança (RLS)

A tabela está configurada com **acesso mais permissivo possível**:

- ✅ **SELECT** - Todos podem ler
- ✅ **INSERT** - Todos podem inserir
- ✅ **UPDATE** - Todos podem atualizar
- ✅ **DELETE** - Todos podem excluir

## 🔄 Operações Comuns

### Adicionar Novo Registro

```sql
INSERT INTO matriz_acesso (
    intimacao_mp, vista_mp, procurador_vinculado,
    sigilo_processo, sigilo_documento, tipo_acesso, observacoes
) VALUES (
    'SIM', 'SIM', 'SIM',
    0, 0, 'TOTAL', 'Novo cenário de teste'
);
```

### Atualizar Registro

```sql
UPDATE matriz_acesso
SET observacoes = 'Observação atualizada'
WHERE id = 1;
```

### Deletar Registro

```sql
DELETE FROM matriz_acesso WHERE id = 1;
```

### Filtrar por Condições

```sql
-- Todos os casos com acesso TOTAL
SELECT * FROM matriz_acesso WHERE tipo_acesso = 'TOTAL';

-- Casos com intimação do MP e sigilo 0
SELECT * FROM matriz_acesso
WHERE intimacao_mp = 'SIM' AND sigilo_processo = 0;
```

## 📝 Notas Importantes

1. **Backup Automático**: O Supabase faz backups automáticos diários
2. **Auditoria**: As colunas `created_at` e `updated_at` são atualizadas automaticamente
3. **Performance**: Os índices garantem consultas rápidas mesmo com muitos registros
4. **Validação**: Constraints garantem que sigilos estejam sempre entre 0-5

## 🆘 Solução de Problemas

### Erro: "type opcao_sim_nao already exists"
Se você executar `create_table.sql` novamente, pode encontrar esse erro. Solução:
```sql
DROP TYPE IF EXISTS opcao_sim_nao CASCADE;
```

### Limpar Todos os Dados
```sql
TRUNCATE TABLE matriz_acesso RESTART IDENTITY CASCADE;
```

### Recriar a Tabela
```sql
DROP TABLE IF EXISTS matriz_acesso CASCADE;
-- Depois execute create_table.sql novamente
```