// ===========================
// TAB NAVIGATION
// ===========================
document.addEventListener('DOMContentLoaded', function() {
    initTabs();
    initFilters();
    renderMatrix();
    renderCharts();
    renderScenarios();
    updateStats();
    initSideModal();
    initComparison();
    initAddNewRowButton();
    initGlobalEditButton();
});

function initAddNewRowButton() {
    const addBtn = document.getElementById('add-new-row-btn');
    if (addBtn) {
        addBtn.addEventListener('click', handleAddNewRow);
    }
}

function initGlobalEditButton() {
    const editBtn = document.getElementById('global-edit-btn');
    if (editBtn) {
        editBtn.addEventListener('click', toggleGlobalEditMode);
    }
}

// ===========================
// COMPARISON FUNCTIONALITY
// ===========================
let selectedRows = [];

function initComparison() {
    const clearBtn = document.getElementById('clear-comparison');
    const selectAllCheckbox = document.getElementById('select-all-checkbox');

    clearBtn.addEventListener('click', clearComparison);
    selectAllCheckbox.addEventListener('change', toggleSelectAll);
}

function toggleRowSelection(checkbox, rowIndex, rowData) {
    if (checkbox.checked) {
        selectedRows.push({ index: rowIndex, data: rowData });
    } else {
        selectedRows = selectedRows.filter(r => r.index !== rowIndex);
    }
    updateComparisonBox();
}

function toggleSelectAll() {
    const selectAllCheckbox = document.getElementById('select-all-checkbox');
    const checkboxes = document.querySelectorAll('.row-checkbox');

    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
        const rowIndex = parseInt(checkbox.dataset.rowIndex);
        const rowData = JSON.parse(checkbox.dataset.rowData);

        if (selectAllCheckbox.checked) {
            if (!selectedRows.find(r => r.index === rowIndex)) {
                selectedRows.push({ index: rowIndex, data: rowData });
            }
        }
    });

    if (!selectAllCheckbox.checked) {
        selectedRows = [];
    }

    updateComparisonBox();
}

function updateComparisonBox() {
    const comparisonBox = document.getElementById('comparison-box');
    const comparisonContent = document.getElementById('comparison-content');

    if (selectedRows.length === 0) {
        comparisonBox.style.display = 'none';
        return;
    }

    comparisonBox.style.display = 'block';

    let html = '<div class="comparison-table-wrapper"><table class="comparison-table"><thead><tr>';
    html += '<th>#</th>';
    html += '<th>Intimação MP</th>';
    html += '<th>Vista MP</th>';
    html += '<th>Procurador Vinc.</th>';
    html += '<th>Sigilo Proc.</th>';
    html += '<th>Sigilo Doc.</th>';
    html += '<th>Tipo de Acesso</th>';
    html += '<th>Observações</th>';
    html += '</tr></thead><tbody>';

    selectedRows.forEach(row => {
        const data = row.data;

        // Suportar ambos formatos (snake_case do Supabase e camelCase do rawData)
        const intimacaoMp = data.intimacao_mp !== undefined ? data.intimacao_mp : data.mpIntimado;
        const vistaMp = data.vista_mp !== undefined ? data.vista_mp : data.vistaMP;
        const procuradorVinc = data.procurador_vinculado !== undefined ? data.procurador_vinculado : data.procuradorVinculado;
        const sigiloProc = data.sigilo_processo !== undefined ? data.sigilo_processo : data.sigiloProcesso;
        const sigiloDoc = data.sigilo_documento !== undefined ? data.sigilo_documento : data.sigiloDocumento;
        const tipoAcesso = data.tipo_acesso !== undefined ? data.tipo_acesso : data.tipoAcesso;
        const observacoes = data.observacoes !== undefined ? data.observacoes : data.comentarios;

        let tipoAcessoText = tipoAcesso || 'N/A';
        tipoAcessoText = tipoAcessoText.replace(/_/g, ' ').toLowerCase();
        tipoAcessoText = tipoAcessoText.charAt(0).toUpperCase() + tipoAcessoText.slice(1);

        html += '<tr>';
        html += `<td><strong>${row.index}</strong></td>`;
        html += `<td>${intimacaoMp === 'N/A' ? '—' : intimacaoMp}</td>`;
        html += `<td>${vistaMp === 'N/A' ? '—' : vistaMp}</td>`;
        html += `<td>${procuradorVinc}</td>`;
        html += `<td>${sigiloProc}</td>`;
        html += `<td>${sigiloDoc}</td>`;
        html += `<td style="font-size: 0.85rem;">${tipoAcessoText}</td>`;
        html += `<td style="font-size: 0.85rem;">${observacoes || '—'}</td>`;
        html += '</tr>';
    });

    html += '</tbody></table></div>';
    comparisonContent.innerHTML = html;
}

