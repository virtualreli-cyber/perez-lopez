import { Card } from '../../components/Card.js';

let editingCategoryId = null;

/**
 * Renderiza la interfaz de Ajustes del Sistema.
 * 
 * @param {Object} state - Estado global
 * @returns {string} HTML de la vista
 */
export function render(state) {
  // Encontrar la configuración de cada módulo para poder renderizar las tarjetas correspondientes
  const getMod = (key) => state.modulesConfig.find(m => m.key === key) || { key, label: key, activo: false, icon: 'settings' };
  
  const modDashboard = getMod('dashboard');
  const modBoda = getMod('boda');
  const modHogar = getMod('hogar');
  const modFinanzas = getMod('finanzas');
  const modEventos = getMod('eventos');

  const content = `
    <div class="mb-10">
      <h2 class="text-3xl font-bold text-primary tracking-tight mb-2">Ajustes</h2>
      <p class="text-base text-outline">Personalicen su panel de control organizado por módulos de forma limpia y estructurada.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Columna Principal: Ajustes por Módulo (8 cols) -->
      <div class="lg:col-span-8 space-y-6">
        
        <!-- Módulo Dashboard / General -->
        <div class="bg-surface rounded-2xl p-6 md:p-8 border border-outline-variant/20 shadow-linen">
          <div class="flex items-center justify-between border-b border-outline-variant/10 pb-4 mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined">${modDashboard.icon}</span>
              </div>
              <div>
                <h3 class="text-lg font-bold text-primary">${modDashboard.label}</h3>
                <p class="text-xs text-outline">Panel principal de control</p>
              </div>
            </div>
            <!-- Switch Deslizante (Siempre activo para dashboard) -->
            <label class="relative inline-flex items-center cursor-not-allowed opacity-50 select-none">
              <input type="checkbox" checked disabled class="sr-only peer"/>
              <div class="w-11 h-6 bg-accent rounded-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all after:translate-x-full"></div>
            </label>
          </div>
          <p class="text-xs text-outline leading-relaxed">Este es el módulo central del sistema y siempre está activo. Contiene la vista general de la boda, la cuenta atrás del reloj suizo y accesos directos.</p>
        </div>

        <!-- Módulo Boda -->
        <div class="bg-surface rounded-2xl p-6 md:p-8 border border-outline-variant/20 shadow-linen">
          <div class="flex items-center justify-between border-b border-outline-variant/10 pb-4 mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined">${modBoda.icon}</span>
              </div>
              <div>
                <h3 class="text-lg font-bold text-primary">${modBoda.label}</h3>
                <p class="text-xs text-outline">Tareas de boda, viaje de novios y financiación</p>
              </div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer select-none">
              <input type="checkbox" ${modBoda.activo ? 'checked' : ''} data-module-key="boda" class="sr-only peer module-toggle-input"/>
              <div class="w-11 h-6 bg-outline-variant/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>
          <p class="text-xs text-outline leading-relaxed">Controla la visualización del módulo de bodas. Si se desactiva, se ocultará de los menús de navegación, pero sus datos se conservarán intactos.</p>
        </div>

        <!-- Módulo Hogar -->
        <div class="bg-surface rounded-2xl p-6 md:p-8 border border-outline-variant/20 shadow-linen">
          <div class="flex items-center justify-between border-b border-outline-variant/10 pb-4 mb-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined">${modHogar.icon}</span>
              </div>
              <div>
                <h3 class="text-lg font-bold text-primary">${modHogar.label}</h3>
                <p class="text-xs text-outline">Lista de la compra y finanzas compartidas</p>
              </div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer select-none">
              <input type="checkbox" ${modHogar.activo ? 'checked' : ''} data-module-key="hogar" class="sr-only peer module-toggle-input"/>
              <div class="w-11 h-6 bg-outline-variant/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>
          
          <!-- Ajustes específicos de Hogar: Categorías de compras -->
          <div class="mt-6 border-t border-outline-variant/15 pt-6">
            <h4 class="text-sm font-bold text-primary mb-3 flex items-center gap-2">
              <span class="material-symbols-outlined text-lg">shopping_basket</span> Categorías de la Lista de la Compra
            </h4>
            <p class="text-xs text-outline mb-4">Añadan, editen o eliminen las categorías que utilizan en la lista de compras.</p>
            
            <!-- Formulario Añadir Categoría -->
            <form id="add-category-form" class="flex gap-2 mb-4">
              <input type="text" id="new-category-name" placeholder="Ej: Congelados, Carnicería..." required
                class="flex-1 bg-background border border-outline-variant/30 rounded-xl px-4 py-2.5 text-xs text-outline focus:outline-none focus:ring-1 focus:ring-accent"/>
              <button type="submit" class="bg-accent hover:bg-accent/90 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1 shrink-0 focus:outline-none">
                <span class="material-symbols-outlined text-sm">add</span> Añadir
              </button>
            </form>

            <!-- Lista de Categorías -->
            <ul id="settings-categories-list" class="space-y-2 max-h-[260px] overflow-y-auto pr-1 custom-scrollbar">
              <!-- Renderizado dinámico en init() -->
            </ul>
          </div>
        </div>

        <!-- Módulo Finanzas -->
        <div class="bg-surface rounded-2xl p-6 md:p-8 border border-outline-variant/20 shadow-linen">
          <div class="flex items-center justify-between border-b border-outline-variant/10 pb-4 mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined">${modFinanzas.icon}</span>
              </div>
              <div>
                <h3 class="text-lg font-bold text-primary">${modFinanzas.label}</h3>
                <p class="text-xs text-outline">Ingresos, gastos, balances mensuales y metas de ahorro</p>
              </div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer select-none">
              <input type="checkbox" ${modFinanzas.activo ? 'checked' : ''} data-module-key="finanzas" class="sr-only peer module-toggle-input"/>
              <div class="w-11 h-6 bg-outline-variant/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>
          <p class="text-xs text-outline leading-relaxed">Controla la visualización del módulo de finanzas compartidas. Si se desactiva, se ocultará de los menús de navegación, pero sus datos se conservarán intactos.</p>
        </div>

        <!-- Módulo Eventos -->
        <div class="bg-surface rounded-2xl p-6 md:p-8 border border-outline-variant/20 shadow-linen">
          <div class="flex items-center justify-between border-b border-outline-variant/10 pb-4 mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined">${modEventos.icon}</span>
              </div>
              <div>
                <h3 class="text-lg font-bold text-primary">${modEventos.label}</h3>
                <p class="text-xs text-outline">Calendario, citas y recordatorios</p>
              </div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer select-none">
              <input type="checkbox" ${modEventos.activo ? 'checked' : ''} data-module-key="eventos" class="sr-only peer module-toggle-input"/>
              <div class="w-11 h-6 bg-outline-variant/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>
          <p class="text-xs text-outline leading-relaxed">Controla la visualización del módulo de eventos y citas de la pareja.</p>
        </div>

      </div>

      <!-- Columna Informativa (4 cols) -->
      <div class="lg:col-span-4 space-y-6">
        ${Card({
          content: `
            <h3 class="text-sm font-bold text-primary mb-4 uppercase tracking-wider">Ajustes del Sistema</h3>
            <p class="text-xs text-outline leading-relaxed">
              Esta sección le permite configurar de forma independiente cada área de trabajo (módulo).
            </p>
            <p class="text-xs text-outline mt-3 leading-relaxed">
              Las modificaciones de categorías de compra se actualizarán en tiempo real tanto en la base de datos de Supabase como en la interfaz de la Lista de la Compra.
            </p>
          `
        })}
      </div>
    </div>
  `;

  return content;
}

