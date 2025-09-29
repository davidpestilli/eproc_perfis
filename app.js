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
        });
    });
}

// ===========================
// FILTERS
// ===========================
function initFilters() {
    const sigiloFilter = document.getElementById('filter-sigilo');
    const accessFilter = document.getElementById('filter-access');
    const intimacaoFilter = document.getElementById('filter-intimacao');
    const vistaFilter = document.getElementById('filter-vista');
    const peticionaFilter = document.getElementById('filter-peticiona');

    sigiloFilter.addEventListener('change', () => renderMatrix());
    accessFilter.addEventListener('change', () => renderMatrix());
    intimacaoFilter.addEventListener('change', () => renderMatrix());
    vistaFilter.addEventListener('change', () => renderMatrix());
    peticionaFilter.addEventListener('change', () => renderMatrix());
}

// ===========================
// MATRIX TABLE
// ===========================
function renderMatrix() {
    const sigiloFilter = document.getElementById('filter-sigilo').value;
    const accessFilter = document.getElementById('filter-access').value;
    const intimacaoFilter = document.getElementById('filter-intimacao').value;
    const vistaFilter = document.getElementById('filter-vista').value;
    const peticionaFilter = document.getElementById('filter-peticiona').value;
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

        // Filter by peticiona
        if (peticionaFilter !== 'all') {
            if (row.peticiona !== peticionaFilter) return false;
        }

        return true;
    });

    // Update summary
    const totalFiltered = filteredData.length;
    const acessoTotal = filteredData.filter(r => r.visualizaDocumentos === 'SIM').length;
    const acessoParcial = filteredData.filter(r => r.visualizaDocumentos === 'PARCIALMENTE').length;
    const acessoNegado = filteredData.filter(r => r.visualizaDocumentos === 'NÃO').length;
    const podePeticionar = filteredData.filter(r => r.peticiona === 'SIM').length;

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
        <div class="summary-item">
            <div class="summary-label">Pode Peticionar</div>
            <div class="summary-value" style="color: var(--info-color)">${podePeticionar}</div>
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

        // Badge para peticiona
        const peticionaBadge = row.peticiona === 'SIM'
            ? '<span class="access-badge access-sim" style="font-size: 0.75rem; padding: 4px 8px;">✓</span>'
            : row.peticiona === 'NÃO'
            ? '<span class="access-badge access-nao" style="font-size: 0.75rem; padding: 4px 8px;">✗</span>'
            : '<span style="color: var(--text-secondary)">—</span>';

        // Formatação de localidade/rito com badge
        let localidadeRitoBadge = '';
        if (row.localidadeRito === 'N/A') {
            localidadeRitoBadge = '<span style="color: var(--text-secondary)">—</span>';
        } else if (row.localidadeRito === 'Ambos') {
            localidadeRitoBadge = '<span class="loc-rito-badge loc-rito-ambos">✓✓</span>';
        } else if (row.localidadeRito === 'Apenas Loc.') {
            localidadeRitoBadge = '<span class="loc-rito-badge loc-rito-parcial">Loc.</span>';
        } else if (row.localidadeRito === 'Apenas Rito') {
            localidadeRitoBadge = '<span class="loc-rito-badge loc-rito-parcial">Rito</span>';
        } else if (row.localidadeRito === 'Nenhum') {
            localidadeRitoBadge = '<span class="loc-rito-badge loc-rito-nenhum">✗✗</span>';
        }

        tr.innerHTML = `
            <td data-intimacao="${row.mpIntimado}">${row.mpIntimado === 'N/A' ? '<em style="color: var(--text-secondary)">—</em>' : row.mpIntimado}</td>
            <td data-vista="${row.vistaMP}">${row.vistaMP === 'N/A' ? '<em style="color: var(--text-secondary)">—</em>' : row.vistaMP}</td>
            <td data-vinculacao="${row.procuradorVinculado}">${row.procuradorVinculado}</td>
            <td style="text-align: center;">${localidadeRitoBadge}</td>
            <td data-sigilo="${row.sigiloProcesso}">${row.sigiloProcesso}</td>
            <td data-sigilo="${row.sigiloDocumento}">${row.sigiloDocumento}</td>
            <td style="font-size: 0.85rem;">${tipoAcessoText}</td>
            <td style="text-align: center;">${peticionaBadge}</td>
            <td style="font-size: 0.9rem;">${row.comentarios || '<em style="color: var(--text-secondary)">—</em>'}</td>
        `;

        tbody.appendChild(tr);
    });

    if (filteredData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 30px; color: var(--text-secondary);">Nenhum resultado encontrado com os filtros selecionados</td></tr>';
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

        item.innerHTML = `
            <div class="scenario-header">
                <span>${scenario.id}. ${scenario.titulo}</span>
                <span class="access-badge ${resultBadge}">${scenario.resultado}</span>
            </div>
            <div class="scenario-content">
                <div class="scenario-details">
                    <p><strong>Sigilo do Processo:</strong> ${scenario.sigiloProcesso}</p>
                    <p><strong>Sigilo dos Documentos:</strong> ${scenario.sigiloDocumentos}</p>
                    <p><strong>Procurador Atuante:</strong> ${scenario.procurador ? 'Sim' : 'Não'}</p>
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