function clearComparison() {
    selectedRows = [];
    const checkboxes = document.querySelectorAll('.row-checkbox');
    checkboxes.forEach(cb => cb.checked = false);
    document.getElementById('select-all-checkbox').checked = false;
    updateComparisonBox();
}

function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');

            // Update side modal based on active tab
            updateSideModal(targetTab);
        });
    });

    // Initialize with the current active tab
    const activeTab = document.querySelector('.tab-btn.active')?.getAttribute('data-tab') || 'overview';
    updateSideModal(activeTab);
}

// ===========================
// FILTERS
// ===========================
function initFilters() {
    const sigiloFilter = document.getElementById('filter-sigilo');
    const accessFilter = document.getElementById('filter-access');
    const intimacaoFilter = document.getElementById('filter-intimacao');
    const vistaFilter = document.getElementById('filter-vista');

    sigiloFilter.addEventListener('change', () => renderMatrix());
    accessFilter.addEventListener('change', () => renderMatrix());
    intimacaoFilter.addEventListener('change', () => renderMatrix());
    vistaFilter.addEventListener('change', () => renderMatrix());
}

// ===========================
// KEYWORDS HIGHLIGHTING
// ===========================
function highlightKeywords(text) {
    if (!text) return text;

    const keywords = [
        'rito',
        'localidade',
        'permissão expressa',
        'permissão'
    ];

    let highlightedText = text;

    // Sort keywords by length (descending) to handle "permissão expressa" before "permissão"
    keywords.sort((a, b) => b.length - a.length);

    keywords.forEach(keyword => {
        // Case-insensitive regex with word boundaries
        const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
        highlightedText = highlightedText.replace(regex, '<span class="keyword-highlight">$1</span>');
    });

    return highlightedText;
}

// ===========================
// MATRIX TABLE WITH SUPABASE
// ===========================
let matrizData = []; // Armazenar dados do Supabase
let isGlobalEditMode = false; // Modo de edição global (toda a tabela)
let editingData = {}; // Armazenar dados temporários durante edição

