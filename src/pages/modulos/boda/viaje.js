import { Card } from '../../../components/Card.js';
import { InputField } from '../../../components/InputField.js';
import { Button } from '../../../components/Button.js';

let selectedIds = [];
let editingTaskId = null;

let tripCategories = [
  'Papeleo y Burocracia',
  'Maleta: Sri Lanka',
  'Maleta: Maldivas',
  'Neceser y Botiquín',
  'Electrónica y Varios',
  'Cuenta Atrás (Últimas 96h)'
];

/**
 * Renderiza la interfaz de Preparación del Viaje e Itinerario de la Luna de Miel.
 * 
 * @param {Object} state - Estado global
 * @returns {string} HTML de la vista
 */
export function render(state) {
  selectedIds = [];

  tripCategories = state.tripCategories || [
    'Papeleo y Burocracia',
    'Maleta: Sri Lanka',
    'Maleta: Maldivas',
    'Neceser y Botiquín',
    'Electrónica y Varios',
    'Cuenta Atrás (Últimas 96h)'
  ];
  
  // Inicializar filtros si no existen
  if (!state.activeTripFilter) {
    state.activeTripFilter = 'all';
  }
  if (!state.activeTripCategoryFilter) {
    state.activeTripCategoryFilter = 'all';
  }

  const categoryOptions = tripCategories.map(cat => `<option value="${cat}">${cat}</option>`).join('');

  const content = `
    <!-- Menú de Sub-Páginas del Módulo Boda -->
    <div class="flex border-b border-outline-variant/20 mb-8 gap-1 overflow-x-auto pb-1 custom-scrollbar">
      <a href="#/boda/tareas" class="px-5 py-2.5 rounded-t-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 text-outline hover:text-primary hover:bg-white/50">Checklist Boda</a>
      <a href="#/boda/viaje" class="px-5 py-2.5 rounded-t-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 bg-primary text-white">Preparación Viaje</a>
      <a href="#/boda/financiacion" class="px-5 py-2.5 rounded-t-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 text-outline hover:text-primary hover:bg-white/50">Presupuesto Boda</a>
      <a href="#/boda/excel" class="px-5 py-2.5 rounded-t-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 text-outline hover:text-primary hover:bg-white/50">Tabla Excel</a>
    </div>

    <!-- Cabecera con Cuenta Atrás Elegante (no botón) -->
    <div class="mb-6 flex flex-col gap-2">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-3xl font-bold text-primary tracking-tight mb-1">Preparación del Viaje</h2>
          <p id="trip-days-text" class="text-base font-bold text-accent flex items-center gap-1">
            <span class="material-symbols-outlined text-[20px]">flight_takeoff</span>
            <span>Cargando cuenta atrás...</span>
          </p>
        </div>
      </div>
      <p class="text-base text-outline">Nuestra luna de miel soñada en Sri Lanka y Maldivas. Salida: 16 de agosto de 2026.</p>
    </div>

    <!-- Estructura del Checklist Principal (Ancho Completo, igual que tareas y compras) -->
    <div class="mb-6 flex flex-col gap-4">
      <div class="flex justify-start items-center gap-2">
        <button id="toggle-trip-form-btn" class="bg-accent hover:bg-accent/90 text-white font-semibold text-xs px-5 py-2.5 rounded-full transition-all flex items-center gap-2 shrink-0 shadow-md focus:ring-0 focus:outline-none">
          <span class="material-symbols-outlined text-[16px]" id="trip-form-btn-icon">add</span>
          <span id="trip-form-btn-text">Nueva Tarea</span>
        </button>
      </div>

      <!-- Barra de Filtros (Estado y Categorías) -->
      <div class="flex flex-col gap-3 bg-surface p-4 rounded-2xl border border-outline-variant/20 shadow-linen">
        <!-- Filtro de Estado -->
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-xs font-bold text-primary uppercase tracking-wider min-w-[80px]">Estado:</span>
          <div class="flex bg-outline-variant/20 p-1 rounded-full select-none flex-wrap">
            <button id="filter-trip-all" class="px-4 py-1.5 ${state.activeTripFilter === 'all' ? 'bg-surface text-primary shadow-sm font-bold' : 'text-outline hover:text-primary'} rounded-full text-xs transition-all focus:ring-0 focus:outline-none">Todos</button>
            <button id="filter-trip-pending" class="px-4 py-1.5 ${state.activeTripFilter === 'pending' ? 'bg-surface text-primary shadow-sm font-bold' : 'text-outline hover:text-primary'} rounded-full text-xs transition-all focus:ring-0 focus:outline-none">Pendientes</button>
            <button id="filter-trip-completed" class="px-4 py-1.5 ${state.activeTripFilter === 'completed' ? 'bg-surface text-primary shadow-sm font-bold' : 'text-outline hover:text-primary'} rounded-full text-xs transition-all focus:ring-0 focus:outline-none">Completados</button>
          </div>
        </div>

        <!-- Filtro de Categorías -->
        <div class="flex items-center gap-2 flex-wrap border-t border-outline-variant/10 pt-3">
          <span class="text-xs font-bold text-primary uppercase tracking-wider min-w-[80px]">Categoría:</span>
          <div class="flex gap-1.5 overflow-x-auto pb-1 max-w-full custom-scrollbar flex-wrap" id="trip-category-filters-container">
            <!-- Renderizado dinámicamente -->
          </div>
        </div>
      </div>
    </div>

    <!-- Formulario de creación arriba, ocupando el ancho completo -->
    <div id="add-trip-form-container" class="hidden mb-8 w-full">
      ${Card({
        content: `
          <h3 class="text-lg font-bold text-primary mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined">playlist_add</span> Añadir nueva tarea de viaje
          </h3>
          
          <form id="add-trip-task-form" class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div class="md:col-span-2">
              ${InputField({ id: 'trip-task-title-input', label: 'Descripción de la tarea', placeholder: 'Ej: Solicitar visado, vacunas o cambiar moneda', required: true })}
            </div>
            <div>
              <label for="trip-task-category-input" class="block text-xs font-bold text-primary uppercase tracking-wider mb-1">Categoría</label>
              <select id="trip-task-category-input" class="w-full bg-background border-none rounded-xl px-4 py-3.5 text-sm focus:ring-0 focus:outline-none text-outline">
                \${categoryOptions}
              </select>
            </div>
            <div>
              ${Button({ text: 'Añadir Tarea', icon: 'add', className: 'w-full py-3.5 text-sm focus:ring-0 focus:outline-none' })}
            </div>
          </form>
        `
      })}
    </div>

    <!-- Card de la Lista del Checklist -->
    <div class="mb-8">
      ${Card({
        content: `
          <div class="flex items-center justify-between mb-4 border-b border-outline-variant/20 pb-4">
            <span id="trip-stats-text" class="text-sm font-bold text-primary">0 tareas en total</span>
            <div class="flex items-center gap-2.5">
              <!-- Botón de borrado múltiple discreto -->
              <button id="bulk-delete-trip-btn" class="hidden bg-error/10 hover:bg-error/20 text-error border border-error/20 font-bold text-[10px] px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 shadow-sm select-none focus:ring-0 focus:outline-none">
                <span class="material-symbols-outlined text-[14px]">delete_sweep</span>
                <span>Eliminar (<span id="bulk-delete-trip-count">0</span>)</span>
              </button>
              
              <button id="clear-trip-completed-btn" class="text-xs text-error hover:underline font-bold flex items-center gap-1 select-none focus:ring-0 focus:outline-none">
                <span class="material-symbols-outlined text-xs">delete</span> Limpiar completadas
              </button>
            </div>
          </div>
          
          <ul id="trip-triptasks-list" class="divide-y divide-outline-variant/10">
            <!-- Se renderiza en init() -->
          </ul>
        `
      })}
    </div>

    <!-- Contenido Adicional (Itinerario e Información Clave) debajo de la Lista -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-10">
      
      <!-- Itinerario Planificado (col-span-7) -->
      <div class="lg:col-span-7">
        ${Card({
          content: `
            <h3 class="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <span class="material-symbols-outlined">map</span> Itinerario Planificado
            </h3>
            
            <div class="space-y-6 relative before:absolute before:inset-y-2 before:left-[17px] before:w-[2px] before:bg-outline-variant/30">
              
              <!-- Parada 1 -->
              <div class="flex gap-4 relative">
                <div class="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0 z-10 shadow-sm">1</div>
                <div>
                  <span class="text-[10px] text-accent font-bold uppercase tracking-wider block">Día 1 - 16 de Agosto</span>
                  <h4 class="text-sm font-bold text-primary mt-0.5">Vuelo de Salida a Colombo (Sri Lanka)</h4>
                  <p class="text-xs text-outline mt-1">Noche de salida en vuelo internacional. ¡Comienza la gran aventura!</p>
                </div>
              </div>

              <!-- Parada 2 -->
              <div class="flex gap-4 relative">
                <div class="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0 z-10 shadow-sm">2</div>
                <div>
                  <span class="text-[10px] text-accent font-bold uppercase tracking-wider block">Días 2 al 8</span>
                  <h4 class="text-sm font-bold text-primary mt-0.5">Explorando Sri Lanka (Triángulo Cultural)</h4>
                  <p class="text-xs text-outline mt-1">Visitas a templos antiguos de Sigiriya y Polonnaruwa, safari en Parque Nacional Minneriya, y tren panorámico por las tierras del té de Ella.</p>
                </div>
              </div>

              <!-- Parada 3 -->
              <div class="flex gap-4 relative">
                <div class="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0 z-10 shadow-sm">3</div>
                <div>
                  <span class="text-[10px] text-accent font-bold uppercase tracking-wider block">Días 9 al 14</span>
                  <h4 class="text-sm font-bold text-primary mt-0.5">Paraíso de Maldivas (Resort Todo Incluido)</h4>
                  <p class="text-xs text-outline mt-1">Relax absoluto en cabaña sobre el agua, buceo con mantarrayas y tiburones ballena, y puestas de sol mágicas en el Océano Índico.</p>
                </div>
              </div>

            </div>
          `
        })}
      </div>

      <!-- Información Destinos (col-span-5) -->
      <div class="lg:col-span-5">
        ${Card({
          content: `
            <h3 class="text-sm font-bold text-primary mb-3 uppercase tracking-wider flex items-center gap-1.5">
              <span class="material-symbols-outlined text-sm">info</span> Datos del Destino
            </h3>
            <div class="space-y-4">
              <div>
                <h4 class="text-xs font-bold text-primary">Sri Lanka</h4>
                <p class="text-xs text-outline mt-0.5">Moneda: Rupia de Sri Lanka (LKR).</p>
                <p class="text-xs text-outline">Clima: Tropical cálido, ropa ligera y protección solar.</p>
              </div>
              <div class="border-t border-outline-variant/10 pt-3">
                <h4 class="text-xs font-bold text-primary">Maldivas</h4>
                <p class="text-xs text-outline mt-0.5">Moneda: Rufiyaa (MVR). Dólares aceptados.</p>
                <p class="text-xs text-outline">Sanidad: Requiere rellenar la declaración IMUGA (96 horas antes).</p>
              </div>
            </div>
          `
        })}
      </div>

    </div>
  `;

  return content;
}

