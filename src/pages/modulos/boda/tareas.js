import { Card } from '../../../components/Card.js';
import { InputField } from '../../../components/InputField.js';
import { Button } from '../../../components/Button.js';

let selectedIds = [];
let editingTaskId = null;

/**
 * Renderiza la interfaz del Checklist de la Boda.
 * 
 * @param {Object} state - Estado global
 * @returns {string} HTML de la vista
 */
export function render(state) {
  selectedIds = [];

  // Inicializar filtros si no existen
  if (!state.activeWeddingFilter) {
    state.activeWeddingFilter = 'all';
  }
  if (!state.activeWeddingCategoryFilter) {
    state.activeWeddingCategoryFilter = 'all';
  }

  const content = `
    <!-- Menú de Sub-Páginas del Módulo Boda -->
    <div class="flex border-b border-outline-variant/20 mb-8 gap-1 overflow-x-auto pb-1 custom-scrollbar">
      <a href="#/boda/tareas" class="px-5 py-2.5 rounded-t-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 bg-primary text-white">Checklist Boda</a>
      <a href="#/boda/viaje" class="px-5 py-2.5 rounded-t-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 text-outline hover:text-primary hover:bg-white/50">Preparación Viaje</a>
      <a href="#/boda/financiacion" class="px-5 py-2.5 rounded-t-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 text-outline hover:text-primary hover:bg-white/50">Presupuesto Boda</a>
    </div>

    <div class="mb-6 flex flex-col gap-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-3xl font-bold text-primary tracking-tight mb-2">Organizador de la Boda</h2>
          <p class="text-base text-outline">El gran día está planificado. Controlen sus tareas e invitados.</p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <button id="toggle-wedding-form-btn" class="bg-accent hover:bg-accent/90 text-white font-semibold text-xs px-5 py-2.5 rounded-full transition-all flex items-center gap-2 shrink-0 shadow-md focus:ring-0 focus:outline-none">
            <span class="material-symbols-outlined text-[16px]" id="wedding-form-btn-icon">add</span>
            <span id="wedding-form-btn-text">Nueva Tarea</span>
          </button>
        </div>
      </div>

      <!-- Barra de Filtros (Estado y Categorías) -->
      <div class="flex flex-col gap-3 bg-surface p-4 rounded-2xl border border-outline-variant/20 shadow-linen">
        <!-- Filtro de Estado -->
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-xs font-bold text-primary uppercase tracking-wider min-w-[80px]">Estado:</span>
          <div class="flex bg-outline-variant/20 p-1 rounded-full select-none flex-wrap">
            <button id="filter-wedding-all" class="px-4 py-1.5 ${state.activeWeddingFilter === 'all' ? 'bg-surface text-primary shadow-sm font-bold' : 'text-outline hover:text-primary'} rounded-full text-xs transition-all focus:ring-0 focus:outline-none">Todos</button>
            <button id="filter-wedding-pending" class="px-4 py-1.5 ${state.activeWeddingFilter === 'pending' ? 'bg-surface text-primary shadow-sm font-bold' : 'text-outline hover:text-primary'} rounded-full text-xs transition-all focus:ring-0 focus:outline-none">Pendientes</button>
            <button id="filter-wedding-completed" class="px-4 py-1.5 ${state.activeWeddingFilter === 'completed' ? 'bg-surface text-primary shadow-sm font-bold' : 'text-outline hover:text-primary'} rounded-full text-xs transition-all focus:ring-0 focus:outline-none">Completados</button>
          </div>
        </div>

        <!-- Filtro de Categorías -->
        <div class="flex items-center gap-2 flex-wrap border-t border-outline-variant/10 pt-3">
          <span class="text-xs font-bold text-primary uppercase tracking-wider min-w-[80px]">Categoría:</span>
          <div class="flex gap-1.5 overflow-x-auto pb-1 max-w-full custom-scrollbar flex-wrap" id="wedding-category-filters-container">
            <!-- Renderizado dinámicamente -->
          </div>
        </div>
      </div>
    </div>

    <!-- Formulario de creación arriba, ocupando el ancho completo -->
    <div id="add-wedding-form-container" class="hidden mb-8 w-full">
      ${Card({
        content: `
          <h3 class="text-lg font-bold text-primary mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined">playlist_add</span> Añadir nueva tarea de boda
          </h3>
          
          <form id="add-wedding-task-form" class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div class="md:col-span-2">
              ${InputField({ id: 'wedding-task-title', label: 'Descripción de la tarea', placeholder: 'Ej: Reservar menú o Comprar flores', required: true })}
            </div>
            <div>
              <label for="wedding-task-category" class="block text-xs font-bold text-primary uppercase tracking-wider mb-1">Categoría</label>
              <select id="wedding-task-category" class="w-full bg-background border-none rounded-xl px-4 py-3.5 text-sm focus:ring-0 focus:outline-none text-outline">
                <option value="Banquete">Banquete</option>
                <option value="Invitados">Invitados</option>
                <option value="Vestimenta">Vestimenta</option>
                <option value="Logística">Logística</option>
              </select>
            </div>
            <div>
              ${Button({ text: 'Añadir Tarea', icon: 'add', className: 'w-full py-3.5 text-sm focus:ring-0 focus:outline-none' })}
            </div>
          </form>
        `
      })}
    </div>

    <!-- Dashboard Boda Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Columna Checklist de Tareas completa -->
      <div class="lg:col-span-12">
        ${Card({
          content: `
            <div class="flex items-center justify-between mb-4 border-b border-outline-variant/20 pb-4">
              <span id="wedding-stats-text" class="text-sm font-bold text-primary">0 tareas en total</span>
              <div class="flex items-center gap-2.5">
                <!-- Botón de borrado múltiple discreto -->
                <button id="bulk-delete-wedding-btn" class="hidden bg-error/10 hover:bg-error/20 text-error border border-error/20 font-bold text-[10px] px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 shadow-sm select-none focus:ring-0 focus:outline-none">
                  <span class="material-symbols-outlined text-[14px]">delete_sweep</span>
                  <span>Eliminar (<span id="bulk-delete-wedding-count">0</span>)</span>
                </button>
                
                <button id="clear-wedding-completed-btn" class="text-xs text-error hover:underline font-bold flex items-center gap-1 select-none focus:ring-0 focus:outline-none">
                  <span class="material-symbols-outlined text-xs">delete</span> Limpiar completadas
                </button>
              </div>
            </div>
            
            <ul id="wedding-tasks-list" class="divide-y divide-outline-variant/10">
              <!-- Cargado en init() -->
            </ul>
          `
        })}
      </div>
    </div>
  `;

  return content;
}

