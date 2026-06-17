import { Card } from '../../../components/Card.js';
import { InputField } from '../../../components/InputField.js';
import { Button } from '../../../components/Button.js';

let selectedIds = [];

/**
 * Renderiza la interfaz del Organizador de Bodas.
 * 
 * @param {Object} state - Estado global
 * @returns {string} HTML de la vista
 */
export function render(state) {
  selectedIds = [];

  const content = `
    <!-- Menú de Sub-Páginas del Módulo Boda -->
    <div class="flex border-b border-outline-variant/20 mb-8 gap-1 overflow-x-auto pb-1 custom-scrollbar">
      <a href="#/boda/tareas" class="px-5 py-2.5 rounded-t-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 bg-primary text-white">Checklist Boda</a>
      <a href="#/boda/viaje" class="px-5 py-2.5 rounded-t-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 text-outline hover:text-primary hover:bg-white/50">Preparación Viaje</a>
      <a href="#/boda/financiacion" class="px-5 py-2.5 rounded-t-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 text-outline hover:text-primary hover:bg-white/50">Presupuesto Boda</a>
    </div>

    <div class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-3xl font-bold text-primary tracking-tight mb-2">Organizador de la Boda</h2>
        <p class="text-base text-outline">El gran día está planificado. Controlen sus tareas e invitados.</p>
      </div>

      <div class="flex items-center gap-3 self-start md:self-center">
        <!-- Botón de borrado múltiple discreto -->
        <button id="bulk-delete-wedding-btn" class="hidden bg-error/10 hover:bg-error/20 text-error border border-error/20 font-bold text-xs px-4.5 py-3 rounded-full transition-all flex items-center gap-1.5 shadow-sm select-none">
          <span class="material-symbols-outlined text-[16px]">delete_sweep</span>
          <span>Eliminar Seleccionados (<span id="bulk-delete-wedding-count">0</span>)</span>
        </button>

        <button id="toggle-wedding-form-btn" class="bg-accent hover:bg-accent/90 text-white font-semibold text-xs px-5 py-3 rounded-full transition-all flex items-center gap-2 shrink-0 shadow-md">
          <span class="material-symbols-outlined text-[16px]" id="wedding-form-btn-icon">add</span>
          <span id="wedding-form-btn-text">Nueva Tarea</span>
        </button>
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
              <select id="wedding-task-category" class="w-full bg-background border-none rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-accent text-outline">
                <option value="Banquete">Banquete</option>
                <option value="Invitados">Invitados</option>
                <option value="Vestimenta">Vestimenta</option>
                <option value="Logística">Logística</option>
              </select>
            </div>
            <div>
              ${Button({ text: 'Añadir Tarea', icon: 'add', className: 'w-full py-3.5 text-sm' })}
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
            <h3 class="text-lg font-bold text-primary mb-6 flex items-center gap-2">
              <span class="material-symbols-outlined">fact_check</span> Checklist de la Boda
            </h3>
            
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

  const renderAll = () => {
    // Renderizar checklist
    const listEl = document.getElementById('wedding-tasks-list');
    if (!listEl) return;

    listEl.innerHTML = '';
    const sorted = [...state.weddingTasks].sort((a, b) => a.completed - b.completed);

    if (sorted.length === 0) {
      listEl.innerHTML = `<li class="text-sm text-outline italic py-8 text-center bg-background/30 rounded-xl">No hay tareas creadas</li>`;
      updateBulkDeleteButton();
      return;
    }

    sorted.forEach(task => {
      const titleClass = task.completed ? 'line-through text-outline font-normal' : 'text-primary font-semibold';
      const li = document.createElement('li');
      li.className = 'flex items-center justify-between py-4 group border-b border-outline-variant/10 last:border-b-0';

      const isSelected = selectedIds.includes(task.id);

      li.innerHTML = `
        <div class="flex items-center gap-4 flex-1">
          <!-- Checkbox selección borrado discreto -->
          <input type="checkbox" ${isSelected ? 'checked' : ''} data-select-id="${task.id}" id="wedding-select-${task.id}"
            class="select-delete-checkbox rounded border-outline-variant text-error focus:ring-error w-4 h-4 cursor-pointer transition-all"/>
            
          <label class="flex items-center gap-4 cursor-pointer select-none flex-1">
            <input type="checkbox" ${task.completed ? 'checked' : ''} data-toggle-id="${task.id}" id="wedding-toggle-${task.id}"
              class="rounded-lg border-outline-variant text-accent focus:ring-accent w-5 h-5 transition-colors cursor-pointer checkbox-bounce"/>
            <div class="flex flex-col">
              <span class="text-sm ${titleClass}">${task.title}</span>
              <span class="text-[10px] text-outline mt-0.5 font-medium bg-background px-2 py-0.5 rounded-full w-max">${task.category}</span>
            </div>
          </label>
        </div>
        <button class="delete-btn text-outline hover:text-error lg:opacity-0 lg:group-hover:opacity-100 focus:opacity-100 transition-opacity p-1" aria-label="Eliminar tarea">
          <span class="material-symbols-outlined text-sm">delete</span>
        </button>
      `;

      // Escuchar cambios completar
      li.querySelector(`input[data-toggle-id="${task.id}"]`).addEventListener('change', async () => {
        const nextState = !task.completed;
        await db.toggleWeddingTask(task.id, nextState);
      });

      // Escuchar cambios selección borrado
      li.querySelector(`.select-delete-checkbox`).addEventListener('change', (e) => {
        if (e.target.checked) {
          if (!selectedIds.includes(task.id)) selectedIds.push(task.id);
        } else {
          selectedIds = selectedIds.filter(id => id !== task.id);
        }
        updateBulkDeleteButton();
      });

      // Escuchar borrado individual
      li.querySelector('.delete-btn').addEventListener('click', async () => {
        if (confirm(`¿Estás seguro de que deseas eliminar la tarea "${task.title}"?`)) {
          selectedIds = selectedIds.filter(id => id !== task.id);
          await db.deleteWeddingTask(task.id);
        }
      });

      listEl.appendChild(li);
    });

    updateBulkDeleteButton();
  };

  // Toggle del Formulario de Creación
  const toggleBtn = document.getElementById('toggle-wedding-form-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
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
    bulkDeleteBtn.addEventListener('click', async () => {
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

  renderAll();
}
