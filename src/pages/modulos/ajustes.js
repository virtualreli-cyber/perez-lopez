import { Card } from '../../components/Card.js';

let editingIndex = null; // null o { type: 'wedding'|'trip'|'event'|'shopping', index: number, id: any }
let editingShoppingCategoryId = null;

/**
 * Renderiza la interfaz de Ajustes del Sistema con pestañas independientes.
 * 
 * @param {Object} state - Estado global
 * @returns {string} HTML de la vista
 */
export function render(state) {
  // Obtener la subpágina actual
  const hash = location.hash || '#/ajustes/general';
  let subPage = 'general';
  if (hash.startsWith('#/ajustes/')) {
    subPage = hash.replace('#/ajustes/', '');
  }

  // Encontrar la configuración de cada módulo para poder renderizar las tarjetas correspondientes
  const getMod = (key) => state.modulesConfig.find(m => m.key === key) || { key, label: key, activo: false, icon: 'settings' };
  
  const modDashboard = getMod('dashboard');
  const modBoda = getMod('boda');
  const modHogar = getMod('hogar');
  const modFinanzas = getMod('finanzas');
  const modEventos = getMod('eventos');

  // Construir el menú lateral o de pestañas superior
  const navigationHtml = `
    <div class="flex border-b border-outline-variant/20 mb-8 gap-1 overflow-x-auto pb-1 custom-scrollbar">
      <a href="#/ajustes/general" class="px-5 py-2.5 rounded-t-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${subPage === 'general' ? 'bg-primary text-white' : 'text-outline hover:text-primary hover:bg-white/50'}">General / Módulos</a>
      <a href="#/ajustes/hogar" class="px-5 py-2.5 rounded-t-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${subPage === 'hogar' ? 'bg-primary text-white' : 'text-outline hover:text-primary hover:bg-white/50'}">Hogar</a>
      <a href="#/ajustes/boda" class="px-5 py-2.5 rounded-t-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${subPage === 'boda' ? 'bg-primary text-white' : 'text-outline hover:text-primary hover:bg-white/50'}">Boda & Viaje</a>
      <a href="#/ajustes/finanzas" class="px-5 py-2.5 rounded-t-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${subPage === 'finanzas' ? 'bg-primary text-white' : 'text-outline hover:text-primary hover:bg-white/50'}">Finanzas</a>
      <a href="#/ajustes/eventos" class="px-5 py-2.5 rounded-t-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${subPage === 'eventos' ? 'bg-primary text-white' : 'text-outline hover:text-primary hover:bg-white/50'}">Eventos</a>
    </div>
  `;

  let pageContentHtml = '';

  if (subPage === 'general') {
    pageContentHtml = `
      <div class="space-y-6">
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
          <div class="flex items-center justify-between border-b border-outline-variant/10 pb-4 mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined">${modHogar.icon}</span>
              </div>
              <div>
                <h3 class="text-lg font-bold text-primary">${modHogar.label}</h3>
                <p class="text-xs text-outline">Lista de la compra</p>
              </div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer select-none">
              <input type="checkbox" ${modHogar.activo ? 'checked' : ''} data-module-key="hogar" class="sr-only peer module-toggle-input"/>
              <div class="w-11 h-6 bg-outline-variant/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>
          <p class="text-xs text-outline leading-relaxed">Controla la lista de la compra compartida del hogar.</p>
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
          <p class="text-xs text-outline leading-relaxed">Controla la visualización del módulo de finanzas compartidas y cuentas bancarias.</p>
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
    `;
  } else if (subPage === 'hogar') {
    pageContentHtml = `
      <div class="max-w-3xl">
        ${Card({
          content: `
            <div class="flex items-center justify-between border-b border-outline-variant/10 pb-4 mb-6">
              <div class="flex items-center gap-2 text-primary">
                <span class="material-symbols-outlined">shopping_basket</span>
                <h3 class="text-base font-bold">Categorías de la Lista de la Compra</h3>
              </div>
            </div>
            
            <!-- Formulario Añadir Categoría -->
            <form id="add-shopping-cat-form" class="flex gap-2 mb-6">
              <input type="text" id="new-shopping-cat-name" placeholder="Ej: Congelados, Panadería, Bebidas..." required
                class="flex-1 bg-background border border-outline-variant/30 rounded-xl px-4 py-2.5 text-xs text-outline focus:outline-none focus:ring-1 focus:ring-accent"/>
              <button type="submit" class="bg-accent hover:bg-accent/90 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1 shrink-0 focus:outline-none">
                <span class="material-symbols-outlined text-sm">add</span> Añadir
              </button>
            </form>

            <!-- Lista de Categorías -->
            <ul id="settings-shopping-categories-list" class="space-y-2 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
              <!-- Renderizado dinámico -->
            </ul>
          `
        })}
      </div>
    `;
  } else if (subPage === 'boda') {
    pageContentHtml = `
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Tarjeta Tareas Boda -->
        ${Card({
          content: `
            <div class="flex items-center justify-between border-b border-outline-variant/10 pb-4 mb-6">
              <div class="flex items-center gap-2 text-primary">
                <span class="material-symbols-outlined">checklist</span>
                <h3 class="text-base font-bold">Categorías del Checklist de Boda</h3>
              </div>
            </div>
            
            <form id="add-wedding-cat-form" class="flex gap-2 mb-6">
              <input type="text" id="new-wedding-cat-name" placeholder="Ej: Flores, Música, Papeleo..." required
                class="flex-1 bg-background border border-outline-variant/30 rounded-xl px-4 py-2.5 text-xs text-outline focus:outline-none focus:ring-1 focus:ring-accent"/>
              <button type="submit" class="bg-accent hover:bg-accent/90 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1 shrink-0 focus:outline-none">
                <span class="material-symbols-outlined text-sm">add</span> Añadir
              </button>
            </form>

            <ul id="settings-wedding-categories-list" class="space-y-2 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
              <!-- Renderizado dinámico -->
            </ul>
          `
        })}

        <!-- Tarjeta Viaje Luna de Miel -->
        ${Card({
          content: `
            <div class="flex items-center justify-between border-b border-outline-variant/10 pb-4 mb-6">
              <div class="flex items-center gap-2 text-primary">
                <span class="material-symbols-outlined">flight_takeoff</span>
                <h3 class="text-base font-bold">Categorías del Viaje de Novios</h3>
              </div>
            </div>
            
            <form id="add-trip-cat-form" class="flex gap-2 mb-6">
              <input type="text" id="new-trip-cat-name" placeholder="Ej: Alojamientos, Vacunas..." required
                class="flex-1 bg-background border border-outline-variant/30 rounded-xl px-4 py-2.5 text-xs text-outline focus:outline-none focus:ring-1 focus:ring-accent"/>
              <button type="submit" class="bg-accent hover:bg-accent/90 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1 shrink-0 focus:outline-none">
                <span class="material-symbols-outlined text-sm">add</span> Añadir
              </button>
            </form>

            <ul id="settings-trip-categories-list" class="space-y-2 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
              <!-- Renderizado dinámico -->
            </ul>
          `
        })}
      </div>
    `;
  } else if (subPage === 'finanzas') {
    pageContentHtml = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Cuentas Bancarias -->
        <div class="lg:col-span-5 space-y-6">
          ${Card({
            content: `
              <h3 class="text-sm font-bold text-primary mb-4 uppercase tracking-wider">Cuentas Bancarias</h3>
              <ul class="divide-y divide-outline-variant/10 space-y-3" id="settings-accounts-list">
                ${state.financesAccounts.map(acc => `
                  <li class="flex items-center justify-between py-2.5 group">
                    <div class="flex items-center gap-3">
                      <div class="w-4 h-4 rounded-full" style="background-color: ${acc.color || '#4A8B8B'}"></div>
                      <div>
                        <p class="text-sm font-semibold text-primary">${acc.name}</p>
                        <p class="text-[10px] text-outline">Saldo inicial: €${acc.initialBalance.toFixed(2)}</p>
                      </div>
                    </div>
                    <button class="delete-account-btn text-outline hover:text-error transition-colors p-1" data-id="${acc.id}" aria-label="Eliminar cuenta">
                      <span class="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </li>
                `).join('')}
              </ul>
            `
          })}

          ${Card({
            content: `
              <h3 class="text-sm font-bold text-primary mb-4 uppercase tracking-wider">Añadir Cuenta Bancaria</h3>
              <form id="add-account-form" class="space-y-4">
                <div>
                  <label class="text-[10px] font-bold text-outline uppercase block mb-1">Nombre de la Cuenta</label>
                  <input type="text" id="account-name" placeholder="Ej. BBVA Compartida, Revolut..." required
                    class="w-full bg-background border border-outline-variant/30 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-accent placeholder-outline/50"/>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="text-[10px] font-bold text-outline uppercase block mb-1">Saldo Inicial (€)</label>
                    <input type="number" id="account-balance" step="0.01" value="0.00" required
                      class="w-full bg-background border border-outline-variant/30 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-accent placeholder-outline/50"/>
                  </div>
                  <div>
                    <label class="text-[10px] font-bold text-outline uppercase block mb-1">Color Identificador</label>
                    <input type="color" id="account-color" value="#4A8B8B"
                      class="w-full h-11 bg-background border border-outline-variant/30 rounded-xl px-2 py-1 focus:ring-1 focus:ring-accent cursor-pointer"/>
                  </div>
                </div>

                <div class="flex justify-end pt-2">
                  <button type="submit" class="bg-primary hover:bg-primary/90 text-white font-semibold rounded-full transition-colors flex items-center justify-center gap-1.5 text-xs px-6 py-3">
                    <span class="material-symbols-outlined text-[16px]">add</span> Crear Cuenta
                  </button>
                </div>
              </form>
            `
          })}
        </div>

        <!-- Categorías y Subcategorías Financieras -->
        <div class="lg:col-span-7 space-y-6">
          ${Card({
            content: `
              <h3 class="text-sm font-bold text-primary mb-4 uppercase tracking-wider">Categorías y Subcategorías de Transacciones</h3>
              <div class="space-y-4 max-h-[450px] overflow-y-auto custom-scrollbar pr-2" id="settings-fin-categories-list">
                ${state.financesCategories.map(cat => {
                  const subcats = state.financesSubcategories.filter(s => s.categoryId === cat.id);
                  return `
                    <div class="p-4 bg-background/30 rounded-2xl border border-outline-variant/10">
                      <div class="flex justify-between items-center mb-3">
                        <div class="flex items-center gap-2">
                          <span class="material-symbols-outlined text-accent text-[20px]">${cat.icon || 'star'}</span>
                          <span class="font-bold text-sm text-primary">${cat.name}</span>
                          <span class="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${cat.type === 'ingreso' ? 'bg-green-100 text-green-700' : 'bg-error-container text-on-error-container'}">
                            ${cat.type === 'ingreso' ? 'Ingreso' : 'Gasto'}
                          </span>
                        </div>
                        <button class="delete-fin-category-btn text-outline hover:text-error transition-colors p-1" data-id="${cat.id}" aria-label="Eliminar categoría">
                          <span class="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>

                      <div class="pl-4 mt-2">
                        <div class="flex flex-wrap gap-2 mb-3">
                          ${subcats.map(sub => `
                            <span class="inline-flex items-center gap-1 bg-white text-primary border border-outline-variant/15 text-xs font-semibold px-2.5 py-1 rounded-lg">
                              <span>${sub.name}</span>
                              <button class="delete-fin-subcategory-btn text-outline/50 hover:text-error transition-colors font-bold text-[10px]" data-id="${sub.id}">×</button>
                            </span>
                          `).join('')}
                          ${subcats.length === 0 ? '<span class="text-[10px] text-outline italic">Sin subcategorías</span>' : ''}
                        </div>

                        <form class="add-fin-subcategory-form flex gap-2 items-center" data-category-id="${cat.id}">
                          <input type="text" placeholder="Añadir subcategoría..." required
                            class="bg-white border border-outline-variant/20 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-accent placeholder-outline/40 text-outline flex-1 max-w-[180px]"/>
                          <button type="submit" class="bg-accent hover:bg-accent/90 text-white font-bold text-xs p-1.5 rounded-lg flex items-center justify-center">
                            <span class="material-symbols-outlined text-sm">add</span>
                          </button>
                        </form>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            `
          })}

          ${Card({
            content: `
              <h3 class="text-sm font-bold text-primary mb-4 uppercase tracking-wider">Crear Categoría Principal</h3>
              <form id="add-fin-category-form" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="text-[10px] font-bold text-outline uppercase block mb-1">Nombre de la Categoría</label>
                    <input type="text" id="category-name" placeholder="Ej. Transporte, Ocio..." required
                      class="w-full bg-background border border-outline-variant/30 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-accent placeholder-outline/50"/>
                  </div>
                  <div>
                    <label class="text-[10px] font-bold text-outline uppercase block mb-1">Tipo de Transacción</label>
                    <select id="category-type" class="w-full bg-background border border-outline-variant/30 rounded-xl px-4 py-3.5 text-sm focus:ring-0 focus:outline-none text-outline">
                      <option value="gasto">Gasto</option>
                      <option value="ingreso">Ingreso</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label class="text-[10px] font-bold text-outline uppercase block mb-1">Icono (Material Symbol)</label>
                  <input type="text" id="category-icon" value="payments" placeholder="Ej. flight, restaurant, home..." required
                    class="w-full bg-background border border-outline-variant/30 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-accent placeholder-outline/50"/>
                </div>

                <div class="flex justify-end pt-2">
                  <button type="submit" class="bg-primary hover:bg-primary/90 text-white font-semibold rounded-full transition-colors flex items-center justify-center gap-1.5 text-xs px-6 py-3">
                    <span class="material-symbols-outlined text-[16px]">add</span> Crear Categoría
                  </button>
                </div>
              </form>
            `
          })}
        </div>
      </div>
    `;
  } else if (subPage === 'eventos') {
    pageContentHtml = `
      <div class="max-w-3xl">
        ${Card({
          content: `
            <div class="flex items-center justify-between border-b border-outline-variant/10 pb-4 mb-6">
              <div class="flex items-center gap-2 text-primary">
                <span class="material-symbols-outlined">event</span>
                <h3 class="text-base font-bold">Categorías de la Agenda y Eventos</h3>
              </div>
            </div>
            
            <form id="add-event-cat-form" class="flex gap-2 mb-6">
              <input type="text" id="new-event-cat-name" placeholder="Ej: Aniversario, Reunión..." required
                class="flex-1 bg-background border border-outline-variant/30 rounded-xl px-4 py-2.5 text-xs text-outline focus:outline-none focus:ring-1 focus:ring-accent"/>
              <button type="submit" class="bg-accent hover:bg-accent/90 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1 shrink-0 focus:outline-none">
                <span class="material-symbols-outlined text-sm">add</span> Añadir
              </button>
            </form>

            <ul id="settings-event-categories-list" class="space-y-2 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
              <!-- Renderizado dinámico -->
            </ul>
          `
        })}
      </div>
    `;
  }

  const content = `
    <div class="mb-10">
      <h2 class="text-3xl font-bold text-primary tracking-tight mb-2">Ajustes</h2>
      <p class="text-base text-outline">Configuren de forma independiente y organizada cada módulo del sistema.</p>
    </div>

    ${navigationHtml}

    <div class="mt-6">
      ${pageContentHtml}
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
  // Obtener la subpágina actual
  const hash = location.hash || '#/ajustes/general';
  let subPage = 'general';
  if (hash.startsWith('#/ajustes/')) {
    subPage = hash.replace('#/ajustes/', '');
  }

  // --- SUBPÁGINA: GENERAL ---
  if (subPage === 'general') {
    const toggles = document.querySelectorAll('.module-toggle-input');
    toggles.forEach(chk => {
      chk.addEventListener('change', async (e) => {
        const key = e.target.getAttribute('data-module-key');
        const nextActiveState = e.target.checked;
        await db.toggleModule(key, nextActiveState);
        
        // Refrescar para que el menú de navegación lateral actualice las pestañas
        setTimeout(() => {
          window.dispatchEvent(new HashChangeEvent('hashchange'));
        }, 100);
      });
    });
  }

  // --- SUBPÁGINA: HOGAR (Lista de la Compra) ---
  if (subPage === 'hogar') {
    const renderShoppingCategories = () => {
      const listEl = document.getElementById('settings-shopping-categories-list');
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

        const isEditing = editingShoppingCategoryId === cat.id;

        if (isEditing) {
          li.innerHTML = `
            <input type="text" id="edit-shopping-cat-input-${cat.id}" value="${cat.name}" 
              class="flex-1 bg-surface border border-outline-variant/30 rounded-lg px-2.5 py-1 text-xs text-outline focus:outline-none focus:ring-1 focus:ring-accent"/>
            <div class="flex items-center gap-1 shrink-0">
              <button class="save-shopping-cat-btn text-accent hover:text-accent/80 p-1 focus:outline-none" data-id="${cat.id}">
                <span class="material-symbols-outlined text-base">check</span>
              </button>
              <button class="cancel-shopping-cat-btn text-outline hover:text-primary p-1 focus:outline-none">
                <span class="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          `;

          li.querySelector('.save-shopping-cat-btn').addEventListener('click', async (e) => {
            e.currentTarget.blur();
            const input = document.getElementById(`edit-shopping-cat-input-${cat.id}`);
            const newName = input.value.trim();
            if (newName) {
              await db.updateShoppingCategory(cat.id, newName);
              editingShoppingCategoryId = null;
              renderShoppingCategories();
            }
          });

          li.querySelector('.cancel-shopping-cat-btn').addEventListener('click', (e) => {
            e.currentTarget.blur();
            editingShoppingCategoryId = null;
            renderShoppingCategories();
          });
        } else {
          li.innerHTML = `
            <span class="text-xs text-primary font-medium">${cat.name}</span>
            <div class="flex items-center gap-1.5 shrink-0">
              <button class="edit-shopping-cat-btn text-outline hover:text-primary p-1 focus:outline-none" data-id="${cat.id}">
                <span class="material-symbols-outlined text-base">edit</span>
              </button>
              <button class="delete-shopping-cat-btn text-outline hover:text-error p-1 focus:outline-none" data-id="${cat.id}">
                <span class="material-symbols-outlined text-base">delete</span>
              </button>
            </div>
          `;

          li.querySelector('.edit-shopping-cat-btn').addEventListener('click', (e) => {
            e.currentTarget.blur();
            editingShoppingCategoryId = cat.id;
            renderShoppingCategories();
          });

          li.querySelector('.delete-shopping-cat-btn').addEventListener('click', async (e) => {
            e.currentTarget.blur();
            if (confirm(`¿Estás seguro de que deseas eliminar la categoría "${cat.name}"?`)) {
              await db.deleteShoppingCategory(cat.id);
              renderShoppingCategories();
            }
          });
        }

        listEl.appendChild(li);
      });
    };

    const form = document.getElementById('add-shopping-cat-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = document.getElementById('new-shopping-cat-name');
        const name = input.value.trim();
        if (name) {
          await db.addShoppingCategory(name);
          input.value = '';
          renderShoppingCategories();
        }
      });
    }

    renderShoppingCategories();
  }

  // --- SUBPÁGINA: BODA & VIAJE ---
  if (subPage === 'boda') {
    const renderList = (elementId, array, type) => {
      const listEl = document.getElementById(elementId);
      if (!listEl) return;
      listEl.innerHTML = '';

      if (array.length === 0) {
        listEl.innerHTML = `<li class="text-xs text-outline italic py-4 text-center bg-background/20 rounded-xl">No hay categorías configuradas</li>`;
        return;
      }

      array.forEach((cat, index) => {
        const li = document.createElement('li');
        li.className = 'flex items-center justify-between bg-background/50 border border-outline-variant/10 rounded-xl px-3 py-2 gap-2';

        const isEditing = editingIndex && editingIndex.type === type && editingIndex.index === index;

        if (isEditing) {
          li.innerHTML = `
            <input type="text" id="edit-${type}-cat-input-${index}" value="${cat}" 
              class="flex-1 bg-surface border border-outline-variant/30 rounded-lg px-2.5 py-1 text-xs text-outline focus:outline-none focus:ring-1 focus:ring-accent"/>
            <div class="flex items-center gap-1 shrink-0">
              <button class="save-cat-btn text-accent hover:text-accent/80 p-1 focus:outline-none">
                <span class="material-symbols-outlined text-base">check</span>
              </button>
              <button class="cancel-cat-btn text-outline hover:text-primary p-1 focus:outline-none">
                <span class="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          `;

          li.querySelector('.save-cat-btn').addEventListener('click', async (e) => {
            e.currentTarget.blur();
            const input = document.getElementById(`edit-${type}-cat-input-${index}`);
            const newName = input.value.trim();
            if (newName && newName !== cat) {
              const updatedArray = [...array];
              updatedArray[index] = newName;
              if (type === 'wedding') {
                await db.setWeddingCategories(updatedArray);
              } else {
                await db.setTripCategories(updatedArray);
              }
              editingIndex = null;
              renderAll();
            }
          });

          li.querySelector('.cancel-cat-btn').addEventListener('click', (e) => {
            e.currentTarget.blur();
            editingIndex = null;
            renderAll();
          });
        } else {
          li.innerHTML = `
            <span class="text-xs text-primary font-medium">${cat}</span>
            <div class="flex items-center gap-1.5 shrink-0">
              <button class="edit-cat-btn text-outline hover:text-primary p-1 focus:outline-none">
                <span class="material-symbols-outlined text-base">edit</span>
              </button>
              <button class="delete-cat-btn text-outline hover:text-error p-1 focus:outline-none">
                <span class="material-symbols-outlined text-base">delete</span>
              </button>
            </div>
          `;

          li.querySelector('.edit-cat-btn').addEventListener('click', (e) => {
            e.currentTarget.blur();
            editingIndex = { type, index };
            renderAll();
          });

          li.querySelector('.delete-cat-btn').addEventListener('click', async (e) => {
            e.currentTarget.blur();
            if (confirm(`¿Estás seguro de que deseas eliminar la categoría "${cat}"?`)) {
              const updatedArray = array.filter((_, i) => i !== index);
              if (type === 'wedding') {
                await db.setWeddingCategories(updatedArray);
              } else {
                await db.setTripCategories(updatedArray);
              }
              renderAll();
            }
          });
        }

        listEl.appendChild(li);
      });
    };

    const renderAll = () => {
      renderList('settings-wedding-categories-list', state.weddingCategories || [], 'wedding');
      renderList('settings-trip-categories-list', state.tripCategories || [], 'trip');
    };

    // Formulario Wedding Category
    const weddingForm = document.getElementById('add-wedding-cat-form');
    if (weddingForm) {
      weddingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = document.getElementById('new-wedding-cat-name');
        const name = input.value.trim();
        if (name) {
          const arr = state.weddingCategories || [];
          if (!arr.includes(name)) {
            await db.setWeddingCategories([...arr, name]);
          }
          input.value = '';
          renderAll();
        }
      });
    }

    // Formulario Trip Category
    const tripForm = document.getElementById('add-trip-cat-form');
    if (tripForm) {
      tripForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = document.getElementById('new-trip-cat-name');
        const name = input.value.trim();
        if (name) {
          const arr = state.tripCategories || [];
          if (!arr.includes(name)) {
            await db.setTripCategories([...arr, name]);
          }
          input.value = '';
          renderAll();
        }
      });
    }

    renderAll();
  }

  // --- SUBPÁGINA: FINANZAS ---
  if (subPage === 'finanzas') {
    // Añadir Cuenta Bancaria
    const addAccountForm = document.getElementById('add-account-form');
    if (addAccountForm) {
      addAccountForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('account-name').value.trim();
        const balance = parseFloat(document.getElementById('account-balance').value);
        const color = document.getElementById('account-color').value;

        if (name) {
          await db.addFinancesAccount(name, balance, color);
          addAccountForm.reset();
          document.getElementById('account-balance').value = '0.00';
          document.getElementById('account-color').value = '#4A8B8B';
          // Recargar la vista
          setTimeout(() => {
            window.dispatchEvent(new HashChangeEvent('hashchange'));
          }, 100);
        }
      });
    }

    // Eliminar Cuenta Bancaria
    const deleteAccountButtons = document.querySelectorAll('.delete-account-btn');
    deleteAccountButtons.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.currentTarget.blur();
        const id = parseInt(e.currentTarget.getAttribute('data-id'));
        if (confirm('¿Estás seguro de que deseas eliminar esta cuenta bancaria? Se mantendrán las transacciones asociadas pero sin cuenta asignada.')) {
          await db.deleteFinancesAccount(id);
          setTimeout(() => {
            window.dispatchEvent(new HashChangeEvent('hashchange'));
          }, 100);
        }
      });
    });

    // Eliminar Categoría Principal
    const deleteCategoryButtons = document.querySelectorAll('.delete-fin-category-btn');
    deleteCategoryButtons.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.currentTarget.blur();
        const id = parseInt(e.currentTarget.getAttribute('data-id'));
        if (confirm('¿Estás seguro de eliminar esta categoría principal y todas sus subcategorías?')) {
          await db.deleteFinancesCategory(id);
          setTimeout(() => {
            window.dispatchEvent(new HashChangeEvent('hashchange'));
          }, 100);
        }
      });
    });

    // Añadir Subcategoría
    const subcatForms = document.querySelectorAll('.add-fin-subcategory-form');
    subcatForms.forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const catId = parseInt(form.getAttribute('data-category-id'));
        const input = form.querySelector('input');
        const name = input.value.trim();

        if (name && catId) {
          await db.addFinancesSubcategory(catId, name);
          input.value = '';
          setTimeout(() => {
            window.dispatchEvent(new HashChangeEvent('hashchange'));
          }, 100);
        }
      });
    });

    // Eliminar Subcategoría
    const deleteSubcategoryButtons = document.querySelectorAll('.delete-fin-subcategory-btn');
    deleteSubcategoryButtons.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.currentTarget.blur();
        const id = parseInt(e.currentTarget.getAttribute('data-id'));
        if (confirm('¿Deseas eliminar esta subcategoría?')) {
          await db.deleteFinancesSubcategory(id);
          setTimeout(() => {
            window.dispatchEvent(new HashChangeEvent('hashchange'));
          }, 100);
        }
      });
    });

    // Crear Nueva Categoría Principal
    const addCatForm = document.getElementById('add-fin-category-form');
    if (addCatForm) {
      addCatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('category-name').value.trim();
        const type = document.getElementById('category-type').value;
        const icon = document.getElementById('category-icon').value.trim() || 'payments';

        if (name) {
          await db.addFinancesCategory(name, type, icon);
          addCatForm.reset();
          document.getElementById('category-icon').value = 'payments';
          setTimeout(() => {
            window.dispatchEvent(new HashChangeEvent('hashchange'));
          }, 100);
        }
      });
    }
  }

  // --- SUBPÁGINA: EVENTOS ---
  if (subPage === 'eventos') {
    const renderEventCategories = () => {
      const listEl = document.getElementById('settings-event-categories-list');
      if (!listEl) return;
      listEl.innerHTML = '';

      const categories = state.eventCategories || [];
      if (categories.length === 0) {
        listEl.innerHTML = `<li class="text-xs text-outline italic py-4 text-center bg-background/20 rounded-xl">No hay categorías configuradas</li>`;
        return;
      }

      categories.forEach((cat, index) => {
        const li = document.createElement('li');
        li.className = 'flex items-center justify-between bg-background/50 border border-outline-variant/10 rounded-xl px-3 py-2 gap-2';

        const isEditing = editingIndex && editingIndex.type === 'event' && editingIndex.index === index;

        if (isEditing) {
          li.innerHTML = `
            <input type="text" id="edit-event-cat-input-${index}" value="${cat}" 
              class="flex-1 bg-surface border border-outline-variant/30 rounded-lg px-2.5 py-1 text-xs text-outline focus:outline-none focus:ring-1 focus:ring-accent"/>
            <div class="flex items-center gap-1 shrink-0">
              <button class="save-event-cat-btn text-accent hover:text-accent/80 p-1 focus:outline-none">
                <span class="material-symbols-outlined text-base">check</span>
              </button>
              <button class="cancel-event-cat-btn text-outline hover:text-primary p-1 focus:outline-none">
                <span class="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          `;

          li.querySelector('.save-event-cat-btn').addEventListener('click', async (e) => {
            e.currentTarget.blur();
            const input = document.getElementById(`edit-event-cat-input-${index}`);
            const newName = input.value.trim();
            if (newName && newName !== cat) {
              const updatedArray = [...categories];
              updatedArray[index] = newName;
              await db.setEventCategories(updatedArray);
              editingIndex = null;
              renderEventCategories();
            }
          });

          li.querySelector('.cancel-event-cat-btn').addEventListener('click', (e) => {
            e.currentTarget.blur();
            editingIndex = null;
            renderEventCategories();
          });
        } else {
          li.innerHTML = `
            <span class="text-xs text-primary font-medium">${cat}</span>
            <div class="flex items-center gap-1.5 shrink-0">
              <button class="edit-event-cat-btn text-outline hover:text-primary p-1 focus:outline-none">
                <span class="material-symbols-outlined text-base">edit</span>
              </button>
              <button class="delete-event-cat-btn text-outline hover:text-error p-1 focus:outline-none">
                <span class="material-symbols-outlined text-base">delete</span>
              </button>
            </div>
          `;

          li.querySelector('.edit-event-cat-btn').addEventListener('click', (e) => {
            e.currentTarget.blur();
            editingIndex = { type: 'event', index };
            renderEventCategories();
          });

          li.querySelector('.delete-event-cat-btn').addEventListener('click', async (e) => {
            e.currentTarget.blur();
            if (confirm(`¿Estás seguro de que deseas eliminar la categoría de evento "${cat}"?`)) {
              const updatedArray = categories.filter((_, i) => i !== index);
              await db.setEventCategories(updatedArray);
              renderEventCategories();
            }
          });
        }

        listEl.appendChild(li);
      });
    };

    const form = document.getElementById('add-event-cat-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = document.getElementById('new-event-cat-name');
        const name = input.value.trim();
        if (name) {
          const arr = state.eventCategories || [];
          if (!arr.includes(name)) {
            await db.setEventCategories([...arr, name]);
          }
          input.value = '';
          renderEventCategories();
        }
      });
    }

    renderEventCategories();
  }
}
