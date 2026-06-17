import { Card } from '../../../components/Card.js';

let selectedIds = [];

/**
 * Renderiza la interfaz de listado y registro de transacciones.
 * 
 * @param {Object} state - Estado global
 * @returns {string} HTML de la vista
 */
export function render(state) {
  selectedIds = []; // Limpiar selección al renderizar de cero
  
  // Generar opciones de Cuentas
  const accountOptions = state.financesAccounts.map(acc => 
    `<option value="${acc.id}">${acc.name}</option>`
  ).join('');

  // Generar opciones de Categorías
  const categoryOptions = state.financesCategories.map(cat => 
    `<option value="${cat.id}" data-type="${cat.type}">${cat.name} (${cat.type === 'gasto' ? 'Gasto' : 'Ingreso'})</option>`
  ).join('');

  // Generar opciones de filtro
  const filterAccountOptions = state.financesAccounts.map(acc => 
    `<option value="${acc.id}" ${state.activeFinancesFilterAccount == acc.id ? 'selected' : ''}>${acc.name}</option>`
  ).join('');

  const filterCategoryOptions = state.financesCategories.map(cat => 
    `<option value="${cat.id}" ${state.activeFinancesFilterCategory == cat.id ? 'selected' : ''}>${cat.name}</option>`
  ).join('');

  const content = `
    <!-- Menú de Sub-Páginas del Módulo Finanzas -->
    <div class="flex border-b border-outline-variant/20 mb-8 gap-1 overflow-x-auto pb-1 custom-scrollbar">
      <a href="#/finanzas/resumen" class="px-5 py-2.5 rounded-t-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 text-outline hover:text-primary hover:bg-white/50">Resumen</a>
      <a href="#/finanzas/transacciones" class="px-5 py-2.5 rounded-t-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 bg-primary text-white">Transacciones</a>
      <a href="#/finanzas/ahorros" class="px-5 py-2.5 rounded-t-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 text-outline hover:text-primary hover:bg-white/50">Metas de Ahorro</a>
      <a href="#/finanzas/ajustes" class="px-5 py-2.5 rounded-t-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 text-outline hover:text-primary hover:bg-white/50">Ajustes</a>
    </div>

    <div class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-3xl font-bold text-primary tracking-tight mb-2">Transacciones</h2>
        <p class="text-base text-outline">Registren ingresos y gastos, y filtren su historial.</p>
      </div>

      <div class="flex items-center gap-3 self-start md:self-center">
        <!-- Borrado múltiple -->
        <button id="bulk-delete-trans-btn" class="hidden bg-error/10 hover:bg-error/20 text-error border border-error/20 font-bold text-xs px-4.5 py-3 rounded-full transition-all flex items-center gap-1.5 shadow-sm select-none">
          <span class="material-symbols-outlined text-[16px]">delete_sweep</span>
          <span>Eliminar Seleccionados (<span id="bulk-delete-trans-count">0</span>)</span>
        </button>

        <button id="toggle-trans-form-btn" class="bg-accent hover:bg-accent/90 text-white font-semibold text-xs px-5 py-3 rounded-full transition-all flex items-center gap-2 shrink-0 shadow-md">
          <span class="material-symbols-outlined text-[16px]" id="trans-form-btn-icon">add</span>
          <span id="trans-form-btn-text">Nueva Transacción</span>
        </button>
      </div>
    </div>

    <!-- Formulario de nueva transacción -->
    <div id="add-trans-form-container" class="hidden mb-8 w-full">
      ${Card({
        content: `
          <h3 class="text-sm font-bold text-primary mb-4 uppercase tracking-wider">Añadir Transacción</h3>
          <form id="add-trans-form" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <!-- Descripción -->
              <div class="md:col-span-2">
                <label class="text-[10px] font-bold text-outline uppercase block mb-1">Descripción</label>
                <input type="text" id="trans-desc" placeholder="Ej. Compra Mercadona, Nómina..." required
                  class="w-full bg-background border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent placeholder-outline/50"/>
              </div>
              
              <!-- Monto -->
              <div>
                <label class="text-[10px] font-bold text-outline uppercase block mb-1">Monto (€)</label>
                <input type="number" id="trans-amount" step="0.01" min="0.01" placeholder="0.00" required
                  class="w-full bg-background border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent placeholder-outline/50"/>
              </div>

              <!-- Tipo -->
              <div>
                <label class="text-[10px] font-bold text-outline uppercase block mb-1">Tipo</label>
                <select id="trans-type" class="w-full bg-background border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent text-outline">
                  <option value="gasto">Gasto</option>
                  <option value="ingreso">Ingreso</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <!-- Cuenta -->
              <div>
                <label class="text-[10px] font-bold text-outline uppercase block mb-1">Cuenta Bancaria</label>
                <select id="trans-account" class="w-full bg-background border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent text-outline">
                  ${accountOptions}
                </select>
              </div>

              <!-- Categoría -->
              <div>
                <label class="text-[10px] font-bold text-outline uppercase block mb-1">Categoría</label>
                <select id="trans-category" class="w-full bg-background border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent text-outline">
                  <option value="">-- Seleccionar --</option>
                  ${categoryOptions}
                </select>
              </div>

              <!-- Subcategoría -->
              <div>
                <label class="text-[10px] font-bold text-outline uppercase block mb-1">Subcategoría</label>
                <select id="trans-subcategory" disabled class="w-full bg-background border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent text-outline disabled:opacity-50">
                  <option value="">-- Elige categoría primero --</option>
                </select>
              </div>

              <!-- Pagador / Beneficiario -->
              <div>
                <label class="text-[10px] font-bold text-outline uppercase block mb-1">Quién aporta / recibe</label>
                <select id="trans-payer" class="w-full bg-background border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent text-outline">
                  <option value="50/50">Compartido (50/50)</option>
                  <option value="Isra">Isra</option>
                  <option value="Lidia">Lidia</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <!-- Fecha -->
              <div>
                <label class="text-[10px] font-bold text-outline uppercase block mb-1">Fecha</label>
                <input type="date" id="trans-date" required class="w-full bg-background border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent text-outline"/>
              </div>

              <div class="md:col-span-3 flex justify-end">
                <button type="submit" class="bg-primary hover:bg-primary-dark text-white font-semibold rounded-full transition-colors flex items-center justify-center gap-1.5 text-xs px-8 py-3.5">
                  <span class="material-symbols-outlined text-[16px]">add</span> Registrar Transacción
                </button>
              </div>
            </div>
          </form>
        `
      })}
    </div>

    <!-- Barra de Filtros y Búsqueda -->
    <div class="bg-white rounded-2xl p-5 border border-outline-variant/20 shadow-linen mb-8">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <!-- Buscador -->
        <div class="md:col-span-4 relative">
          <span class="material-symbols-outlined absolute left-4.5 top-1/2 -translate-y-1/2 text-outline/50 text-[18px]">search</span>
          <input type="text" id="search-trans-input" value="${state.activeFinancesSearchQuery || ''}" placeholder="Buscar descripción..."
            class="w-full bg-background border-none rounded-xl pl-11 pr-4 py-3 text-xs focus:ring-2 focus:ring-accent placeholder-outline/50 text-outline"/>
        </div>

        <!-- Filtro Cuenta -->
        <div class="md:col-span-3">
          <select id="filter-account" class="w-full bg-background border-none rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-accent text-outline">
            <option value="all" ${state.activeFinancesFilterAccount == 'all' ? 'selected' : ''}>Todas las cuentas</option>
            ${filterAccountOptions}
          </select>
        </div>

        <!-- Filtro Categoría -->
        <div class="md:col-span-3">
          <select id="filter-category" class="w-full bg-background border-none rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-accent text-outline">
            <option value="all" ${state.activeFinancesFilterCategory == 'all' ? 'selected' : ''}>Todas las categorías</option>
            ${filterCategoryOptions}
          </select>
        </div>

        <!-- Filtro Tipo -->
        <div class="md:col-span-2">
          <select id="filter-type" class="w-full bg-background border-none rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-accent text-outline">
            <option value="all" ${state.activeFinancesFilterType == 'all' ? 'selected' : ''}>Gasto/Ingreso</option>
            <option value="gasto" ${state.activeFinancesFilterType == 'gasto' ? 'selected' : ''}>Gastos</option>
            <option value="ingreso" ${state.activeFinancesFilterType == 'ingreso' ? 'selected' : ''}>Ingresos</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Listado de Transacciones -->
    ${Card({
      content: `
        <div class="flex items-center justify-between mb-4 border-b border-outline-variant/10 pb-3">
          <div class="flex items-center gap-3">
            <input type="checkbox" id="select-all-trans" class="rounded border-outline-variant text-error focus:ring-error w-4 h-4 cursor-pointer"/>
            <span class="text-[10px] font-bold text-outline uppercase tracking-wider">Seleccionar Todo</span>
          </div>
          <span class="text-[10px] font-bold text-outline uppercase tracking-wider" id="total-visible-trans">Cargando...</span>
        </div>
        <ul id="transactions-list" class="divide-y divide-outline-variant/10 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
          <!-- Cargado en init() -->
        </ul>
      `
    })}
  `;

  return content;
}

