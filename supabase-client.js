// ===========================
// SUPABASE CLIENT CONFIGURATION
// ===========================

// Configuração do cliente Supabase
const SUPABASE_URL = 'https://rdkvvigjmowtvhxqlrnp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJka3Z2aWdqbW93dHZoeHFscm5wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjE2OTA4NCwiZXhwIjoyMDU3NzQ1MDg0fQ.7iTGWIPMWoxTqIU_aX4HaardWqnCWCkPVLzz28eg_SM';

// Criar cliente Supabase
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===========================
// FUNÇÕES DE ACESSO AO BANCO
// ===========================

/**
 * Buscar todos os registros da matriz de acesso
 */
async function fetchMatrizAcesso() {
    try {
        const { data, error } = await supabaseClient
            .from('matriz_acesso')
            .select('*')
            .order('id', { ascending: true });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        return [];
    }
}

/**
 * Atualizar um registro específico
 */
async function updateMatrizAcesso(id, updates) {
    try {
        const { data, error } = await supabaseClient
            .from('matriz_acesso')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Erro ao atualizar registro:', error);
        return { success: false, error };
    }
}

/**
 * Deletar um registro específico
 */
async function deleteMatrizAcesso(id) {
    try {
        const { error } = await supabaseClient
            .from('matriz_acesso')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Erro ao deletar registro:', error);
        return { success: false, error };
    }
}

/**
 * Inserir um novo registro
 */
async function insertMatrizAcesso(newRecord) {
    try {
        const { data, error } = await supabaseClient
            .from('matriz_acesso')
            .insert([newRecord])
            .select();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Erro ao inserir registro:', error);
        return { success: false, error };
    }
}