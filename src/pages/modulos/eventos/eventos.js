import { Card } from '../../../components/Card.js';
import { InputField } from '../../../components/InputField.js';
import { Button } from '../../../components/Button.js';

let selectedIds = [];
let editingEventId = null;

let eventCategories = ['Social', 'Salud', 'Parroquia', 'Familia', 'Otros'];

/**
 * Renderiza la interfaz de Eventos y Calendario.
 * 
 * @param {Object} state - Estado global
 * @returns {string} HTML de la vista
 */
export function render(state) {
  selectedIds = [];
  editingEventId = null;

  eventCategories = state.eventCategories || ['Social', 'Salud', 'Parroquia', 'Familia', 'Otros'];

  // Inicializar filtros si no existen
  if (!state.activeEventFilter) state.activeEventFilter = 'all';
  if (!state.activeEventCategoryFilter) state.activeEventCategoryFilter = 'all';

  // Opciones de categoría para el formulario de creación
  const categoryOptions = eventCategories.map(cat => `<option value="${cat}">${cat}</option>`).join('');

  const content = `
    <div class="mb-6 flex flex-col gap-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-3xl font-bold text-primary tracking-tight mb-2">Calendario y Eventos</h2>
          <p class="text-base text-outline">La agenda compartida de sus citas, planes y fechas importantes.</p>
        </div>
        
        <div class="flex items-center gap-3 justify-start sm:justify-end">
          <button id="toggle-event-form-btn" class="bg-accent hover:bg-accent/90 text-white font-semibold text-xs px-5 py-2.5 rounded-full transition-all flex items-center gap-2 shrink-0 shadow-md focus:ring-0 focus:outline-none">
            <span class="material-symbols-outlined text-[16px]" id="event-form-btn-icon">add</span>
            <span id="event-form-btn-text">Nuevo Evento</span>
          </button>
        </div>
      </div>

      <!-- Barra de Filtros (Estado y Categorías) -->
      <div class="flex flex-col gap-3 bg-surface p-4 rounded-2xl border border-outline-variant/20 shadow-linen">
        <!-- Filtro de Estado -->
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-xs font-bold text-primary uppercase tracking-wider min-w-[80px]">Estado:</span>
          <div class="flex bg-outline-variant/20 p-1 rounded-full select-none flex-wrap">
            <button id="filter-event-all" class="px-4 py-1.5 ${state.activeEventFilter === 'all' ? 'bg-surface text-primary shadow-sm font-bold' : 'text-outline hover:text-primary'} rounded-full text-xs transition-all focus:ring-0 focus:outline-none">Todos</button>
            <button id="filter-event-future" class="px-4 py-1.5 ${state.activeEventFilter === 'future' ? 'bg-surface text-primary shadow-sm font-bold' : 'text-outline hover:text-primary'} rounded-full text-xs transition-all focus:ring-0 focus:outline-none">Futuros</button>
            <button id="filter-event-past" class="px-4 py-1.5 ${state.activeEventFilter === 'past' ? 'bg-surface text-primary shadow-sm font-bold' : 'text-outline hover:text-primary'} rounded-full text-xs transition-all focus:ring-0 focus:outline-none">Pasados</button>
          </div>
        </div>

        <!-- Filtro de Categorías -->
        <div class="flex items-center gap-2 flex-wrap border-t border-outline-variant/10 pt-3">
          <span class="text-xs font-bold text-primary uppercase tracking-wider min-w-[80px]">Categoría:</span>
          <div class="flex gap-1.5 overflow-x-auto pb-1 max-w-full custom-scrollbar flex-wrap" id="event-category-filters-container">
            <!-- Renderizado dinámicamente -->
          </div>
        </div>
      </div>
    </div>

    <!-- Formulario de creación arriba, ocupando el ancho completo -->
    <div id="add-event-sidebar" class="hidden mb-8 w-full">
      ${Card({
        content: `
          <h3 class="text-lg font-bold text-primary mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined">add_box</span> Agendar Nuevo Evento
          </h3>
          
          <form id="add-event-form" class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div class="md:col-span-2">
              ${InputField({ id: 'event-title', label: 'Nombre del evento', placeholder: 'Ej: Cena romántica o Dentista', required: true })}
            </div>
            <div class="grid grid-cols-2 gap-2 md:col-span-1">
              ${InputField({ id: 'event-date', label: 'Fecha', type: 'date', required: true })}
              ${InputField({ id: 'event-time', label: 'Hora', type: 'time', required: true })}
            </div>
            <div>
              <label for="event-category" class="block text-xs font-bold text-primary uppercase tracking-wider mb-1">Tipo de Evento</label>
              <select id="event-category" class="w-full bg-background border-none rounded-xl px-4 py-3.5 text-sm focus:ring-0 focus:outline-none text-outline">
                ${categoryOptions}
              </select>
            </div>
            <div class="md:col-span-4 flex justify-end mt-2">
              ${Button({ text: 'Guardar Evento', icon: 'calendar_today', className: 'px-8 py-3.5 text-sm shadow-sm focus:ring-0 focus:outline-none' })}
            </div>
          </form>
        `
      })}
    </div>

    <div class="w-full">
      <!-- Cronograma de Citas -->
      ${Card({
        content: `
          <div class="flex items-center justify-between mb-4 border-b border-outline-variant/20 pb-4">
            <span id="events-stats-text" class="text-sm font-bold text-primary">0 eventos en total</span>
            
            <!-- Botón de borrado múltiple discreto -->
            <button id="bulk-delete-events-btn" class="hidden bg-error/10 hover:bg-error/20 text-error border border-error/20 font-bold text-[10px] px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 shadow-sm select-none focus:ring-0 focus:outline-none">
              <span class="material-symbols-outlined text-[14px]">delete_sweep</span>
              <span>Eliminar (<span id="bulk-delete-events-count">0</span>)</span>
            </button>
          </div>

          <div class="flex flex-col gap-4" id="events-timeline-list">
            <!-- Cargado en init() -->
          </div>
        `
      })}
    </div>
  `;

  return content;
}

