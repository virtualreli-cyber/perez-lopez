import { Card } from '../../../components/Card.js';
import { InputField } from '../../../components/InputField.js';
import { Button } from '../../../components/Button.js';

let selectedIds = [];
let editingItemId = null;

/**
 * Renderiza la interfaz de la Lista de la Compra.
 * 
 * @param {Object} state - Estado global
 * @returns {string} HTML de la vista
 */
export function render(state) {
  selectedIds = [];
  
  // Inicializar filtro de categorías si no existe
  if (!state.activeShoppingCategoryFilter) {
    state.activeShoppingCategoryFilter = 'all';
  }

  // Generar opciones de categoría dinámicas
  const categoryOptions = state.shoppingCategories && state.shoppingCategories.length > 0
    ? state.shoppingCategories.map(cat => `<option value="${cat.name}">${cat.name}</option>`).join('')
    : '<option value="Otros">Otros</option>';

  const content = `
    <div class="mb-6 flex flex-col gap-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-3xl font-bold text-primary tracking-tight mb-2">Lista de la Compra</h2>
          <p class="text-base text-outline">Añadan lo que necesiten comprar. Se sincroniza al instante.</p>
        </div>
        
        <div class="flex flex-wrap items-center gap-2">
          <button id="toggle-shop-form-btn" class="bg-accent hover:bg-accent/90 text-white font-semibold text-xs px-5 py-2.5 rounded-full transition-all flex items-center gap-2 shrink-0 shadow-md focus:ring-0 focus:outline-none">
            <span class="material-symbols-outlined text-[16px]" id="shop-form-btn-icon">add</span>
            <span id="shop-form-btn-text">Añadir Artículo</span>
          </button>
        </div>
      </div>

      <!-- Barra de Filtros (Estado y Categorías) -->
      <div class="flex flex-col gap-3 bg-surface p-4 rounded-2xl border border-outline-variant/20 shadow-linen">
        <!-- Filtro de Estado -->
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-xs font-bold text-primary uppercase tracking-wider min-w-[80px]">Estado:</span>
          <div class="flex bg-outline-variant/20 p-1 rounded-full select-none flex-wrap">
            <button id="filter-shop-all" class="px-4 py-1.5 ${state.activeShoppingFilter === 'all' ? 'bg-surface text-primary shadow-sm font-bold' : 'text-outline hover:text-primary'} rounded-full text-xs transition-all focus:ring-0 focus:outline-none">Todos</button>
            <button id="filter-shop-pending" class="px-4 py-1.5 ${state.activeShoppingFilter === 'pending' ? 'bg-surface text-primary shadow-sm font-bold' : 'text-outline hover:text-primary'} rounded-full text-xs transition-all focus:ring-0 focus:outline-none">Pendientes</button>
            <button id="filter-shop-completed" class="px-4 py-1.5 ${state.activeShoppingFilter === 'completed' ? 'bg-surface text-primary shadow-sm font-bold' : 'text-outline hover:text-primary'} rounded-full text-xs transition-all focus:ring-0 focus:outline-none">Completados</button>
          </div>
        </div>

        <!-- Filtro de Categorías -->
        <div class="flex items-center gap-2 flex-wrap border-t border-outline-variant/10 pt-3">
          <span class="text-xs font-bold text-primary uppercase tracking-wider min-w-[80px]">Categoría:</span>
          <div class="flex gap-1.5 overflow-x-auto pb-1 max-w-full custom-scrollbar flex-wrap" id="category-filters-container">
            <!-- Renderizado dinámicamente -->
          </div>
        </div>
      </div>
    </div>

    <!-- Formulario de creación arriba -->
    <div id="add-shop-form-container" class="hidden mb-8 w-full">
      ${Card({
        content: `
          <h3 class="text-lg font-bold text-primary mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined">add_circle</span> Añadir artículo a la lista
          </h3>
          
          <form id="add-shopping-form" class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div class="md:col-span-2">
              ${InputField({ id: 'shop-name', label: 'Nombre del producto', placeholder: 'Ej: Aguacates o Leche', required: true })}
            </div>
            <div>
              ${InputField({ id: 'shop-qty', label: 'Cantidad', type: 'number', value: 1, required: true })}
            </div>
            <div>
              <label for="shop-category" class="block text-xs font-bold text-primary uppercase tracking-wider mb-1">Categoría</label>
              <select id="shop-category" class="w-full bg-background border-none rounded-xl px-4 py-3.5 text-sm focus:ring-0 focus:outline-none text-outline">
                ${categoryOptions}
              </select>
            </div>
            <div class="md:col-span-4 flex justify-end">
              ${Button({ text: 'Agregar a la Lista', icon: 'add', className: 'px-8 py-3.5 text-sm focus:ring-0 focus:outline-none' })}
            </div>
          </form>
        `
      })}
    </div>

    <div class="w-full">
      <!-- Listado de Artículos -->
      ${Card({
        content: `
          <div class="flex items-center justify-between mb-4 border-b border-outline-variant/20 pb-4">
            <span id="shopping-stats-text" class="text-sm font-bold text-primary">0 artículos en total</span>
            <div class="flex items-center gap-2.5">
              <!-- Botón de borrado múltiple -->
              <button id="bulk-delete-shop-btn" class="hidden bg-error/10 hover:bg-error/20 text-error border border-error/20 font-bold text-[10px] px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 shadow-sm select-none focus:ring-0 focus:outline-none">
                <span class="material-symbols-outlined text-[14px]">delete_sweep</span>
                <span>Eliminar (<span id="bulk-delete-shop-count">0</span>)</span>
              </button>
              
              <button id="clear-completed-btn" class="text-xs text-error hover:underline font-bold flex items-center gap-1 select-none focus:ring-0 focus:outline-none">
                <span class="material-symbols-outlined text-xs">delete</span> Limpiar completados
              </button>
            </div>
          </div>

          <ul id="shopping-items-list" class="divide-y divide-outline-variant/10 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
            <!-- Cargado en init() -->
          </ul>
        `
      })}
    </div>
  `;

  return content;
}

