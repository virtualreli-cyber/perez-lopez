import { Card } from '../../../components/Card.js';
import { InputField } from '../../../components/InputField.js';
import { Button } from '../../../components/Button.js';

let selectedIds = [];

/**
 * Renderiza la interfaz de Eventos y Calendario.
 * 
 * @param {Object} state - Estado global
 * @returns {string} HTML de la vista
 */
export function render(state) {
  selectedIds = [];

  const content = `
    <div class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-3xl font-bold text-primary tracking-tight mb-2">Calendario y Eventos</h2>
        <p class="text-base text-outline">La agenda compartida de sus citas, planes y fechas importantes.</p>
      </div>
      
      <div class="flex items-center gap-3 self-start md:self-center">
        <!-- Botón de borrado múltiple discreto -->
        <button id="bulk-delete-events-btn" class="hidden bg-error/10 hover:bg-error/20 text-error border border-error/20 font-bold text-xs px-4.5 py-3 rounded-full transition-all flex items-center gap-1.5 shadow-sm select-none">
          <span class="material-symbols-outlined text-[16px]">delete_sweep</span>
          <span>Eliminar Seleccionados (<span id="bulk-delete-events-count">0</span>)</span>
        </button>

        <button id="toggle-event-form-btn" class="bg-accent hover:bg-accent/90 text-white font-semibold text-xs px-5 py-3 rounded-full transition-all flex items-center gap-2 shrink-0 shadow-md">
          <span class="material-symbols-outlined text-[16px]" id="event-form-btn-icon">add</span>
          <span id="event-form-btn-text">Nuevo Evento</span>
        </button>
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
              <select id="event-category" class="w-full bg-background border-none rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-accent text-outline">
                <option value="Planes">Cita / Plan</option>
                <option value="Médico">Salud</option>
                <option value="Familia">Familia / Amigos</option>
                <option value="Viajes">Viajes</option>
              </select>
            </div>
            <div class="md:col-span-4 flex justify-end mt-2">
              ${Button({ text: 'Guardar Evento', icon: 'calendar_today', className: 'px-8 py-3.5 text-sm shadow-sm' })}
            </div>
          </form>
        `
      })}
    </div>

    <div class="w-full">
      <!-- Cronología / Timeline -->
      ${Card({
        content: `
          <h3 class="text-lg font-bold text-primary mb-6 flex items-center gap-2">
            <span class="material-symbols-outlined">schedule</span> Cronograma de Citas
          </h3>

          <div class="relative pl-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-outline-variant/30 space-y-8" id="events-timeline-list">
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

  const renderTimeline = () => {
    const listEl = document.getElementById('events-timeline-list');
    if (!listEl) return;
    listEl.innerHTML = '';

    const sorted = [...state.events].sort((a,b) => new Date(a.date) - new Date(b.date));

    if (sorted.length === 0) {
      listEl.innerHTML = `<p class="text-sm text-outline italic py-8 text-center bg-background/30 rounded-xl">No hay eventos planeados en el calendario</p>`;
      updateBulkDeleteButton();
      return;
    }

    sorted.forEach(evt => {
      const dateObj = new Date(evt.date);
      const day = dateObj.getDate();
      const month = dateObj.toLocaleDateString('es-ES', { month: 'short' });
      const weekday = dateObj.toLocaleDateString('es-ES', { weekday: 'long' });

      const catColors = {
        'Planes': 'border-accent text-accent bg-accent/5',
        'Médico': 'border-primary text-primary bg-primary/5',
        'Familia': 'border-outline text-outline bg-outline/5',
        'Viajes': 'border-primary-light text-primary-light bg-primary-light/5'
      };
      const colorClass = catColors[evt.category] || 'border-outline text-outline bg-outline/5';

      const isSelected = selectedIds.includes(evt.id);

      const itemDiv = document.createElement('div');
      itemDiv.className = `relative group pl-2 before:absolute before:left-[-20px] before:top-[18px] before:w-[10px] before:h-[10px] before:rounded-full before:bg-surface before:border-2 ${colorClass.split(' ')[0]}`;

      itemDiv.innerHTML = `
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface rounded-2xl p-5 border border-outline-variant/20 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-start gap-4 flex-1">
            <input type="checkbox" ${isSelected ? 'checked' : ''} data-select-id="${evt.id}" id="event-select-${evt.id}"
              class="select-delete-checkbox rounded border-outline-variant text-error focus:ring-error w-4 h-4 cursor-pointer transition-all self-center mr-2"/>

            <div class="flex items-start gap-4">
              <div class="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-background text-primary shrink-0 border border-outline-variant/10">
                <span class="text-[10px] font-bold text-outline">${month}</span>
                <span class="text-lg font-bold -mt-1">${day}</span>
              </div>
              
              <div>
                <h4 class="text-sm font-bold text-primary">${evt.title}</h4>
                <p class="text-[10px] text-outline capitalize mt-0.5 font-medium flex items-center gap-1">
                  <span class="material-symbols-outlined text-[12px]">schedule</span> ${evt.time} hs — ${weekday}
                </p>
                <span class="inline-block mt-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-background ${colorClass.split(' ')[2]}">
                  ${evt.category}
                </span>
              </div>

            </div>
          </div>

          <button class="delete-btn text-outline hover:text-error lg:opacity-0 lg:group-hover:opacity-100 focus:opacity-100 transition-opacity p-1.5 self-start sm:self-center" aria-label="Eliminar evento">
            <span class="material-symbols-outlined text-sm">delete</span>
          </button>
        </div>
      `;

      // Evento selección borrado
      itemDiv.querySelector(`.select-delete-checkbox`).addEventListener('change', (e) => {
        if (e.target.checked) {
          if (!selectedIds.includes(evt.id)) selectedIds.push(evt.id);
        } else {
          selectedIds = selectedIds.filter(id => id !== evt.id);
        }
        updateBulkDeleteButton();
      });

      // Eliminar evento individual
      itemDiv.querySelector('.delete-btn').addEventListener('click', async () => {
        if (confirm(`¿Estás seguro de que deseas eliminar el evento "${evt.title}"?`)) {
          selectedIds = selectedIds.filter(id => id !== evt.id);
          await db.deleteEvent(evt.id);
        }
      });

      listEl.appendChild(itemDiv);
    });

    updateBulkDeleteButton();
  };

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
    bulkDeleteBtn.addEventListener('click', async () => {
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
    });
  }

  renderTimeline();
}