async function renderMatrix() {
    const sigiloFilter = document.getElementById('filter-sigilo').value;
    const accessFilter = document.getElementById('filter-access').value;
    const intimacaoFilter = document.getElementById('filter-intimacao').value;
    const vistaFilter = document.getElementById('filter-vista').value;
    const tbody = document.getElementById('matrix-body');

    // Mostrar loading
    tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; padding: 30px;">⏳ Carregando dados...</td></tr>';

    // Buscar dados do Supabase
    matrizData = await fetchMatrizAcesso();

    // Se não houver dados no Supabase, usar rawData como fallback
    const dataSource = matrizData.length > 0 ? matrizData : rawData;

    let filteredData = dataSource.filter(row => {
        // Filter by sigilo (apenas Sigilo Proc.)
        if (sigiloFilter !== 'all') {
            const sigilo = parseInt(sigiloFilter);
            const sigiloProc = row.sigilo_processo !== undefined ? row.sigilo_processo : row.sigiloProcesso;
            if (sigiloProc !== sigilo) return false;
        }

        // Filter by intimacao
        if (intimacaoFilter !== 'all') {
            const intimacao = row.intimacao_mp !== undefined ? row.intimacao_mp : row.mpIntimado;
            if (intimacao !== intimacaoFilter) return false;
        }

        // Filter by vista
        if (vistaFilter !== 'all') {
            const vista = row.vista_mp !== undefined ? row.vista_mp : row.vistaMP;
            if (vista !== vistaFilter) return false;
        }

        // Filter by access (tipo_acesso)
        if (accessFilter !== 'all') {
            const tipoAcesso = row.tipo_acesso !== undefined ? row.tipo_acesso : row.tipoAcesso;
            if (tipoAcesso !== accessFilter) return false;
        }

        return true;
    });

    tbody.innerHTML = '';

    filteredData.forEach((row, index) => {
        const tr = document.createElement('tr');
        const rowNumber = index + 1;

        // Suportar ambos formatos (snake_case do Supabase e camelCase do rawData)
        const rowId = row.id;
        const intimacaoMp = row.intimacao_mp !== undefined ? row.intimacao_mp : row.mpIntimado;
        const vistaMp = row.vista_mp !== undefined ? row.vista_mp : row.vistaMP;
        const procuradorVinc = row.procurador_vinculado !== undefined ? row.procurador_vinculado : row.procuradorVinculado;
        const sigiloProc = row.sigilo_processo !== undefined ? row.sigilo_processo : row.sigiloProcesso;
        const sigiloDoc = row.sigilo_documento !== undefined ? row.sigilo_documento : row.sigiloDocumento;
        const tipoAcesso = row.tipo_acesso !== undefined ? row.tipo_acesso : row.tipoAcesso;
        const observacoes = row.observacoes !== undefined ? row.observacoes : row.comentarios;

        tr.dataset.rowId = rowId;

        // Renderizar células baseado no modo global (Consulta ou Edição)
        if (isGlobalEditMode) {
            // MODO EDIÇÃO - Campos editáveis
            tr.innerHTML = `
                <td style="text-align: center;">
                    <input type="checkbox" class="row-checkbox" data-row-index="${rowNumber}" data-row-data='${JSON.stringify(row)}'>
                </td>
                <td style="text-align: center; font-weight: bold; color: var(--primary-color);">${rowNumber}</td>
                <td>
                    <select class="editable-select" data-field="intimacao_mp" data-row-id="${rowId}">
                        <option value="SIM" ${intimacaoMp === 'SIM' ? 'selected' : ''}>SIM</option>
                        <option value="NÃO" ${intimacaoMp === 'NÃO' ? 'selected' : ''}>NÃO</option>
                        <option value="N/A" ${intimacaoMp === 'N/A' ? 'selected' : ''}>N/A</option>
                    </select>
                </td>
                <td>
                    <select class="editable-select" data-field="vista_mp" data-row-id="${rowId}">
                        <option value="SIM" ${vistaMp === 'SIM' ? 'selected' : ''}>SIM</option>
                        <option value="NÃO" ${vistaMp === 'NÃO' ? 'selected' : ''}>NÃO</option>
                        <option value="N/A" ${vistaMp === 'N/A' ? 'selected' : ''}>N/A</option>
                    </select>
                </td>
                <td>
                    <select class="editable-select" data-field="procurador_vinculado" data-row-id="${rowId}">
                        <option value="SIM" ${procuradorVinc === 'SIM' ? 'selected' : ''}>SIM</option>
                        <option value="NÃO" ${procuradorVinc === 'NÃO' ? 'selected' : ''}>NÃO</option>
                        <option value="N/A" ${procuradorVinc === 'N/A' ? 'selected' : ''}>N/A</option>
                    </select>
                </td>
                <td>
                    <select class="editable-select" data-field="sigilo_processo" data-row-id="${rowId}">
                        <option value="0" ${sigiloProc == 0 ? 'selected' : ''}>0</option>
                        <option value="1" ${sigiloProc == 1 ? 'selected' : ''}>1</option>
                        <option value="2" ${sigiloProc == 2 ? 'selected' : ''}>2</option>
                        <option value="3" ${sigiloProc == 3 ? 'selected' : ''}>3</option>
                        <option value="4" ${sigiloProc == 4 ? 'selected' : ''}>4</option>
                        <option value="5" ${sigiloProc == 5 ? 'selected' : ''}>5</option>
                    </select>
                </td>
                <td>
                    <select class="editable-select" data-field="sigilo_documento" data-row-id="${rowId}">
                        <option value="0" ${sigiloDoc == 0 ? 'selected' : ''}>0</option>
                        <option value="1" ${sigiloDoc == 1 ? 'selected' : ''}>1</option>
                        <option value="2" ${sigiloDoc == 2 ? 'selected' : ''}>2</option>
                        <option value="3" ${sigiloDoc == 3 ? 'selected' : ''}>3</option>
                        <option value="4" ${sigiloDoc == 4 ? 'selected' : ''}>4</option>
                        <option value="5" ${sigiloDoc == 5 ? 'selected' : ''}>5</option>
                    </select>
                </td>
                <td>
                    <input type="text" class="editable-input" data-field="tipo_acesso" data-row-id="${rowId}" value="${tipoAcesso || ''}" />
                </td>
                <td>
                    <textarea class="editable-textarea" data-field="observacoes" data-row-id="${rowId}" rows="2">${observacoes || ''}</textarea>
                </td>
                <td style="text-align: center;">
                    <button class="delete-btn" data-row-id="${rowId}" title="Deletar linha">🗑️</button>
                </td>
            `;
        } else {
            // MODO CONSULTA - Campos como texto
            tr.innerHTML = `
                <td style="text-align: center;">
                    <input type="checkbox" class="row-checkbox" data-row-index="${rowNumber}" data-row-data='${JSON.stringify(row)}'>
                </td>
                <td style="text-align: center; font-weight: bold; color: var(--primary-color);">${rowNumber}</td>
                <td class="read-only-cell">${intimacaoMp === 'N/A' ? '—' : intimacaoMp}</td>
                <td class="read-only-cell">${vistaMp === 'N/A' ? '—' : vistaMp}</td>
                <td class="read-only-cell">${procuradorVinc === 'N/A' ? '—' : procuradorVinc}</td>
                <td class="read-only-cell">${sigiloProc}</td>
                <td class="read-only-cell">${sigiloDoc}</td>
                <td class="read-only-cell">${tipoAcesso || '—'}</td>
                <td class="read-only-cell observacoes-cell">${observacoes || '—'}</td>
            `;
        }

        // Add event listeners
        const checkbox = tr.querySelector('.row-checkbox');
        checkbox.addEventListener('change', function() {
            toggleRowSelection(this, rowNumber, row);
        });

        if (isGlobalEditMode) {
            // Event listeners para modo EDIÇÃO GLOBAL

            // Armazenar mudanças temporariamente (não salvar automaticamente)
            const selects = tr.querySelectorAll('.editable-select');
            selects.forEach(select => {
                select.addEventListener('change', function() {
                    storeTemporaryEdit(rowId, this.dataset.field, this.value);
                });
            });

            const inputs = tr.querySelectorAll('.editable-input');
            inputs.forEach(input => {
                input.addEventListener('input', function() {
                    storeTemporaryEdit(rowId, this.dataset.field, this.value);
                });
            });

            const textareas = tr.querySelectorAll('.editable-textarea');
            textareas.forEach(textarea => {
                textarea.addEventListener('input', function() {
                    storeTemporaryEdit(rowId, this.dataset.field, this.value);
                });
            });

            // Delete button (apenas em modo edição)
            const deleteBtn = tr.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', handleDelete);
        }

        tbody.appendChild(tr);
    });

    if (filteredData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; padding: 30px; color: var(--text-secondary);">Nenhum resultado encontrado com os filtros selecionados</td></tr>';
    }

    // Clear comparison when filters change
    clearComparison();
}

