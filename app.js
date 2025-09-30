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
});

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
// MATRIX TABLE
// ===========================
function renderMatrix() {
    const sigiloFilter = document.getElementById('filter-sigilo').value;
    const accessFilter = document.getElementById('filter-access').value;
    const intimacaoFilter = document.getElementById('filter-intimacao').value;
    const vistaFilter = document.getElementById('filter-vista').value;
    const tbody = document.getElementById('matrix-body');
    const summaryDiv = document.getElementById('matrix-summary');

    let filteredData = rawData.filter(row => {
        // Filter by sigilo
        if (sigiloFilter !== 'all') {
            const sigilo = parseInt(sigiloFilter);
            if (row.sigiloProcesso !== sigilo && row.sigiloDocumento !== sigilo) return false;
        }

        // Filter by access
        if (accessFilter !== 'all') {
            if (row.visualizaDocumentos !== accessFilter) return false;
        }

        // Filter by intimacao
        if (intimacaoFilter !== 'all') {
            if (row.mpIntimado !== intimacaoFilter) return false;
        }

        // Filter by vista
        if (vistaFilter !== 'all') {
            if (row.vistaMP !== vistaFilter) return false;
        }

        return true;
    });

    // Update summary
    const totalFiltered = filteredData.length;
    const acessoTotal = filteredData.filter(r => r.visualizaDocumentos === 'SIM').length;
    const acessoParcial = filteredData.filter(r => r.visualizaDocumentos === 'PARCIALMENTE').length;
    const acessoNegado = filteredData.filter(r => r.visualizaDocumentos === 'NÃO').length;

    summaryDiv.innerHTML = `
        <div class="summary-item">
            <div class="summary-label">Total</div>
            <div class="summary-value">${totalFiltered}</div>
        </div>
        <div class="summary-item">
            <div class="summary-label">Acesso Total</div>
            <div class="summary-value" style="color: var(--success-color)">${acessoTotal}</div>
        </div>
        <div class="summary-item">
            <div class="summary-label">Acesso Parcial</div>
            <div class="summary-value" style="color: var(--warning-color)">${acessoParcial}</div>
        </div>
        <div class="summary-item">
            <div class="summary-label">Acesso Negado</div>
            <div class="summary-value" style="color: var(--danger-color)">${acessoNegado}</div>
        </div>
    `;

    tbody.innerHTML = '';

    filteredData.forEach(row => {
        const tr = document.createElement('tr');

        const accessClass = row.visualizaDocumentos === 'SIM' ? 'access-sim' :
                           row.visualizaDocumentos === 'NÃO' ? 'access-nao' :
                           'access-parcial';

        const accessText = row.visualizaDocumentos === 'SIM' ? 'Total' :
                          row.visualizaDocumentos === 'NÃO' ? 'Negado' :
                          'Parcial';

        // Tipo de acesso com formatação legível
        let tipoAcessoText = row.tipoAcesso || 'N/A';
        tipoAcessoText = tipoAcessoText.replace(/_/g, ' ').toLowerCase();
        tipoAcessoText = tipoAcessoText.charAt(0).toUpperCase() + tipoAcessoText.slice(1);

        // Highlight keywords in observations
        let highlightedObservations = row.comentarios || '<em style="color: var(--text-secondary)">—</em>';
        if (row.comentarios) {
            highlightedObservations = highlightKeywords(row.comentarios);
        }

        tr.innerHTML = `
            <td data-intimacao="${row.mpIntimado}">${row.mpIntimado === 'N/A' ? '<em style="color: var(--text-secondary)">—</em>' : row.mpIntimado}</td>
            <td data-vista="${row.vistaMP}">${row.vistaMP === 'N/A' ? '<em style="color: var(--text-secondary)">—</em>' : row.vistaMP}</td>
            <td data-vinculacao="${row.procuradorVinculado}">${row.procuradorVinculado}</td>
            <td data-sigilo="${row.sigiloProcesso}">${row.sigiloProcesso}</td>
            <td data-sigilo="${row.sigiloDocumento}">${row.sigiloDocumento}</td>
            <td style="font-size: 0.85rem;">${tipoAcessoText}</td>
            <td class="observacoes-cell" style="font-size: 0.9rem;">${highlightedObservations}</td>
        `;

        tbody.appendChild(tr);
    });

    if (filteredData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 30px; color: var(--text-secondary);">Nenhum resultado encontrado com os filtros selecionados</td></tr>';
        summaryDiv.innerHTML = '';
    }
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