/**
 * Agrega la lógica interactiva del listado y formulario de transacciones.
 * 
 * @param {Object} state - Estado global
 * @param {Object} db - Interfaz de base de datos
 */
export function init(state, db) {
  // Inicializar fecha de hoy
  const formDateEl = document.getElementById('trans-date');
  if (formDateEl) {
    formDateEl.value = new Date().toISOString().split('T')[0];
  }

  // Toggle del formulario
  const toggleBtn = document.getElementById('toggle-trans-form-btn');
  const formContainer = document.getElementById('add-trans-form-container');
  const btnIcon = document.getElementById('trans-form-btn-icon');
  const btnText = document.getElementById('trans-form-btn-text');

  if (toggleBtn && formContainer) {
    toggleBtn.addEventListener('click', () => {
      const isHidden = formContainer.classList.contains('hidden');
      if (isHidden) {
        formContainer.classList.remove('hidden');
        btnIcon.innerText = 'close';
        btnText.innerText = 'Cerrar';
      } else {
        formContainer.classList.add('hidden');
        btnIcon.innerText = 'add';
        btnText.innerText = 'Nueva Transacción';
      }
    });
  }

  // Carga dinámica de subcategorías en el formulario
  const categorySelect = document.getElementById('trans-category');
  const subcategorySelect = document.getElementById('trans-subcategory');

  if (categorySelect && subcategorySelect) {
    categorySelect.addEventListener('change', (e) => {
      const catId = parseInt(e.target.value);
      if (!catId) {
        subcategorySelect.innerHTML = '<option value="">-- Elige categoría primero --</option>';
        subcategorySelect.disabled = true;
        return;
      }

      // Filtrar subcategorías
      const filtered = state.financesSubcategories.filter(s => s.categoryId === catId);
      subcategorySelect.disabled = false;

      if (filtered.length === 0) {
        subcategorySelect.innerHTML = '<option value="">Sin subcategorías</option>';
      } else {
        subcategorySelect.innerHTML = filtered.map(s => 
          `<option value="${s.id}">${s.name}</option>`
        ).join('');
      }
    });
  }

  // Formulario submit
  const form = document.getElementById('add-trans-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const desc = document.getElementById('trans-desc').value.trim();
      const amount = parseFloat(document.getElementById('trans-amount').value);
      const type = document.getElementById('trans-type').value;
      const accountId = parseInt(document.getElementById('trans-account').value);
      const categoryId = parseInt(document.getElementById('trans-category').value) || null;
      const subcategoryId = parseInt(subcategorySelect.value) || null;
      const payer = document.getElementById('trans-payer').value;
      const date = formDateEl.value;

      await db.addFinancesTransaction(accountId, categoryId, subcategoryId, type, desc, amount, payer, date);
      
      // Ocultar formulario
      form.reset();
      formContainer.classList.add('hidden');
      btnIcon.innerText = 'add';
      btnText.innerText = 'Nueva Transacción';
      formDateEl.value = new Date().toISOString().split('T')[0];
    });
  }

  // Filtrado y renderizado de lista de transacciones
  const listEl = document.getElementById('transactions-list');
  const bulkBtn = document.getElementById('bulk-delete-trans-btn');
  const bulkCountSpan = document.getElementById('bulk-delete-trans-count');
  const selectAllCheckbox = document.getElementById('select-all-trans');

  const updateBulkDeleteButton = () => {
    if (!bulkBtn || !bulkCountSpan) return;
    if (selectedIds.length > 0) {
      bulkCountSpan.innerText = selectedIds.length;
      bulkBtn.classList.remove('hidden');
    } else {
      bulkBtn.classList.add('hidden');
    }
  };

  const renderTransactionsList = () => {
    if (!listEl) return;
    listEl.innerHTML = '';

    // Filtrar transacciones
    let filteredTrans = [...state.financesTransactions];

    // Filtro buscador
    const query = (state.activeFinancesSearchQuery || '').toLowerCase().trim();
    if (query) {
      filteredTrans = filteredTrans.filter(t => t.desc.toLowerCase().includes(query));
    }

    // Filtro cuenta
    if (state.activeFinancesFilterAccount && state.activeFinancesFilterAccount !== 'all') {
      filteredTrans = filteredTrans.filter(t => t.accountId == state.activeFinancesFilterAccount);
    }

    // Filtro categoría
    if (state.activeFinancesFilterCategory && state.activeFinancesFilterCategory !== 'all') {
      filteredTrans = filteredTrans.filter(t => t.categoryId == state.activeFinancesFilterCategory);
    }

    // Filtro tipo
    if (state.activeFinancesFilterType && state.activeFinancesFilterType !== 'all') {
      filteredTrans = filteredTrans.filter(t => t.type === state.activeFinancesFilterType);
    }

    // Actualizar totalizador visible
    const totalCountEl = document.getElementById('total-visible-trans');
    if (totalCountEl) {
      totalCountEl.innerText = `${filteredTrans.length} transacciones`;
    }

    if (filteredTrans.length === 0) {
      listEl.innerHTML = `<li class="text-sm text-outline italic py-8 text-center bg-background/30 rounded-xl">No se encontraron transacciones</li>`;
      selectAllCheckbox.checked = false;
      updateBulkDeleteButton();
      return;
    }

    // Renderizar
    filteredTrans.forEach(trans => {
      const isSelected = selectedIds.includes(trans.id);
      
      const accountName = state.financesAccounts.find(a => a.id === trans.accountId)?.name || 'Cuenta Desconocida';
      const categoryName = state.financesCategories.find(c => c.id === trans.categoryId)?.name || 'Sin categoría';
      const subcategoryName = state.financesSubcategories.find(s => s.id === trans.subcategoryId)?.name || '';
      
      const isIncome = trans.type === 'ingreso';
      const amountColor = isIncome ? 'text-primary' : 'text-error';
      const amountPrefix = isIncome ? '+' : '-';
      const payerBg = trans.payer === 'Isra' ? 'bg-primary/10 text-primary' : (trans.payer === 'Lidia' ? 'bg-accent/10 text-accent' : 'bg-outline-variant/30 text-outline');
      
      const li = document.createElement('li');
      li.className = 'flex items-center justify-between py-3.5 group border-b border-outline-variant/10 last:border-b-0';
      li.innerHTML = `
        <div class="flex items-center gap-4 flex-1">
          <input type="checkbox" ${isSelected ? 'checked' : ''} data-select-id="${trans.id}"
            class="select-delete-checkbox rounded border-outline-variant text-error focus:ring-error w-4.5 h-4.5 cursor-pointer transition-all"/>

          <div class="flex items-center gap-3">
            <div class="px-2.5 py-1 rounded-lg text-[10px] font-bold ${payerBg}">
              ${trans.payer === '50/50' ? 'Compartido' : trans.payer}
            </div>
            <div>
              <p class="text-sm font-semibold text-primary">${trans.desc}</p>
              <div class="flex items-center gap-2 mt-0.5 text-[10px] text-outline">
                <span>${new Date(trans.date).toLocaleDateString('es-ES')}</span>
                <span>•</span>
                <span>${accountName}</span>
                <span>•</span>
                <span class="bg-background px-1.5 py-0.5 rounded text-[9px] font-bold text-accent">
                  ${categoryName}${subcategoryName ? ' / ' + subcategoryName : ''}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-sm font-bold ${amountColor}">${amountPrefix}€${trans.amount.toFixed(2)}</span>
          <button class="delete-btn text-outline hover:text-error lg:opacity-0 lg:group-hover:opacity-100 focus:opacity-100 transition-opacity p-1" aria-label="Eliminar transacción">
            <span class="material-symbols-outlined text-sm">delete</span>
          </button>
        </div>
      `;

      // Evento checkbox de selección
      li.querySelector('.select-delete-checkbox').addEventListener('change', (e) => {
        if (e.target.checked) {
          if (!selectedIds.includes(trans.id)) selectedIds.push(trans.id);
        } else {
          selectedIds = selectedIds.filter(id => id !== trans.id);
        }
        updateBulkDeleteButton();
      });

      // Evento eliminar individual
      li.querySelector('.delete-btn').addEventListener('click', async () => {
        if (confirm(`¿Eliminar transacción "${trans.desc}" por €${trans.amount.toFixed(2)}?`)) {
          selectedIds = selectedIds.filter(id => id !== trans.id);
          await db.deleteFinancesTransaction(trans.id);
        }
      });

      listEl.appendChild(li);
    });
  };

  // Escuchar inputs de búsqueda y filtros
  const searchInput = document.getElementById('search-trans-input');
  const accountSelect = document.getElementById('filter-account');
  const filterCatSelect = document.getElementById('filter-category');
  const typeSelect = document.getElementById('filter-type');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.activeFinancesSearchQuery = e.target.value;
      renderTransactionsList();
    });
  }

  if (accountSelect) {
    accountSelect.addEventListener('change', (e) => {
      state.activeFinancesFilterAccount = e.target.value;
      renderTransactionsList();
    });
  }

  if (filterCatSelect) {
    filterCatSelect.addEventListener('change', (e) => {
      state.activeFinancesFilterCategory = e.target.value;
      renderTransactionsList();
    });
  }

  if (typeSelect) {
    typeSelect.addEventListener('change', (e) => {
      state.activeFinancesFilterType = e.target.value;
      renderTransactionsList();
    });
  }

  // Evento seleccionar todo
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', (e) => {
      // Filtrar las transacciones visibles
      let visibleTrans = [...state.financesTransactions];
      const query = (state.activeFinancesSearchQuery || '').toLowerCase().trim();
      if (query) visibleTrans = visibleTrans.filter(t => t.desc.toLowerCase().includes(query));
      if (state.activeFinancesFilterAccount && state.activeFinancesFilterAccount !== 'all') visibleTrans = visibleTrans.filter(t => t.accountId == state.activeFinancesFilterAccount);
      if (state.activeFinancesFilterCategory && state.activeFinancesFilterCategory !== 'all') visibleTrans = visibleTrans.filter(t => t.categoryId == state.activeFinancesFilterCategory);
      if (state.activeFinancesFilterType && state.activeFinancesFilterType !== 'all') visibleTrans = visibleTrans.filter(t => t.type === state.activeFinancesFilterType);

      if (e.target.checked) {
        selectedIds = visibleTrans.map(t => t.id);
      } else {
        selectedIds = [];
      }
      
      // Renderizar de nuevo para refrescar los checkboxes de la lista
      renderTransactionsList();
      updateBulkDeleteButton();
    });
  }

  // Evento borrado múltiple
  if (bulkBtn) {
    bulkBtn.addEventListener('click', async () => {
      if (confirm(`¿Estás seguro de que deseas eliminar las ${selectedIds.length} transacciones seleccionadas?`)) {
        await db.deleteFinancesTransactions(selectedIds);
        selectedIds = [];
        selectAllCheckbox.checked = false;
      }
    });
  }

  // Render inicial
  renderTransactionsList();
}