// ===========================
// CRUD OPERATIONS
// ===========================

async function handleFieldUpdate(event) {
    const element = event.target;
    const rowId = element.dataset.rowId;
    const field = element.dataset.field;
    const value = element.value;

    if (!rowId) return; // Se não tem ID, é dado local (rawData)

    // Mostrar status de sincronização
    showSyncStatus('Salvando...');

    // Atualizar no Supabase
    const updates = {};
    updates[field] = field.includes('sigilo') ? parseInt(value) : value;

    const result = await updateMatrizAcesso(rowId, updates);

    if (result.success) {
        showSyncStatus('✓ Salvo', 'success');
    } else {
        showSyncStatus('✗ Erro ao salvar', 'error');
        console.error('Erro ao atualizar:', result.error);
    }
}

async function handleDelete(event) {
    const rowId = event.target.dataset.rowId;

    if (!rowId) {
        alert('Não é possível deletar registros locais. Por favor, use o Supabase.');
        return;
    }

    if (!confirm('Tem certeza que deseja deletar esta linha?')) {
        return;
    }

    showSyncStatus('Deletando...');

    const result = await deleteMatrizAcesso(rowId);

    if (result.success) {
        showSyncStatus('✓ Deletado', 'success');
        // Recarregar tabela
        await renderMatrix();
    } else {
        showSyncStatus('✗ Erro ao deletar', 'error');
        console.error('Erro ao deletar:', result.error);
    }
}

async function handleAddNewRow() {
    showSyncStatus('Adicionando nova linha...');

    const newRecord = {
        intimacao_mp: 'NÃO',
        vista_mp: 'NÃO',
        procurador_vinculado: 'NÃO',
        sigilo_processo: 0,
        sigilo_documento: 0,
        tipo_acesso: 'NEGADO',
        observacoes: 'Nova linha',
        processo: '',
        fonte: 'MANUAL'
    };

    const result = await insertMatrizAcesso(newRecord);

    if (result.success) {
        showSyncStatus('✓ Linha adicionada', 'success');
        // Recarregar tabela
        await renderMatrix();
    } else {
        showSyncStatus('✗ Erro ao adicionar', 'error');
        console.error('Erro ao inserir:', result.error);
    }
}