/**
 * Agrega comportamiento e interactividad a la sección de Eventos usando la DB.
 * 
 * @param {Object} state - Estado global
 * @param {Object} db - Interfaz unificada de base de datos
 */
export function init(state, db) {
  // Asegurar filtros iniciales
  if (!state.activeEventFilter) state.activeEventFilter = 'all';
  if (!state.activeEventCategoryFilter) state.activeEventCategoryFilter = 'all';

  editingEventId = null;

  eventCategories = state.eventCategories || ['Social', 'Salud', 'Parroquia', 'Familia', 'Otros'];

  const updateBulkDeleteButton = () => {
    const btn = document.getElementById('bulk-delete-events-btn');
    const countSpan = document.getElementById('bulk-delete-events-count');
    if (!btn || !countSpan) return;

    if (selectedIds.length > 0) {
      countSpan.innerText = selectedIds.length;
      btn.classList.remove('hidden');
    } else {
      btn.classList.add('hidden');
    }
  };

  const renderCategoryFilters = () => {
    const catContainer = document.getElementById('event-category-filters-container');
    if (!catContainer) return;

    catContainer.innerHTML = '';
    const activeCat = state.activeEventCategoryFilter || 'all';

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
      state.activeEventCategoryFilter = 'all';
      renderCategoryFilters();
      renderEventsList();
    });
    catContainer.appendChild(allBtn);

    // Botones por categoría
    eventCategories.forEach(catName => {
      const btn = document.createElement('button');
      btn.className = `px-3.5 py-1.5 rounded-full text-xs font-bold transition-all focus:ring-0 focus:outline-none ${
        activeCat === catName
          ? 'bg-primary text-white shadow-sm'
          : 'bg-outline-variant/20 text-outline hover:text-primary hover:bg-outline-variant/30'
      }`;
      btn.innerText = catName;
      btn.addEventListener('click', (e) => {
        e.target.blur();
        state.activeEventCategoryFilter = catName;
        renderCategoryFilters();
        renderEventsList();
      });
      catContainer.appendChild(btn);
    });
  };

  const renderEventsList = () => {
    const listEl = document.getElementById('events-timeline-list');
    if (!listEl) return;
    listEl.innerHTML = '';

    // 1. Filtrar eventos por estado (Futuros, Pasados, Todos)
    let filtered = state.events || [];
    const todayStr = new Date().toISOString().split('T')[0];

    if (state.activeEventFilter === 'future') {
      filtered = filtered.filter(e => e.date >= todayStr);
    } else if (state.activeEventFilter === 'past') {
      filtered = filtered.filter(e => e.date < todayStr);
    }

    // 2. Filtrar por categoría
    const activeCatFilter = state.activeEventCategoryFilter || 'all';
    if (activeCatFilter !== 'all') {
      filtered = filtered.filter(e => e.category === activeCatFilter);
    }

    const sorted = [...filtered].sort((a,b) => new Date(a.date + 'T' + (a.time || '00:00')) - new Date(b.date + 'T' + (b.time || '00:00')));

    const totalCount = (state.events || []).length;
    const statsEl = document.getElementById('events-stats-text');
    if (statsEl) {
      statsEl.innerText = `${filtered.length} evento${filtered.length !== 1 ? 's' : ''} filtrado${filtered.length !== 1 ? 's' : ''} de ${totalCount}`;
    }

    if (sorted.length === 0) {
      listEl.innerHTML = `<p class="text-sm text-outline italic py-8 text-center bg-background/30 rounded-xl">No hay eventos que coincidan con los filtros</p>`;
      updateBulkDeleteButton();
      return;
    }

    // Agrupar los eventos ordenados por fecha
    const groups = {};
    sorted.forEach(evt => {
      if (!groups[evt.date]) {
        groups[evt.date] = [];
      }
      groups[evt.date].push(evt);
    });

    // Renderizar los grupos de eventos por días
    Object.keys(groups).forEach(dateStr => {
      const dateObj = new Date(dateStr + 'T00:00:00');
      const day = dateObj.getDate();
      const month = dateObj.toLocaleDateString('es-ES', { month: 'long' });
      const weekday = dateObj.toLocaleDateString('es-ES', { weekday: 'long' });
      const isToday = dateStr === todayStr;

      // Contenedor de día
      const dayContainer = document.createElement('div');
      dayContainer.className = 'w-full mb-2 last:mb-0';

      // Cabecera del día (estilo agenda de Google)
      const headerHtml = `
        <div class="flex items-center gap-2.5 mb-2.5 select-none">
          <span class="text-xs font-bold text-primary capitalize tracking-wider">${weekday}, ${day} de ${month}</span>
          ${isToday ? `<span class="bg-accent text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">Hoy</span>` : ''}
          <div class="flex-1 h-[1px] bg-outline-variant/20"></div>
        </div>
      `;
      dayContainer.innerHTML = headerHtml;

      const itemsList = document.createElement('div');
      itemsList.className = 'flex flex-col gap-2 pl-1';

      groups[dateStr].forEach(evt => {
        const isPast = evt.date < todayStr;
        const isCompleted = evt.completed || false;

        // Borde izquierdo estático respecto a selección (solo cambia por completado)
        const borderClass = isCompleted ? 'border-l-outline-variant/35' : 'border-l-accent';
        
        // Oscurecer eventos pasados y darles un fondo grisáceo más evidente
        const pastClass = isPast 
          ? 'opacity-55 bg-outline-variant/20 border-outline-variant/25' 
          : 'bg-surface border-outline-variant/20';

        const titleClass = isCompleted
          ? 'line-through text-outline font-normal'
          : 'text-primary font-bold';

        // Colores de texto de badge específicos por categoría
        const badgeTextColors = {
          'Social': 'text-accent',
          'Salud': 'text-primary',
          'Parroquia': 'text-wine',
          'Familia': 'text-outline',
          'Otros': 'text-terracotta'
        };
        const badgeColorClass = badgeTextColors[evt.category] || 'text-outline';

        const isSelected = selectedIds.includes(evt.id);
        const isEditing = editingEventId === evt.id;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'w-full';

        if (isEditing) {
          // MODO EDICIÓN INLINE
          const catOptions = eventCategories.map(cat => 
            `<option value="${cat}" ${cat === evt.category ? 'selected' : ''}>${cat}</option>`
          ).join('');

          itemDiv.innerHTML = `
            <div class="flex items-center justify-between gap-3 bg-surface rounded-xl p-3 border border-outline-variant/30 border-l-[5px] ${borderClass}">
              <div class="flex items-center gap-3 flex-1 min-w-0">
                <input type="checkbox" ${isSelected ? 'checked' : ''} data-select-id="${evt.id}"
                  class="select-delete-checkbox rounded border-outline-variant text-error focus:ring-0 focus:ring-offset-0 focus:outline-none w-4 h-4 cursor-pointer transition-all shrink-0"/>
                
                <div class="flex flex-col md:flex-row items-start md:items-center gap-2 flex-1 min-w-0">
                  <input type="text" id="edit-event-title-${evt.id}" value="${evt.title}" 
                    class="bg-background border border-outline-variant/30 rounded-lg px-2 py-1 text-xs text-outline focus:outline-none focus:ring-1 focus:ring-accent w-full md:max-w-[180px]" required/>
                  
                  <input type="date" id="edit-event-date-${evt.id}" value="${evt.date}" 
                    class="bg-background border border-outline-variant/30 rounded-lg px-2 py-1 text-xs text-outline focus:outline-none focus:ring-1 focus:ring-accent shrink-0"/>
                  
                  <input type="time" id="edit-event-time-${evt.id}" value="${evt.time}" 
                    class="bg-background border border-outline-variant/30 rounded-lg px-2 py-1 text-xs text-outline focus:outline-none focus:ring-1 focus:ring-accent shrink-0"/>

                  <select id="edit-event-cat-${evt.id}" class="bg-background border border-outline-variant/30 rounded-lg px-2 py-1 text-xs text-outline focus:outline-none focus:ring-1 focus:ring-accent shrink-0">
                    ${catOptions}
                  </select>

                  <div class="flex items-center gap-1 shrink-0">
                    <button class="save-event-btn text-accent hover:text-accent/80 p-1 focus:outline-none" data-id="${evt.id}" title="Guardar">
                      <span class="material-symbols-outlined text-base">check</span>
                    </button>
                    <button class="cancel-event-btn text-outline hover:text-primary p-1 focus:outline-none" data-id="${evt.id}" title="Cancelar">
                      <span class="material-symbols-outlined text-base">close</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          `;

          // Eventos Guardar y Cancelar
          itemDiv.querySelector('.save-event-btn').addEventListener('click', async (e) => {
            e.currentTarget.blur();
            const titleVal = itemDiv.querySelector(`#edit-event-title-${evt.id}`).value.trim();
            const dateVal = itemDiv.querySelector(`#edit-event-date-${evt.id}`).value;
            const timeVal = itemDiv.querySelector(`#edit-event-time-${evt.id}`).value;
            const catVal = itemDiv.querySelector(`#edit-event-cat-${evt.id}`).value;
            if (titleVal && dateVal && timeVal) {
              await db.updateEvent(evt.id, { title: titleVal, date: dateVal, time: timeVal, category: catVal });
              editingEventId = null;
              renderEventsList();
            }
          });

          itemDiv.querySelector('.cancel-event-btn').addEventListener('click', (e) => {
            e.currentTarget.blur();
            editingEventId = null;
            renderEventsList();
          });

          // Soporte de teclas enter y escape
          const inputs = itemDiv.querySelectorAll('input, select');
          inputs.forEach(input => {
            input.addEventListener('keydown', async (e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const titleVal = itemDiv.querySelector(`#edit-event-title-${evt.id}`).value.trim();
                const dateVal = itemDiv.querySelector(`#edit-event-date-${evt.id}`).value;
                const timeVal = itemDiv.querySelector(`#edit-event-time-${evt.id}`).value;
                const catVal = itemDiv.querySelector(`#edit-event-cat-${evt.id}`).value;
                if (titleVal && dateVal && timeVal) {
                  await db.updateEvent(evt.id, { title: titleVal, date: dateVal, time: timeVal, category: catVal });
                  editingEventId = null;
                  renderEventsList();
                }
              } else if (e.key === 'Escape') {
                editingEventId = null;
                renderEventsList();
              }
            });
          });

        } else {
          // MODO VISTA NORMAL
          itemDiv.innerHTML = `
            <div class="flex items-center justify-between gap-3 rounded-xl p-3 border hover:border-outline-variant/40 hover:shadow-sm transition-all border-l-[5px] ${borderClass} ${pastClass}">
              <div class="flex items-center gap-3.5 flex-1 min-w-0">
                <!-- Checkbox Selección (Borrado) -->
                <input type="checkbox" ${isSelected ? 'checked' : ''} data-select-id="${evt.id}" id="event-select-${evt.id}"
                  class="select-delete-checkbox rounded border-outline-variant text-error focus:ring-0 focus:ring-offset-0 focus:outline-none w-4 h-4 cursor-pointer transition-all shrink-0"/>

                <!-- Checkbox Completado -->
                <input type="checkbox" ${isCompleted ? 'checked' : ''} data-toggle-id="${evt.id}" id="event-toggle-${evt.id}"
                  class="rounded-lg border-outline-variant text-accent focus:ring-0 focus:ring-offset-0 focus:outline-none w-5 h-5 transition-colors cursor-pointer checkbox-bounce shrink-0"/>

                <!-- Hora del Evento -->
                <span class="text-xs font-bold text-outline shrink-0 w-14 select-none">${evt.time} hs</span>

                <div class="min-w-0 flex-1 cursor-pointer event-clickable" data-id="${evt.id}" title="Haga clic para editar">
                  <div class="flex items-center gap-2 flex-wrap">
                    <h4 class="text-sm ${titleClass} truncate leading-snug">${evt.title}</h4>
                    <span class="inline-block text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-background ${badgeColorClass} border border-outline-variant/5">
                      ${evt.category}
                    </span>
                  </div>
                </div>
              </div>

              <button class="delete-btn text-outline hover:text-error lg:opacity-0 lg:group-hover:opacity-100 focus:opacity-100 transition-opacity p-1.5 shrink-0 focus:ring-0 focus:outline-none" aria-label="Eliminar evento">
                <span class="material-symbols-outlined text-sm">delete</span>
              </button>
            </div>
          `;

          // Click para editar
          itemDiv.querySelectorAll('.event-clickable').forEach(el => {
            el.addEventListener('click', () => {
              editingEventId = evt.id;
              renderEventsList();
            });
          });

          // Escuchar cambios completar
          itemDiv.querySelector(`input[data-toggle-id="${evt.id}"]`).addEventListener('change', async (e) => {
            e.target.blur();
            const nextState = !evt.completed;
            await db.toggleEvent(evt.id, nextState);
          });

          // Evento selección borrado
          itemDiv.querySelector(`.select-delete-checkbox`).addEventListener('change', (e) => {
            e.target.blur();
            if (e.target.checked) {
              if (!selectedIds.includes(evt.id)) selectedIds.push(evt.id);
            } else {
              selectedIds = selectedIds.filter(id => id !== evt.id);
            }
            updateBulkDeleteButton();
          });

          // Eliminar evento individual
          itemDiv.querySelector('.delete-btn').addEventListener('click', async (e) => {
            e.currentTarget.blur();
            if (confirm(`¿Estás seguro de que deseas eliminar el evento "${evt.title}"?`)) {
              selectedIds = selectedIds.filter(id => id !== evt.id);
              await db.deleteEvent(evt.id);
            }
          });
        }

        itemsList.appendChild(itemDiv);
      });

      dayContainer.appendChild(itemsList);
      listEl.appendChild(dayContainer);
    });

    updateBulkDeleteButton();
  };

  // Configurar listeners de filtros de estado
  const setupFilterBtn = (id, filterValue) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.target.blur();
        state.activeEventFilter = filterValue;
        
        // Actualizar clases activas en UI
        ['all', 'future', 'past'].forEach(f => {
          const b = document.getElementById(`filter-event-${f}`);
          if (b) {
            if (f === filterValue) {
              b.className = 'px-4 py-1.5 bg-surface text-primary shadow-sm font-bold rounded-full text-xs transition-all focus:ring-0 focus:outline-none';
            } else {
              b.className = 'px-4 py-1.5 text-outline hover:text-primary rounded-full text-xs transition-all focus:ring-0 focus:outline-none';
            }
          }
        });
        
        renderEventsList();
      });
    }
  };

  setupFilterBtn('filter-event-all', 'all');
  setupFilterBtn('filter-event-future', 'future');
  setupFilterBtn('filter-event-past', 'past');

  // Botón toggle formulario
  const toggleBtn = document.getElementById('toggle-event-form-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const formSidebar = document.getElementById('add-event-sidebar');
      const btnIcon = document.getElementById('event-form-btn-icon');
      const btnText = document.getElementById('event-form-btn-text');

      if (formSidebar.classList.contains('hidden')) {
        formSidebar.classList.remove('hidden');
        btnIcon.innerText = 'close';
        btnText.innerText = 'Cancelar';
      } else {
        formSidebar.classList.add('hidden');
        btnIcon.innerText = 'add';
        btnText.innerText = 'Nuevo Evento';
      }
    });
  }

  // Borrado múltiple
  const bulkDeleteBtn = document.getElementById('bulk-delete-events-btn');
  if (bulkDeleteBtn) {
    bulkDeleteBtn.addEventListener('click', async (e) => {
      e.currentTarget.blur();
      if (selectedIds.length === 0) return;
      if (confirm(`¿Estás seguro de que deseas eliminar los ${selectedIds.length} eventos seleccionados?`)) {
        const idsToRemove = [...selectedIds];
        selectedIds = [];
        await db.deleteEvents(idsToRemove);
      }
    });
  }

  // Enviar formulario
  const form = document.getElementById('add-event-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const titleInput = document.getElementById('event-title');
      const dateInput = document.getElementById('event-date');
      const timeInput = document.getElementById('event-time');
      const catSelect = document.getElementById('event-category');

      await db.addEvent(titleInput.value, dateInput.value, timeInput.value, catSelect.value);

      titleInput.value = '';
      dateInput.value = '';
      timeInput.value = '';
      
      // Ocultar formulario después de añadir
      const formSidebar = document.getElementById('add-event-sidebar');
      const btnIcon = document.getElementById('event-form-btn-icon');
      const btnText = document.getElementById('event-form-btn-text');
      formSidebar.classList.add('hidden');
      if (btnIcon) btnIcon.innerText = 'add';
      if (btnText) btnText.innerText = 'Nuevo Evento';
    });
  }

  renderCategoryFilters();
  renderEventsList();
}