/**
 * Agrega comportamiento e interactividad al menú de Ajustes usando la DB.
 * 
 * @param {Object} state - Estado global
 * @param {Object} db - Interfaz unificada de base de datos
 */
export function init(state, db) {
  // Asegurar valor inicial para la edición
  editingCategoryId = null;

  const renderCategories = () => {
    const listEl = document.getElementById('settings-categories-list');
    if (!listEl) return;

    listEl.innerHTML = '';
    const categories = state.shoppingCategories || [];

    if (categories.length === 0) {
      listEl.innerHTML = `<li class="text-xs text-outline italic py-4 text-center bg-background/20 rounded-xl">No hay categorías configuradas</li>`;
      return;
    }

    categories.forEach(cat => {
      const li = document.createElement('li');
      li.className = 'flex items-center justify-between bg-background/50 border border-outline-variant/10 rounded-xl px-3 py-2 gap-2';

      // Comprobar si está en modo edición
      const isEditing = editingCategoryId === cat.id;

      if (isEditing) {
        li.innerHTML = `
          <input type="text" id="edit-cat-input-${cat.id}" value="${cat.name}" class="flex-1 bg-surface border border-outline-variant/30 rounded-lg px-2.5 py-1 text-xs text-outline focus:outline-none focus:ring-1 focus:ring-accent"/>
          <div class="flex items-center gap-1 shrink-0">
            <button class="save-cat-btn text-accent hover:text-accent/80 p-1 focus:outline-none" data-id="${cat.id}">
              <span class="material-symbols-outlined text-base">check</span>
            </button>
            <button class="cancel-cat-btn text-outline hover:text-primary p-1 focus:outline-none">
              <span class="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        `;

        // Eventos de Guardar y Cancelar
        li.querySelector('.save-cat-btn').addEventListener('click', async (e) => {
          e.currentTarget.blur();
          const input = document.getElementById(`edit-cat-input-${cat.id}`);
          const newName = input.value.trim();
          if (newName) {
            await db.updateShoppingCategory(cat.id, newName);
            editingCategoryId = null;
            renderCategories();
          }
        });

        li.querySelector('.cancel-cat-btn').addEventListener('click', (e) => {
          e.currentTarget.blur();
          editingCategoryId = null;
          renderCategories();
        });

      } else {
        li.innerHTML = `
          <span class="text-xs text-primary font-medium">${cat.name}</span>
          <div class="flex items-center gap-1.5 shrink-0">
            <button class="edit-cat-btn text-outline hover:text-primary p-1 focus:outline-none" data-id="${cat.id}">
              <span class="material-symbols-outlined text-base">edit</span>
            </button>
            <button class="delete-cat-btn text-outline hover:text-error p-1 focus:outline-none" data-id="${cat.id}">
              <span class="material-symbols-outlined text-base">delete</span>
            </button>
          </div>
        `;

        // Eventos de Editar y Borrar
        li.querySelector('.edit-cat-btn').addEventListener('click', (e) => {
          e.currentTarget.blur();
          editingCategoryId = cat.id;
          renderCategories();
        });

        li.querySelector('.delete-cat-btn').addEventListener('click', async (e) => {
          e.currentTarget.blur();
          if (confirm(`¿Estás seguro de que deseas eliminar la categoría "${cat.name}"? Los productos asociados mantendrán su categoría actual pero no podrás filtrarlos de nuevo.`)) {
            await db.deleteShoppingCategory(cat.id);
            renderCategories();
          }
        });
      }

      listEl.appendChild(li);
    });
  };

  // Escuchar cambios de toggle en los switches de módulos
  const toggles = document.querySelectorAll('.module-toggle-input');
  toggles.forEach(chk => {
    chk.addEventListener('change', async (e) => {
      const key = e.target.getAttribute('data-module-key');
      const nextActiveState = e.target.checked;
      await db.toggleModule(key, nextActiveState);
      
      // Dispatch hashchange para forzar refresco del menú lateral instantáneamente
      setTimeout(() => {
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      }, 100);
    });
  });

  // Formulario Añadir Categoría
  const addForm = document.getElementById('add-category-form');
  if (addForm) {
    addForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = document.getElementById('new-category-name');
      const name = input.value.trim();
      if (name) {
        await db.addShoppingCategory(name);
        input.value = '';
        renderCategories();
      }
    });
  }

  // Render inicial de categorías
  renderCategories();
}