// ===========================
// FUNÇÕES DE EDIÇÃO GLOBAL
// ===========================

function toggleGlobalEditMode() {
    isGlobalEditMode = !isGlobalEditMode;

    const editBtn = document.getElementById('global-edit-btn');
    const addBtn = document.getElementById('add-new-row-btn');
    const actionsHeader = document.getElementById('actions-header');

    if (isGlobalEditMode) {
        // Entrar em modo EDIÇÃO
        editBtn.textContent = '💾 Salvar Tudo';
        editBtn.classList.add('save-mode');
        addBtn.style.display = 'inline-block';
        actionsHeader.style.display = 'table-cell';
    } else {
        // Voltar para modo CONSULTA
        editBtn.textContent = '✏️ Editar';
        editBtn.classList.remove('save-mode');
        addBtn.style.display = 'none';
        actionsHeader.style.display = 'none';

        // Salvar todas as alterações pendentes
        saveAllChanges();
    }

    renderMatrix();
}

async function saveAllChanges() {
    const rowsWithChanges = Object.keys(editingData);

    if (rowsWithChanges.length === 0) {
        return;
    }

    showSyncStatus(`Salvando ${rowsWithChanges.length} alterações...`);

    let successCount = 0;
    let errorCount = 0;

    for (const rowId of rowsWithChanges) {
        const updates = editingData[rowId];

        if (Object.keys(updates).length > 0) {
            const result = await updateMatrizAcesso(rowId, updates);

            if (result.success) {
                successCount++;
            } else {
                errorCount++;
                console.error(`Erro ao salvar linha ${rowId}:`, result.error);
            }
        }
    }

    // Limpar dados temporários
    editingData = {};

    if (errorCount === 0) {
        showSyncStatus(`✓ ${successCount} alterações salvas`, 'success');
    } else {
        showSyncStatus(`⚠ ${successCount} salvas, ${errorCount} com erro`, 'error');
    }

    // Recarregar dados do Supabase
    await renderMatrix();
}

function storeTemporaryEdit(rowId, field, value) {
    if (!editingData[rowId]) {
        editingData[rowId] = {};
    }

    // Convert sigilo fields to integers
    if (field.includes('sigilo')) {
        value = parseInt(value);
    }

    editingData[rowId][field] = value;
}

function showSyncStatus(message, type = 'info') {
    const statusEl = document.getElementById('sync-status');
    if (!statusEl) return;

    statusEl.textContent = message;
    statusEl.className = 'sync-status ' + type;

    // Limpar depois de 3 segundos
    setTimeout(() => {
        statusEl.textContent = '';
        statusEl.className = 'sync-status';
    }, 3000);
}

// ===========================
// CHARTS - Removed, not needed
// ===========================
function renderCharts() {
    // Charts removed per user request
}

// ===========================
// SCENARIOS ACCORDION
// ===========================
function renderScenarios() {
    const container = document.getElementById('scenarios-list');
    container.innerHTML = '';

    scenarios.forEach(scenario => {
        const item = document.createElement('div');
        item.className = 'scenario-item';

        const resultBadge = scenario.resultado === 'TOTAL' ? 'access-sim' :
                           scenario.resultado === 'NEGADO' ? 'access-nao' :
                           'access-parcial';

        const anomaliaFlag = scenario.anomalia ? '<span class="badge critical" style="margin-left: 10px;">ANOMALIA</span>' : '';

        const relevanciaClass = scenario.relevancia === 'CRÍTICA' ? 'critical' :
                               scenario.relevancia === 'ALTA' ? 'warning' :
                               scenario.relevancia === 'MÉDIA' ? 'info' : 'info';

        const relevanciaFlag = `<span class="badge ${relevanciaClass}" style="margin-left: 8px; font-size: 0.7rem;">${scenario.relevancia}</span>`;

        item.innerHTML = `
            <div class="scenario-header">
                <span>${scenario.id}. ${scenario.titulo} ${relevanciaFlag}</span>
                <span class="access-badge ${resultBadge}">${scenario.resultado}</span>
            </div>
            <div class="scenario-content">
                <div class="scenario-details">
                    <p><strong>Sigilo do Processo:</strong> ${scenario.sigiloProcesso}</p>
                    <p><strong>Sigilo dos Documentos:</strong> ${scenario.sigiloDocumentos}</p>
                    <p><strong>Procurador Vinculado:</strong> ${scenario.procurador ? 'Sim' : 'Não'}</p>
                    <p><strong>Entidade na Capa:</strong> ${scenario.entidade ? 'Sim' : 'Não'}</p>
                    <p><strong>Resultado:</strong> <span class="access-badge ${resultBadge}">${scenario.resultado}</span> ${anomaliaFlag}</p>
                    <p><strong>Descrição:</strong> ${scenario.descricao}</p>
                </div>
            </div>
        `;

        container.appendChild(item);
    });

    // Add click handlers for accordion
    const headers = document.querySelectorAll('.scenario-header');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isActive = header.classList.contains('active');

            // Close all
            document.querySelectorAll('.scenario-header').forEach(h => h.classList.remove('active'));
            document.querySelectorAll('.scenario-content').forEach(c => c.classList.remove('active'));

            // Open clicked if it wasn't active
            if (!isActive) {
                header.classList.add('active');
                content.classList.add('active');
            }
        });
    });
}