/**
 * Agrega comportamiento e interactividad a la Lista de la Compra usando la DB.
 * 
 * @param {Object} state - Estado global
 * @param {Object} db - Interfaz unificada de base de datos
 */
export function init(state, db) {
  // Asegurar filtro inicial
  if (!state.activeShoppingCategoryFilter) {
    state.activeShoppingCategoryFilter = 'all';
  }

  // Limpiar modo edición al recargar página por navegación
  editingItemId = null;

  const updateBulkDeleteButton = () => {
    const btn = document.getElementById('bulk-delete-shop-btn');
    const countSpan = document.getElementById('bulk-delete-shop-count');
    if (!btn || !countSpan) return;

    if (selectedIds.length > 0) {
      countSpan.innerText = selectedIds.length;
      btn.classList.remove('hidden');
    } else {
      btn.classList.add('hidden');
    }
  };

  const renderCategoryFilters = () => {
    const catContainer = document.getElementById('category-filters-container');
    if (!catContainer) return;

    catContainer.innerHTML = '';
    const activeCat = state.activeShoppingCategoryFilter || 'all';

    // Botón "Todas"
    const allBtn = document.createElement('button');
    allBtn.className = `px-3.5 py-1.5 rounded-full text-xs font-bold transition-all focus:ring-0 focus:outline-none ${
      activeCat === 'all'
        ? 'bg-primary text-white shadow-sm'
        : 'bg-outline-variant/20 text-outline hover:text-primary hover:bg-outline-variant/30'
    }`;
    allBtn.innerText = 'Todas';
    allBtn.addEventListener('click', (e) => {
      e.target.blur();
      state.activeShoppingCategoryFilter = 'all';
      renderCategoryFilters();
      renderList();
    });
    catContainer.appendChild(allBtn);

    // Botones por categoría
    const categories = state.shoppingCategories || [];
    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = `px-3.5 py-1.5 rounded-full text-xs font-bold transition-all focus:ring-0 focus:outline-none ${
        activeCat === cat.name
          ? 'bg-primary text-white shadow-sm'
          : 'bg-outline-variant/20 text-outline hover:text-primary hover:bg-outline-variant/30'
      }`;
      btn.innerText = cat.name;
      btn.addEventListener('click', (e) => {
        e.target.blur();
        state.activeShoppingCategoryFilter = cat.name;
        renderCategoryFilters();
        renderList();
      });
      catContainer.appendChild(btn);
    });
  };

  const renderList = () => {
    const listEl = document.getElementById('shopping-items-list');
    if (!listEl) return;
    
    listEl.innerHTML = '';
    
    let filtered = state.shopping;
    
    // 1. Filtrar por estado (Todos/Pendientes/Completados)
    if (state.activeShoppingFilter === 'pending') filtered = state.shopping.filter(i => !i.completed);
    if (state.activeShoppingFilter === 'completed') filtered = state.shopping.filter(i => i.completed);

    // 2. Filtrar por categoría
    const activeCatFilter = state.activeShoppingCategoryFilter || 'all';
    if (activeCatFilter !== 'all') {
      filtered = filtered.filter(i => i.category === activeCatFilter);
    }

    const pendingCount = state.shopping.filter(i => !i.completed).length;
    const statsEl = document.getElementById('shopping-stats-text');
    if (statsEl) {
      statsEl.innerText = `${pendingCount} pendiente${pendingCount !== 1 ? 's' : ''} de ${state.shopping.length}`;
    }

    if (filtered.length === 0) {
      listEl.innerHTML = `<li class="text-sm text-outline italic py-8 text-center bg-background/30 rounded-xl">La lista está vacía</li>`;
      updateBulkDeleteButton();
      return;
    }

    filtered.forEach(item => {
      const itemClass = item.completed ? 'line-through text-outline' : 'text-primary font-semibold';
      const li = document.createElement('li');
      li.className = 'flex items-center justify-between py-3.5 group border-b border-outline-variant/10 last:border-b-0';
      
      const isSelected = selectedIds.includes(item.id);
      const isEditing = editingItemId === item.id;

      if (isEditing) {
        // Modo Edición Inline
        const catOptions = (state.shoppingCategories || []).map(cat => 
          `<option value="${cat.name}" ${cat.name === item.category ? 'selected' : ''}>${cat.name}</option>`
        ).join('');

        li.innerHTML = `
          <div class="flex items-center gap-3 flex-1">
            <input type="checkbox" ${isSelected ? 'checked' : ''} data-id="${item.id}" id="shop-select-${item.id}"
              class="select-delete-checkbox rounded border-outline-variant text-error focus:ring-0 focus:ring-offset-0 focus:outline-none w-4 h-4 cursor-pointer transition-all"/>
            
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-1">
              <input type="text" id="edit-shop-name-${item.id}" value="${item.name}" 
                class="bg-background border border-outline-variant/30 rounded-lg px-2 py-1 text-xs text-outline focus:outline-none focus:ring-1 focus:ring-accent w-full sm:max-w-[180px]" required/>
              
              <div class="flex items-center gap-1.5">
                <span class="text-xs text-outline font-medium">Cant:</span>
                <input type="number" id="edit-shop-qty-${item.id}" value="${item.qty}" 
                  class="bg-background border border-outline-variant/30 rounded-lg px-2 py-1 text-xs text-outline focus:outline-none focus:ring-1 focus:ring-accent w-12" min="1" required/>
              </div>

              <select id="edit-shop-cat-${item.id}" class="bg-background border border-outline-variant/30 rounded-lg px-2 py-1 text-xs text-outline focus:outline-none focus:ring-1 focus:ring-accent">
                ${catOptions}
              </select>

              <div class="flex items-center gap-1">
                <button class="save-item-btn text-accent hover:text-accent/80 p-1 focus:outline-none" data-id="${item.id}" title="Guardar">
                  <span class="material-symbols-outlined text-base">check</span>
                </button>
                <button class="cancel-item-btn text-outline hover:text-primary p-1 focus:outline-none" data-id="${item.id}" title="Cancelar">
                  <span class="material-symbols-outlined text-base">close</span>
                </button>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-3 shrink-0">
            <button class="delete-btn text-outline hover:text-error lg:opacity-0 lg:group-hover:opacity-100 focus:opacity-100 transition-opacity p-1 focus:outline-none focus:ring-0" aria-label="Eliminar artículo">
              <span class="material-symbols-outlined text-sm">delete</span>
            </button>
          </div>
        `;

        // Eventos Guardar y Cancelar
        li.querySelector('.save-item-btn').addEventListener('click', async (e) => {
          e.currentTarget.blur();
          const nameVal = li.querySelector(`#edit-shop-name-${item.id}`).value.trim();
          const qtyVal = parseInt(li.querySelector(`#edit-shop-qty-${item.id}`).value) || 1;
          const catVal = li.querySelector(`#edit-shop-cat-${item.id}`).value;
          
          if (nameVal) {
            await db.updateShoppingItem(item.id, { name: nameVal, qty: qtyVal, category: catVal });
            editingItemId = null;
            renderList();
          }
        });

        li.querySelector('.cancel-item-btn').addEventListener('click', (e) => {
          e.currentTarget.blur();
          editingItemId = null;
          renderList();
        });

        // Soporte teclado (Enter / Esc)
        const inputs = li.querySelectorAll('input, select');
        inputs.forEach(input => {
          input.addEventListener('keydown', async (e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const nameVal = li.querySelector(`#edit-shop-name-${item.id}`).value.trim();
              const qtyVal = parseInt(li.querySelector(`#edit-shop-qty-${item.id}`).value) || 1;
              const catVal = li.querySelector(`#edit-shop-cat-${item.id}`).value;
              if (nameVal) {
                await db.updateShoppingItem(item.id, { name: nameVal, qty: qtyVal, category: catVal });
                editingItemId = null;
                renderList();
              }
            } else if (e.key === 'Escape') {
              editingItemId = null;
              renderList();
            }
          });
        });

      } else {
        // Modo Lectura Normal
        li.innerHTML = `
          <div class="flex items-center gap-4 flex-1">
            <input type="checkbox" ${isSelected ? 'checked' : ''} data-id="${item.id}" id="shop-select-${item.id}"
              class="select-delete-checkbox rounded border-outline-variant text-error focus:ring-0 focus:ring-offset-0 focus:outline-none w-4 h-4 cursor-pointer transition-all"/>
            
            <div class="flex items-center gap-3 flex-1">
              <input type="checkbox" ${item.completed ? 'checked' : ''} data-toggle-id="${item.id}" id="shop-toggle-${item.id}"
                class="rounded-lg border-outline-variant text-accent focus:ring-0 focus:ring-offset-0 focus:outline-none w-5 h-5 transition-colors cursor-pointer checkbox-bounce"/>
              <div class="flex flex-col flex-1 cursor-pointer select-none item-clickable" data-id="${item.id}" title="Haga clic para editar">
                <span class="text-sm ${itemClass} hover:underline decoration-accent/40">${item.name}</span>
                <span class="text-[10px] text-outline mt-0.5 font-medium bg-background px-2 py-0.5 rounded-full w-max">${item.category}</span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-3 shrink-0">
            <span class="text-xs text-primary font-bold bg-background/60 border border-outline-variant/20 px-2.5 py-1 rounded-lg">x${item.qty}</span>
            <button class="delete-btn text-outline hover:text-error lg:opacity-0 lg:group-hover:opacity-100 focus:opacity-100 transition-opacity p-1 focus:outline-none focus:ring-0" aria-label="Eliminar artículo">
              <span class="material-symbols-outlined text-sm">delete</span>
            </button>
          </div>
        `;

        // Evento click en el texto del elemento para activar edición inline
        li.querySelector('.item-clickable').addEventListener('click', (e) => {
          editingItemId = item.id;
          renderList();
        });

        // Evento checkbox de completar
        const toggleChk = li.querySelector(`input[data-toggle-id="${item.id}"]`);
        toggleChk.addEventListener('change', async (e) => {
          e.target.blur();
          const nextState = !item.completed;
          await db.toggleShoppingItem(item.id, nextState);
        });
      }

      // Evento checkbox de selección de borrado
      const selectChk = li.querySelector(`.select-delete-checkbox`);
      selectChk.addEventListener('change', (e) => {
        e.target.blur();
        if (e.target.checked) {
          if (!selectedIds.includes(item.id)) selectedIds.push(item.id);
        } else {
          selectedIds = selectedIds.filter(id => id !== item.id);
        }
        updateBulkDeleteButton();
      });

      // Eliminar artículo individual
      li.querySelector('.delete-btn').addEventListener('click', async (e) => {
        e.currentTarget.blur();
        if (confirm(`¿Estás seguro de que deseas eliminar "${item.name}"?`)) {
          selectedIds = selectedIds.filter(id => id !== item.id);
          await db.deleteShoppingItem(item.id);
        }
      });

      listEl.appendChild(li);
    });

    updateBulkDeleteButton();
  };

  // Toggle del Formulario de Creación
  const toggleBtn = document.getElementById('toggle-shop-form-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.currentTarget.blur();
      const formContainer = document.getElementById('add-shop-form-container');
      const btnIcon = document.getElementById('shop-form-btn-icon');
      const btnText = document.getElementById('shop-form-btn-text');

      if (formContainer.classList.contains('hidden')) {
        formContainer.classList.remove('hidden');
        btnIcon.innerText = 'close';
        btnText.innerText = 'Cancelar';
      } else {
        formContainer.classList.add('hidden');
        btnIcon.innerText = 'add';
        btnText.innerText = 'Añadir Artículo';
      }
    });
  }

  // Borrado múltiple
  const bulkDeleteBtn = document.getElementById('bulk-delete-shop-btn');
  if (bulkDeleteBtn) {
    bulkDeleteBtn.addEventListener('click', async (e) => {
      e.currentTarget.blur();
      if (selectedIds.length === 0) return;
      if (confirm(`¿Estás seguro de que deseas eliminar los ${selectedIds.length} artículos seleccionados?`)) {
        const idsToRemove = [...selectedIds];
        selectedIds = [];
        await db.deleteShoppingItems(idsToRemove);
      }
    });
  }

  // Enviar formulario para añadir item
  const form = document.getElementById('add-shopping-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('shop-name');
      const qtyInput = document.getElementById('shop-qty');
      const catSelect = document.getElementById('shop-category');

      // Blur the active element to prevent outlines
      if (document.activeElement) {
        document.activeElement.blur();
      }

      await db.addShoppingItem(nameInput.value, parseInt(qtyInput.value), catSelect.value);

      nameInput.value = '';
      qtyInput.value = 1;
    });
  }

  // Limpiar completados
  const clearBtn = document.getElementById('clear-completed-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', async (e) => {
      e.currentTarget.blur();
      if (confirm('¿Estás seguro de que deseas limpiar todos los artículos completados?')) {
        await db.clearCompletedShopping();
      }
    });
  }

  // Controladores de Filtros de Estado
  ['all', 'pending', 'completed'].forEach(filterType => {
    const btn = document.getElementById(`filter-shop-${filterType}`);
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.target.blur();
        state.activeShoppingFilter = filterType;
        
        ['all', 'pending', 'completed'].forEach(t => {
          const b = document.getElementById(`filter-shop-${t}`);
          if (b) {
            b.className = t === filterType
              ? "px-4 py-1.5 bg-surface text-primary shadow-sm font-bold rounded-full text-xs transition-all focus:ring-0 focus:outline-none"
              : "px-4 py-1.5 text-outline hover:text-primary rounded-full text-xs transition-all focus:ring-0 focus:outline-none";
          }
        });
        
        renderList();
      });
    }
  });

  // Cargar filtros de categorías
  renderCategoryFilters();

  renderList();
}
