import { Card } from '../../../components/Card.js';
import { InputField } from '../../../components/InputField.js';
import { Button } from '../../../components/Button.js';

/**
 * Renderiza la interfaz de Preparación del Viaje e Itinerario de la Luna de Miel.
 * 
 * @param {Object} state - Estado global
 * @returns {string} HTML de la vista
 */
export function render(state) {
  const content = `
    <!-- Menú de Sub-Páginas del Módulo Boda -->
    <div class="flex border-b border-outline-variant/20 mb-8 gap-1 overflow-x-auto pb-1 custom-scrollbar">
      <a href="#/boda/tareas" class="px-5 py-2.5 rounded-t-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 text-outline hover:text-primary hover:bg-white/50">Checklist Boda</a>
      <a href="#/boda/viaje" class="px-5 py-2.5 rounded-t-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 bg-primary text-white">Preparación Viaje</a>
      <a href="#/boda/financiacion" class="px-5 py-2.5 rounded-t-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 text-outline hover:text-primary hover:bg-white/50">Presupuesto Boda</a>
    </div>

    <div class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-3xl font-bold text-primary tracking-tight mb-2">Preparación del Viaje</h2>
        <p class="text-base text-outline">Nuestra luna de miel soñada en Sri Lanka y Maldivas. Salida: 16 de agosto de 2026.</p>
      </div>
      <div class="flex items-center gap-3">
        <span id="trip-days-badge" class="px-4 py-2 bg-accent text-white rounded-full text-xs font-bold shadow-md">
          Cargando cuenta atrás...
        </span>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      <!-- Columna Izquierda: Checklist de Tareas del Viaje -->
      <div class="lg:col-span-5 space-y-6">
        ${Card({
          content: `
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-bold text-primary flex items-center gap-2">
                <span class="material-symbols-outlined">checklist</span> Cosas Pendientes
              </h3>
            </div>

            <!-- Formulario Rápido Añadir Tarea Viaje -->
            <form id="trip-add-triptask-form" class="flex gap-2 mb-4">
              <input type="text" id="trip-triptask-title" placeholder="Ej: Solicitar visado, comprar adaptador..." required
                class="flex-1 bg-background border-none rounded-xl px-3.5 py-3 text-sm focus:ring-2 focus:ring-accent text-outline placeholder:text-outline/50" />
              ${Button({ text: 'Añadir', icon: 'add', className: 'px-4 py-3 text-sm shrink-0' })}
            </form>

            <ul id="trip-triptasks-list" class="divide-y divide-outline-variant/10 max-h-[400px] overflow-y-auto pr-1">
              <!-- Se renderiza en init() -->
            </ul>
          `
        })}
      </div>

      <!-- Columna Derecha: Itinerario y Destinos Visuales -->
      <div class="lg:col-span-7 space-y-6">
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

        ${Card({
          content: `
            <div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div>
                <h4 class="text-sm font-bold text-primary">Información Clave de Sri Lanka</h4>
                <p class="text-xs text-outline mt-0.5">Moneda: Rupia de Sri Lanka (LKR). Clima tropical cálido.</p>
              </div>
              <div class="h-10 w-[1px] bg-outline-variant/20 hidden sm:block"></div>
              <div>
                <h4 class="text-sm font-bold text-primary">Información Clave de Maldivas</h4>
                <p class="text-xs text-outline mt-0.5">Moneda: Rufiyaa (MVR). Requiere formulario IMUGA (96h antes).</p>
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
  const renderTasks = () => {
    const listEl = document.getElementById('trip-triptasks-list');
    if (!listEl) return;

    listEl.innerHTML = '';
    const sorted = [...state.tripTasks].sort((a, b) => a.completed - b.completed);

    if (sorted.length === 0) {
      listEl.innerHTML = `<li class="text-xs text-outline italic py-4 text-center bg-background rounded-xl">No hay tareas creadas</li>`;
      return;
    }

    sorted.forEach(task => {
      const titleClass = task.completed ? 'line-through text-outline font-normal' : 'text-primary font-semibold';
      const checked = task.completed ? 'checked' : '';
      const li = document.createElement('li');
      li.className = 'flex items-center justify-between py-3 group';

      li.innerHTML = `
        <label class="flex items-center gap-3 cursor-pointer select-none flex-1">
          <input type="checkbox" ${checked} data-toggle-triptask-id="${task.id}" id="triptask-check-${task.id}"
            class="rounded-lg border-outline-variant text-accent focus:ring-accent w-4.5 h-4.5 transition-colors cursor-pointer checkbox-bounce"/>
          <span class="text-xs ${titleClass} break-words">${task.title}</span>
        </label>
        <button class="delete-triptask-btn text-outline hover:text-error lg:opacity-0 lg:group-hover:opacity-100 focus:opacity-100 transition-opacity p-1" aria-label="Eliminar tarea">
          <span class="material-symbols-outlined text-sm">delete</span>
        </button>
      `;

      // Escuchar cambios completar
      li.querySelector(`input[data-toggle-triptask-id="${task.id}"]`).addEventListener('change', async (e) => {
        await db.toggleTripTask(task.id, e.target.checked);
      });

      // Escuchar borrado
      li.querySelector('.delete-triptask-btn').addEventListener('click', async () => {
        if (confirm('¿Estás seguro de que deseas eliminar esta tarea de viaje?')) {
          await db.deleteTripTask(task.id);
        }
      });

      listEl.appendChild(li);
    });
  };

  // Enviar formulario para añadir tarea
  const addForm = document.getElementById('trip-add-triptask-form');
  if (addForm) {
    addForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const inputEl = document.getElementById('trip-triptask-title');
      if (inputEl && inputEl.value.trim()) {
        const title = inputEl.value.trim();
        inputEl.value = '';
        await db.addTripTask(title);
      }
    });
  }

  // Cuenta atrás del viaje
  const tripDate = new Date('2026-08-16T22:00:00').getTime();
  const updateTripCountdown = () => {
    const badge = document.getElementById('trip-days-badge');
    if (!badge) return;

    const now = new Date().getTime();
    const distance = tripDate - now;
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));

    if (distance < 0) {
      badge.innerText = '¡De viaje! 🌴';
    } else if (days > 0) {
      badge.innerText = `Quedan ${days} días ✈️`;
    } else {
      const hours = Math.floor(distance / (1000 * 60 * 60));
      badge.innerText = `¡Salimos en ${hours}h! 🛫`;
    }
  };

  renderTasks();
  updateTripCountdown();

  if (window.activeTripCountdownInterval) clearInterval(window.activeTripCountdownInterval);
  window.activeTripCountdownInterval = setInterval(updateTripCountdown, 60000);
}