/**
 * Agrega interactividad a la página de Viaje.
 * 
 * @param {Object} state - Estado global
 * @param {Object} db - Interfaz unificada de base de datos
 */
export function init(state, db) {
  // Asegurar filtros iniciales
  if (!state.activeTripFilter) state.activeTripFilter = 'all';
  if (!state.activeTripCategoryFilter) state.activeTripCategoryFilter = 'all';

  editingTaskId = null;
  tripCategories = state.tripCategories || [
    'Papeleo y Burocracia',
    'Maleta: Sri Lanka',
    'Maleta: Maldivas',
    'Neceser y Botiquín',
    'Electrónica y Varios',
    'Cuenta Atrás (Últimas 96h)'
  ];

  const updateBulkDeleteButton = () => {
    const btn = document.getElementById('bulk-delete-trip-btn');
    const countSpan = document.getElementById('bulk-delete-trip-count');
    if (!btn || !countSpan) return;

    if (selectedIds.length > 0) {
      countSpan.innerText = selectedIds.length;
      btn.classList.remove('hidden');
    } else {
      btn.classList.add('hidden');
    }
  };

  const renderCategoryFilters = () => {
    const catContainer = document.getElementById('trip-category-filters-container');
    if (!catContainer) return;

    catContainer.innerHTML = '';
    const activeCat = state.activeTripCategoryFilter || 'all';

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
      state.activeTripCategoryFilter = 'all';
      renderCategoryFilters();
      renderTasks();
    });
    catContainer.appendChild(allBtn);

    // Botones por categoría
    tripCategories.forEach(catName => {
      const btn = document.createElement('button');
      btn.className = `px-3.5 py-1.5 rounded-full text-xs font-bold transition-all focus:ring-0 focus:outline-none ${
        activeCat === catName
          ? 'bg-primary text-white shadow-sm'
          : 'bg-outline-variant/20 text-outline hover:text-primary hover:bg-outline-variant/30'
      }`;
      btn.innerText = catName;
      btn.addEventListener('click', (e) => {
        e.target.blur();
        state.activeTripCategoryFilter = catName;
        renderCategoryFilters();
        renderTasks();
      });
      catContainer.appendChild(btn);
    });
  };

  const renderTasks = () => {
    const listEl = document.getElementById('trip-triptasks-list');
    if (!listEl) return;

    listEl.innerHTML = '';

    // Filtrar tareas
    let filtered = state.tripTasks;

    // 1. Filtrar por estado
    if (state.activeTripFilter === 'pending') {
      filtered = filtered.filter(t => !t.completed);
    } else if (state.activeTripFilter === 'completed') {
      filtered = filtered.filter(t => t.completed);
    }

    // 2. Filtrar por categoría
    const activeCatFilter = state.activeTripCategoryFilter || 'all';
    if (activeCatFilter !== 'all') {
      filtered = filtered.filter(t => t.category === activeCatFilter);
    }

    // Ordenar: pendientes primero
    const sorted = [...filtered].sort((a, b) => a.completed - b.completed);

    const totalCount = state.tripTasks.length;
    const pendingCount = state.tripTasks.filter(t => !t.completed).length;
    const statsEl = document.getElementById('trip-stats-text');
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
        const catOptions = tripCategories.map(cat => 
          `<option value="${cat}" ${cat === task.category ? 'selected' : ''}>${cat}</option>`
        ).join('');

        li.innerHTML = `
          <div class="flex items-center gap-3 flex-1">
            <input type="checkbox" ${isSelected ? 'checked' : ''} data-select-id="${task.id}" id="trip-select-${task.id}"
              class="select-delete-checkbox rounded border-outline-variant text-error focus:ring-0 focus:ring-offset-0 focus:outline-none w-4 h-4 cursor-pointer transition-all"/>
            
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-1">
              <input type="text" id="edit-trip-title-${task.id}" value="${task.title}" 
                class="bg-background border border-outline-variant/30 rounded-lg px-2 py-1 text-xs text-outline focus:outline-none focus:ring-1 focus:ring-accent w-full sm:max-w-[280px]" required/>
              
              <select id="edit-trip-cat-${task.id}" class="bg-background border border-outline-variant/30 rounded-lg px-2 py-1 text-xs text-outline focus:outline-none focus:ring-1 focus:ring-accent">
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
            <button class="delete-triptask-btn text-outline hover:text-error lg:opacity-0 lg:group-hover:opacity-100 focus:opacity-100 focus:ring-0 focus:outline-none transition-opacity p-1" aria-label="Eliminar tarea">
              <span class="material-symbols-outlined text-sm">delete</span>
            </button>
          </div>
        `;

        // Eventos Guardar y Cancelar
        li.querySelector('.save-task-btn').addEventListener('click', async (e) => {
          e.currentTarget.blur();
          const titleVal = li.querySelector(`#edit-trip-title-${task.id}`).value.trim();
          const catVal = li.querySelector(`#edit-trip-cat-${task.id}`).value;
          if (titleVal) {
            await db.updateTripTask(task.id, { title: titleVal, category: catVal });
            editingTaskId = null;
            renderTasks();
          }
        });

        li.querySelector('.cancel-task-btn').addEventListener('click', (e) => {
          e.currentTarget.blur();
          editingTaskId = null;
          renderTasks();
        });

        // Soporte teclado
        const inputs = li.querySelectorAll('input, select');
        inputs.forEach(input => {
          input.addEventListener('keydown', async (e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const titleVal = li.querySelector(`#edit-trip-title-${task.id}`).value.trim();
              const catVal = li.querySelector(`#edit-trip-cat-${task.id}`).value;
              if (titleVal) {
                await db.updateTripTask(task.id, { title: titleVal, category: catVal });
                editingTaskId = null;
                renderTasks();
              }
            } else if (e.key === 'Escape') {
              editingTaskId = null;
              renderTasks();
            }
          });
        });

      } else {
        // MODO LECTURA NORMAL (Clic en texto para editar)
        li.innerHTML = `
          <div class="flex items-center gap-4 flex-1">
            <!-- Checkbox selección borrado discreto -->
            <input type="checkbox" ${isSelected ? 'checked' : ''} data-select-id="${task.id}" id="trip-select-${task.id}"
              class="select-delete-checkbox rounded border-outline-variant text-error focus:ring-0 focus:ring-offset-0 focus:outline-none w-4 h-4 cursor-pointer transition-all"/>
              
            <div class="flex items-center gap-4 flex-1">
              <input type="checkbox" ${task.completed ? 'checked' : ''} data-toggle-id="${task.id}" id="trip-toggle-${task.id}"
                class="rounded-lg border-outline-variant text-accent focus:ring-0 focus:ring-offset-0 focus:outline-none w-5 h-5 transition-colors cursor-pointer checkbox-bounce"/>
              <div class="flex flex-col flex-1 cursor-pointer select-none task-clickable" data-id="${task.id}" title="Haga clic para editar">
                <span class="text-sm ${titleClass} hover:underline decoration-accent/40">${task.title}</span>
                <span class="text-[10px] text-outline mt-0.5 font-medium bg-background px-2 py-0.5 rounded-full w-max">${task.category}</span>
              </div>
            </div>
          </div>
          <button class="delete-triptask-btn text-outline hover:text-error lg:opacity-0 lg:group-hover:opacity-100 focus:opacity-100 focus:ring-0 focus:outline-none transition-opacity p-1" aria-label="Eliminar tarea">
            <span class="material-symbols-outlined text-sm">delete</span>
          </button>
        `;

        // Click en texto abre editor inline
        li.querySelector('.task-clickable').addEventListener('click', () => {
          editingTaskId = task.id;
          renderTasks();
        });

        // Escuchar cambios completar
        li.querySelector(`input[data-toggle-id="${task.id}"]`).addEventListener('change', async (e) => {
          e.target.blur();
          const nextState = !task.completed;
          await db.toggleTripTask(task.id, nextState);
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
        li.querySelector('.delete-triptask-btn').addEventListener('click', async (e) => {
          e.target.blur();
          if (confirm(`¿Estás seguro de que deseas eliminar la tarea "${task.title}"?`)) {
            selectedIds = selectedIds.filter(id => id !== task.id);
            await db.deleteTripTask(task.id);
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
        state.activeTripFilter = filterValue;
        
        // Actualizar clases activas en UI
        ['all', 'pending', 'completed'].forEach(f => {
          const b = document.getElementById(`filter-trip-${f}`);
          if (b) {
            if (f === filterValue) {
              b.className = 'px-4 py-1.5 bg-surface text-primary shadow-sm font-bold rounded-full text-xs transition-all focus:ring-0 focus:outline-none';
            } else {
              b.className = 'px-4 py-1.5 text-outline hover:text-primary rounded-full text-xs transition-all focus:ring-0 focus:outline-none';
            }
          }
        });
        
        renderTasks();
      });
    }
  };

  setupFilterBtn('filter-trip-all', 'all');
  setupFilterBtn('filter-trip-pending', 'pending');
  setupFilterBtn('filter-trip-completed', 'completed');

  // Limpiar completados
  const clearCompletedBtn = document.getElementById('clear-trip-completed-btn');
  if (clearCompletedBtn) {
    clearCompletedBtn.addEventListener('click', async (e) => {
      e.target.blur();
      const completedIds = state.tripTasks.filter(t => t.completed).map(t => t.id);
      if (completedIds.length === 0) return;
      if (confirm(`¿Estás seguro de que deseas eliminar las ${completedIds.length} tareas completadas?`)) {
        await db.deleteTripTasks(completedIds);
      }
    });
  }

  // Toggle del Formulario de Creación
  const toggleBtn = document.getElementById('toggle-trip-form-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.target.blur();
      const formContainer = document.getElementById('add-trip-form-container');
      const btnIcon = document.getElementById('trip-form-btn-icon');
      const btnText = document.getElementById('trip-form-btn-text');

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
  const bulkDeleteBtn = document.getElementById('bulk-delete-trip-btn');
  if (bulkDeleteBtn) {
    bulkDeleteBtn.addEventListener('click', async (e) => {
      e.target.blur();
      if (selectedIds.length === 0) return;
      if (confirm(`¿Estás seguro de que deseas eliminar las ${selectedIds.length} tareas seleccionadas?`)) {
        const idsToRemove = [...selectedIds];
        selectedIds = [];
        await db.deleteTripTasks(idsToRemove);
      }
    });
  }

  // Enviar formulario para añadir tarea
  const addForm = document.getElementById('add-trip-task-form');
  if (addForm) {
    addForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const titleInput = document.getElementById('trip-task-title-input');
      const catSelect = document.getElementById('trip-task-category-input');

      await db.addTripTask(titleInput.value, catSelect.value);

      titleInput.value = '';
    });
  }

  // Cuenta atrás del viaje (soporta días pasados si pasa la fecha)
  const tripDate = new Date('2026-08-16T22:00:00').getTime();
  const updateTripCountdown = () => {
    const textEl = document.getElementById('trip-days-text');
    if (!textEl) return;

    const now = new Date().getTime();
    const distance = tripDate - now;

    if (distance < 0) {
      const daysPassed = Math.floor(Math.abs(distance) / (1000 * 60 * 60 * 24));
      textEl.innerHTML = `
        <span class="material-symbols-outlined text-[20px] text-accent">celebration</span>
        <span>¡De viaje de luna de miel! Llevamos ${daysPassed} día${daysPassed !== 1 ? 's' : ''} 🌴</span>
      `;
    } else {
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      if (days > 0) {
        textEl.innerHTML = `
          <span class="material-symbols-outlined text-[20px] text-accent">flight_takeoff</span>
          <span>¡Quedan ${days} días para nuestra luna de miel! ✈️</span>
        `;
      } else {
        const hours = Math.floor(distance / (1000 * 60 * 60));
        textEl.innerHTML = `
          <span class="material-symbols-outlined text-[20px] text-accent">flight_takeoff</span>
          <span>¡Salimos en ${hours} horas! 🛫</span>
        `;
      }
    }
  };

  renderCategoryFilters();
  renderTasks();
  updateTripCountdown();

  if (window.activeTripCountdownInterval) clearInterval(window.activeTripCountdownInterval);
  window.activeTripCountdownInterval = setInterval(updateTripCountdown, 60000);
}