/**
 * Agrega comportamiento e interactividad a la sección de Bodas usando la DB.
 * 
 * @param {Object} state - Estado global
 * @param {Object} db - Interfaz unificada de base de datos
 */
export function init(state, db) {
  // Asegurar filtros iniciales
  if (!state.activeWeddingFilter) state.activeWeddingFilter = 'all';
  if (!state.activeWeddingCategoryFilter) state.activeWeddingCategoryFilter = 'all';

  editingTaskId = null;

  const weddingCategories = ['Banquete', 'Invitados', 'Vestimenta', 'Logística'];

  const updateBulkDeleteButton = () => {
    const btn = document.getElementById('bulk-delete-wedding-btn');
    const countSpan = document.getElementById('bulk-delete-wedding-count');
    if (!btn || !countSpan) return;

    if (selectedIds.length > 0) {
      countSpan.innerText = selectedIds.length;
      btn.classList.remove('hidden');
    } else {
      btn.classList.add('hidden');
    }
  };

  const renderCategoryFilters = () => {
    const catContainer = document.getElementById('wedding-category-filters-container');
    if (!catContainer) return;

    catContainer.innerHTML = '';
    const activeCat = state.activeWeddingCategoryFilter || 'all';

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
      state.activeWeddingCategoryFilter = 'all';
      renderCategoryFilters();
      renderAll();
    });
    catContainer.appendChild(allBtn);

    // Botones por categoría
    weddingCategories.forEach(catName => {
      const btn = document.createElement('button');
      btn.className = `px-3.5 py-1.5 rounded-full text-xs font-bold transition-all focus:ring-0 focus:outline-none ${
        activeCat === catName
          ? 'bg-primary text-white shadow-sm'
          : 'bg-outline-variant/20 text-outline hover:text-primary hover:bg-outline-variant/30'
      }`;
      btn.innerText = catName;
      btn.addEventListener('click', (e) => {
        e.target.blur();
        state.activeWeddingCategoryFilter = catName;
        renderCategoryFilters();
        renderAll();
      });
      catContainer.appendChild(btn);
    });
  };

  const renderAll = () => {
    const listEl = document.getElementById('wedding-tasks-list');
    if (!listEl) return;

    listEl.innerHTML = '';

    // Filtrar tareas
    let filtered = state.weddingTasks;

    // 1. Filtrar por estado
    if (state.activeWeddingFilter === 'pending') {
      filtered = filtered.filter(t => !t.completed);
    } else if (state.activeWeddingFilter === 'completed') {
      filtered = filtered.filter(t => t.completed);
    }

    // 2. Filtrar por categoría
    const activeCatFilter = state.activeWeddingCategoryFilter || 'all';
    if (activeCatFilter !== 'all') {
      filtered = filtered.filter(t => t.category === activeCatFilter);
    }

    // Ordenar: pendientes primero
    const sorted = [...filtered].sort((a, b) => a.completed - b.completed);

    const totalCount = state.weddingTasks.length;
    const pendingCount = state.weddingTasks.filter(t => !t.completed).length;
    const statsEl = document.getElementById('wedding-stats-text');
    if (statsEl) {
      statsEl.innerText = `${pendingCount} pendiente${pendingCount !== 1 ? 's' : ''} de ${totalCount}`;
    }

    if (sorted.length === 0) {
      listEl.innerHTML = `<li class="text-sm text-outline italic py-8 text-center bg-background/30 rounded-xl">No hay tareas que coincidan con los filtros</li>`;
      updateBulkDeleteButton();
      return;
    }

    sorted.forEach(task => {
      const titleClass = task.completed ? 'line-through text-outline font-normal' : 'text-primary font-semibold';
      const li = document.createElement('li');
      li.className = 'flex items-center justify-between py-4 group border-b border-outline-variant/10 last:border-b-0';

      const isSelected = selectedIds.includes(task.id);
      const isEditing = editingTaskId === task.id;

      if (isEditing) {
        // MODO EDICIÓN INLINE (Igual que compras)
        const catOptions = weddingCategories.map(cat => 
          `<option value="${cat}" ${cat === task.category ? 'selected' : ''}>${cat}</option>`
        ).join('');

        li.innerHTML = `
          <div class="flex items-center gap-3 flex-1">
            <input type="checkbox" ${isSelected ? 'checked' : ''} data-select-id="${task.id}" id="wedding-select-${task.id}"
              class="select-delete-checkbox rounded border-outline-variant text-error focus:ring-0 focus:ring-offset-0 focus:outline-none w-4 h-4 cursor-pointer transition-all"/>
            
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-1">
              <input type="text" id="edit-wedding-title-${task.id}" value="${task.title}" 
                class="bg-background border border-outline-variant/30 rounded-lg px-2 py-1 text-xs text-outline focus:outline-none focus:ring-1 focus:ring-accent w-full sm:max-w-[280px]" required/>
              
              <select id="edit-wedding-cat-${task.id}" class="bg-background border border-outline-variant/30 rounded-lg px-2 py-1 text-xs text-outline focus:outline-none focus:ring-1 focus:ring-accent">
                ${catOptions}
              </select>

              <div class="flex items-center gap-1">
                <button class="save-task-btn text-accent hover:text-accent/80 p-1 focus:outline-none" data-id="${task.id}" title="Guardar">
                  <span class="material-symbols-outlined text-base">check</span>
                </button>
                <button class="cancel-task-btn text-outline hover:text-primary p-1 focus:outline-none" data-id="${task.id}" title="Cancelar">
                  <span class="material-symbols-outlined text-base">close</span>
                </button>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-3 shrink-0">
            <button class="delete-btn text-outline hover:text-error lg:opacity-0 lg:group-hover:opacity-100 focus:opacity-100 focus:ring-0 focus:outline-none transition-opacity p-1" aria-label="Eliminar tarea">
              <span class="material-symbols-outlined text-sm">delete</span>
            </button>
          </div>
        `;

        // Eventos Guardar y Cancelar
        li.querySelector('.save-task-btn').addEventListener('click', async (e) => {
          e.currentTarget.blur();
          const titleVal = li.querySelector(`#edit-wedding-title-${task.id}`).value.trim();
          const catVal = li.querySelector(`#edit-wedding-cat-${task.id}`).value;
          if (titleVal) {
            await db.updateWeddingTask(task.id, { title: titleVal, category: catVal });
            editingTaskId = null;
            renderAll();
          }
        });

        li.querySelector('.cancel-task-btn').addEventListener('click', (e) => {
          e.currentTarget.blur();
          editingTaskId = null;
          renderAll();
        });

        // Soporte teclado
        const inputs = li.querySelectorAll('input, select');
        inputs.forEach(input => {
          input.addEventListener('keydown', async (e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const titleVal = li.querySelector(`#edit-wedding-title-${task.id}`).value.trim();
              const catVal = li.querySelector(`#edit-wedding-cat-${task.id}`).value;
              if (titleVal) {
                await db.updateWeddingTask(task.id, { title: titleVal, category: catVal });
                editingTaskId = null;
                renderAll();
              }
            } else if (e.key === 'Escape') {
              editingTaskId = null;
              renderAll();
            }
          });
        });

      } else {
        // MODO LECTURA NORMAL (Clic en texto para editar)
        li.innerHTML = `
          <div class="flex items-center gap-4 flex-1">
            <!-- Checkbox selección borrado discreto -->
            <input type="checkbox" ${isSelected ? 'checked' : ''} data-select-id="${task.id}" id="wedding-select-${task.id}"
              class="select-delete-checkbox rounded border-outline-variant text-error focus:ring-0 focus:ring-offset-0 focus:outline-none w-4 h-4 cursor-pointer transition-all"/>
              
            <div class="flex items-center gap-4 flex-1">
              <input type="checkbox" ${task.completed ? 'checked' : ''} data-toggle-id="${task.id}" id="wedding-toggle-${task.id}"
                class="rounded-lg border-outline-variant text-accent focus:ring-0 focus:ring-offset-0 focus:outline-none w-5 h-5 transition-colors cursor-pointer checkbox-bounce"/>
              <div class="flex flex-col flex-1 cursor-pointer select-none task-clickable" data-id="${task.id}" title="Haga clic para editar">
                <span class="text-sm ${titleClass} hover:underline decoration-accent/40">${task.title}</span>
                <span class="text-[10px] text-outline mt-0.5 font-medium bg-background px-2 py-0.5 rounded-full w-max">${task.category}</span>
              </div>
            </div>
          </div>
          <button class="delete-btn text-outline hover:text-error lg:opacity-0 lg:group-hover:opacity-100 focus:opacity-100 focus:ring-0 focus:outline-none transition-opacity p-1" aria-label="Eliminar tarea">
            <span class="material-symbols-outlined text-sm">delete</span>
          </button>
        `;

        // Click en texto abre editor inline
        li.querySelector('.task-clickable').addEventListener('click', () => {
          editingTaskId = task.id;
          renderAll();
        });

        // Escuchar cambios completar
        li.querySelector(`input[data-toggle-id="${task.id}"]`).addEventListener('change', async (e) => {
          e.target.blur();
          const nextState = !task.completed;
          await db.toggleWeddingTask(task.id, nextState);
        });

        // Escuchar cambios selección borrado
        li.querySelector(`.select-delete-checkbox`).addEventListener('change', (e) => {
          e.target.blur();
          if (e.target.checked) {
            if (!selectedIds.includes(task.id)) selectedIds.push(task.id);
          } else {
            selectedIds = selectedIds.filter(id => id !== task.id);
          }
          updateBulkDeleteButton();
        });

        // Escuchar borrado individual
        li.querySelector('.delete-btn').addEventListener('click', async (e) => {
          e.target.blur();
          if (confirm(`¿Estás seguro de que deseas eliminar la tarea "${task.title}"?`)) {
            selectedIds = selectedIds.filter(id => id !== task.id);
            await db.deleteWeddingTask(task.id);
          }
        });
      }

      listEl.appendChild(li);
    });

    updateBulkDeleteButton();
  };

  // Configurar listeners de filtros de estado
  const setupFilterBtn = (id, filterValue) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.target.blur();
        state.activeWeddingFilter = filterValue;
        
        // Actualizar clases activas en UI
        ['all', 'pending', 'completed'].forEach(f => {
          const b = document.getElementById(`filter-wedding-${f}`);
          if (b) {
            if (f === filterValue) {
              b.className = 'px-4 py-1.5 bg-surface text-primary shadow-sm font-bold rounded-full text-xs transition-all focus:ring-0 focus:outline-none';
            } else {
              b.className = 'px-4 py-1.5 text-outline hover:text-primary rounded-full text-xs transition-all focus:ring-0 focus:outline-none';
            }
          }
        });
        
        renderAll();
      });
    }
  };

  setupFilterBtn('filter-wedding-all', 'all');
  setupFilterBtn('filter-wedding-pending', 'pending');
  setupFilterBtn('filter-wedding-completed', 'completed');

  // Limpiar completados
  const clearCompletedBtn = document.getElementById('clear-wedding-completed-btn');
  if (clearCompletedBtn) {
    clearCompletedBtn.addEventListener('click', async (e) => {
      e.target.blur();
      const completedIds = state.weddingTasks.filter(t => t.completed).map(t => t.id);
      if (completedIds.length === 0) return;
      if (confirm(`¿Estás seguro de que deseas eliminar las ${completedIds.length} tareas completadas?`)) {
        await db.deleteWeddingTasks(completedIds);
      }
    });
  }

  // Toggle del Formulario de Creación
  const toggleBtn = document.getElementById('toggle-wedding-form-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.target.blur();
      const formContainer = document.getElementById('add-wedding-form-container');
      const btnIcon = document.getElementById('wedding-form-btn-icon');
      const btnText = document.getElementById('wedding-form-btn-text');

      if (formContainer.classList.contains('hidden')) {
        formContainer.classList.remove('hidden');
        btnIcon.innerText = 'close';
        btnText.innerText = 'Cancelar';
      } else {
        formContainer.classList.add('hidden');
        btnIcon.innerText = 'add';
        btnText.innerText = 'Nueva Tarea';
      }
    });
  }

  // Borrado múltiple
  const bulkDeleteBtn = document.getElementById('bulk-delete-wedding-btn');
  if (bulkDeleteBtn) {
    bulkDeleteBtn.addEventListener('click', async (e) => {
      e.target.blur();
      if (selectedIds.length === 0) return;
      if (confirm(`¿Estás seguro de que deseas eliminar las ${selectedIds.length} tareas seleccionadas?`)) {
        const idsToRemove = [...selectedIds];
        selectedIds = [];
        await db.deleteWeddingTasks(idsToRemove);
      }
    });
  }

  // Enviar formulario para añadir tarea
  const form = document.getElementById('add-wedding-task-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const titleInput = document.getElementById('wedding-task-title');
      const catSelect = document.getElementById('wedding-task-category');

      await db.addWeddingTask(titleInput.value, catSelect.value);

      titleInput.value = '';
    });
  }

  renderCategoryFilters();
  renderAll();
}
