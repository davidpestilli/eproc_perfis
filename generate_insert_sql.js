// Script para gerar SQL de população da tabela matriz_acesso
const fs = require('fs');

// Importar dados do data.js
const dataContent = fs.readFileSync('./data.js', 'utf8');

// Extrair rawData usando regex
const match = dataContent.match(/const rawData = (\[[\s\S]*?\]);/);
if (!match) {
    console.error('Não foi possível extrair rawData do arquivo data.js');
    process.exit(1);
}

const rawData = eval('(' + match[1] + ')');

// Função para escapar strings SQL
function escapeSql(str) {
    if (str === null || str === undefined) return 'NULL';
    if (typeof str === 'number') return str;
    return "'" + String(str).replace(/'/g, "''") + "'";
}

// Gerar INSERT statements
let sql = `-- ===========================
-- POPULAR TABELA MATRIZ DE ACESSO
-- ===========================

-- Limpar dados existentes (opcional)
-- TRUNCATE TABLE matriz_acesso RESTART IDENTITY CASCADE;

-- Inserir dados
`;

rawData.forEach((row, index) => {
    const intimacao = escapeSql(row.mpIntimado);
    const vista = escapeSql(row.vistaMP);
    const procurador = escapeSql(row.procuradorVinculado);
    const sigiloProc = row.sigiloProcesso;
    const sigiloDoc = row.sigiloDocumento;
    const tipoAcesso = escapeSql(row.tipoAcesso);
    const observacoes = escapeSql(row.comentarios);
    const processo = escapeSql(row.processo);
    const fonte = escapeSql(row.fonte);

    sql += `INSERT INTO matriz_acesso (intimacao_mp, vista_mp, procurador_vinculado, sigilo_processo, sigilo_documento, tipo_acesso, observacoes, processo, fonte) VALUES (${intimacao}, ${vista}, ${procurador}, ${sigiloProc}, ${sigiloDoc}, ${tipoAcesso}, ${observacoes}, ${processo}, ${fonte});\n`;
});

sql += `\n-- Total de registros inseridos: ${rawData.length}\n`;

// Salvar arquivo
fs.writeFileSync('./populate_table.sql', sql, 'utf8');
console.log('Arquivo populate_table.sql gerado com sucesso!');
console.log(`Total de registros: ${rawData.length}`);