// ===========================
// UPDATE STATS
// ===========================
function updateStats() {
    // Stats section removed per user request
}

// ===========================
// SIDE MODAL (INSIGHTS & LEGEND)
// ===========================
function initSideModal() {
    const sideTab = document.getElementById('side-tab');
    const sideModal = document.getElementById('side-modal');
    const sideCloseBtn = document.getElementById('side-modal-close-btn');

    // Open modal when clicking the tab
    sideTab.addEventListener('click', () => {
        openSideModal();
    });

    // Close modal when clicking the close button
    sideCloseBtn.addEventListener('click', () => {
        closeSideModal();
    });

    // Close modal when clicking outside the content
    sideModal.addEventListener('click', (e) => {
        if (e.target === sideModal) {
            closeSideModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sideModal.classList.contains('active')) {
            closeSideModal();
        }
    });

    function openSideModal() {
        sideModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling

        // Re-initialize accordion for insights
        initInsightsAccordion();
    }

    function closeSideModal() {
        sideModal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

function updateSideModal(activeTab) {
    const sideTab = document.getElementById('side-tab');
    const sideTabText = document.getElementById('side-tab-text');
    const sideModalTitle = document.getElementById('side-modal-title');
    const sideModalBody = document.getElementById('side-modal-body');

    // Show/hide side tab based on current tab
    if (activeTab === 'matrix') {
        // Matrix tab - show Insights
        sideTab.classList.add('visible');
        sideTabText.textContent = 'Insights';
        sideModalTitle.innerHTML = '💡 Insights da Matriz de Acesso';

        // Load insights content
        const insightsTemplate = document.getElementById('insights-template');
        sideModalBody.innerHTML = insightsTemplate.innerHTML;

    } else if (activeTab === 'scenarios') {
        // Scenarios tab - show Legend
        sideTab.classList.add('visible');
        sideTabText.textContent = 'Legenda';
        sideModalTitle.innerHTML = '📋 Legenda das Identificações';

        // Load legend content
        const legendTemplate = document.getElementById('legend-template');
        sideModalBody.innerHTML = legendTemplate.innerHTML;

    } else {
        // Other tabs - hide side tab
        sideTab.classList.remove('visible');

        // Close modal if it's open
        const sideModal = document.getElementById('side-modal');
        if (sideModal.classList.contains('active')) {
            sideModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
}

function initInsightsAccordion() {
    const insightQuestions = document.querySelectorAll('#side-modal .insight-question');

    insightQuestions.forEach(question => {
        // Remove any existing listeners to prevent duplicates
        question.replaceWith(question.cloneNode(true));
    });

    // Re-select after cloning
    const newInsightQuestions = document.querySelectorAll('#side-modal .insight-question');

    newInsightQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isActive = question.classList.contains('active');

            // Close all insights
            document.querySelectorAll('#side-modal .insight-question').forEach(q => q.classList.remove('active'));
            document.querySelectorAll('#side-modal .insight-answer').forEach(a => a.classList.remove('active'));

            // Open clicked insight if it wasn't active
            if (!isActive) {
                question.classList.add('active');
                answer.classList.add('active');
            }
        });
    });
}