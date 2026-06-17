import { Card } from '../../../components/Card.js';

/**
 * Renderiza la interfaz de Ajustes de Finanzas (Cuentas y Categorías).
 * 
 * @param {Object} state - Estado global
 * @returns {string} HTML de la vista
 */
export function render(state) {
  const content = `
    <!-- Menú de Sub-Páginas del Módulo Finanzas -->
    <div class="flex border-b border-outline-variant/20 mb-8 gap-1 overflow-x-auto pb-1 custom-scrollbar">
      <a href="#/finanzas/resumen" class="px-5 py-2.5 rounded-t-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 text-outline hover:text-primary hover:bg-white/50">Resumen</a>
      <a href="#/finanzas/transacciones" class="px-5 py-2.5 rounded-t-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 text-outline hover:text-primary hover:bg-white/50">Transacciones</a>
      <a href="#/finanzas/ahorros" class="px-5 py-2.5 rounded-t-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 text-outline hover:text-primary hover:bg-white/50">Metas de Ahorro</a>
      <a href="#/finanzas/ajustes" class="px-5 py-2.5 rounded-t-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 bg-primary text-white">Ajustes</a>
    </div>

    <div class="mb-6">
      <h2 class="text-3xl font-bold text-primary tracking-tight mb-2">Ajustes de Finanzas</h2>
      <p class="text-base text-outline">Configuren sus cuentas bancarias, categorías de transacciones y subcategorías.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      <!-- Sección Izquierda: Cuentas Bancarias -->
      <div class="lg:col-span-5 space-y-6">
        
        <!-- Listado de Cuentas -->
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

        <!-- Registrar nueva cuenta -->
        ${Card({
          content: `
            <h3 class="text-sm font-bold text-primary mb-4 uppercase tracking-wider">Añadir Cuenta Bancaria</h3>
            <form id="add-account-form" class="space-y-4">
              <div>
                <label class="text-[10px] font-bold text-outline uppercase block mb-1">Nombre de la Cuenta</label>
                <input type="text" id="account-name" placeholder="Ej. BBVA Compartida, Revolut..." required
                  class="w-full bg-background border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent placeholder-outline/50"/>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-[10px] font-bold text-outline uppercase block mb-1">Saldo Inicial (€)</label>
                  <input type="number" id="account-balance" step="0.01" value="0.00" required
                    class="w-full bg-background border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent placeholder-outline/50"/>
                </div>
                <div>
                  <label class="text-[10px] font-bold text-outline uppercase block mb-1">Color Identificador</label>
                  <input type="color" id="account-color" value="#4A8B8B"
                    class="w-full h-11 bg-background border-none rounded-xl px-2 py-1 focus:ring-2 focus:ring-accent cursor-pointer"/>
                </div>
              </div>

              <div class="flex justify-end pt-2">
                <button type="submit" class="bg-primary hover:bg-primary-dark text-white font-semibold rounded-full transition-colors flex items-center justify-center gap-1.5 text-xs px-6 py-3">
                  <span class="material-symbols-outlined text-[16px]">add</span> Crear Cuenta
                </button>
              </div>
            </form>
          `
        })}

      </div>

      <!-- Sección Derecha: Categorías y Subcategorías -->
      <div class="lg:col-span-7 space-y-6">
        
        <!-- Listado de Categorías con sus subcategorías -->
        ${Card({
          content: `
            <h3 class="text-sm font-bold text-primary mb-4 uppercase tracking-wider">Categorías y Subcategorías</h3>
            <div class="space-y-4 max-h-[450px] overflow-y-auto custom-scrollbar pr-2" id="settings-categories-list">
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
                      <button class="delete-category-btn text-outline hover:text-error transition-colors p-1" data-id="${cat.id}" aria-label="Eliminar categoría">
                        <span class="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>

                    <!-- Subcategorías -->
                    <div class="pl-4 mt-2">
                      <div class="flex flex-wrap gap-2 mb-3">
                        ${subcats.map(sub => `
                          <span class="inline-flex items-center gap-1 bg-white text-primary border border-outline-variant/15 text-xs font-semibold px-2.5 py-1 rounded-lg">
                            <span>${sub.name}</span>
                            <button class="delete-subcategory-btn text-outline/50 hover:text-error transition-colors font-bold text-[10px]" data-id="${sub.id}">×</button>
                          </span>
                        `).join('')}
                        ${subcats.length === 0 ? '<span class="text-[10px] text-outline italic">Sin subcategorías registradas</span>' : ''}
                      </div>

                      <!-- Añadir Subcategoría rápida -->
                      <form class="add-subcategory-form flex gap-2 items-center" data-category-id="${cat.id}">
                        <input type="text" placeholder="Añadir subcategoría..." required
                          class="bg-white border-none rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-accent placeholder-outline/40 text-outline flex-1 max-w-[180px]"/>
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

        <!-- Crear nueva categoría -->
        ${Card({
          content: `
            <h3 class="text-sm font-bold text-primary mb-4 uppercase tracking-wider">Crear Categoría Principal</h3>
            <form id="add-category-form" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="text-[10px] font-bold text-outline uppercase block mb-1">Nombre de la Categoría</label>
                  <input type="text" id="category-name" placeholder="Ej. Transporte, Ocio..." required
                    class="w-full bg-background border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent placeholder-outline/50"/>
                </div>

                <div>
                  <label class="text-[10px] font-bold text-outline uppercase block mb-1">Tipo de Movimiento</label>
                  <select id="category-type" class="w-full bg-background border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent text-outline">
                    <option value="gasto">Gasto</option>
                    <option value="ingreso">Ingreso</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="text-[10px] font-bold text-outline uppercase block mb-1">Icono (Material Icon)</label>
                <input type="text" id="category-icon" value="payments" placeholder="restaurant, home, payments..." required
                  class="w-full bg-background border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent text-outline"/>
              </div>

              <div class="flex justify-end pt-2">
                <button type="submit" class="bg-primary hover:bg-primary-dark text-white font-semibold rounded-full transition-colors flex items-center justify-center gap-1.5 text-xs px-6 py-3">
                  <span class="material-symbols-outlined text-[16px]">add</span> Crear Categoría
                </button>
              </div>
            </form>
          `
        })}

      </div>

    </div>
  `;

  return content;
}

/**
 * Agrega comportamiento interactivo a la sección de ajustes.
 * 
 * @param {Object} state - Estado global
 * @param {Object} db - Interfaz de base de datos
 */
export function init(state, db) {
  // 1. Crear Cuenta
  const addAccountForm = document.getElementById('add-account-form');
  if (addAccountForm) {
    addAccountForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('account-name').value.trim();
      const balance = parseFloat(document.getElementById('account-balance').value);
      const color = document.getElementById('account-color').value;

      await db.addFinancesAccount(name, balance, color);
      addAccountForm.reset();
      location.hash = '#/finanzas/ajustes';
    });
  }

  // 2. Eliminar Cuenta
  const deleteAccountBtns = document.querySelectorAll('.delete-account-btn');
  deleteAccountBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = parseInt(btn.getAttribute('data-id'));
      if (confirm('¿Estás seguro de que deseas eliminar esta cuenta bancaria? Se eliminarán todas sus transacciones asociadas.')) {
        await db.deleteFinancesAccount(id);
        location.hash = '#/finanzas/ajustes';
      }
    });
  });

  // 3. Crear Categoría
  const addCategoryForm = document.getElementById('add-category-form');
  if (addCategoryForm) {
    addCategoryForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('category-name').value.trim();
      const type = document.getElementById('category-type').value;
      const icon = document.getElementById('category-icon').value.trim() || 'payments';

      await db.addFinancesCategory(name, type, icon);
      addCategoryForm.reset();
      location.hash = '#/finanzas/ajustes';
    });
  }

  // 4. Eliminar Categoría
  const deleteCategoryBtns = document.querySelectorAll('.delete-category-btn');
  deleteCategoryBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = parseInt(btn.getAttribute('data-id'));
      if (confirm('¿Estás seguro de que deseas eliminar esta categoría? Se eliminarán todas sus subcategorías asociadas.')) {
        await db.deleteFinancesCategory(id);
        location.hash = '#/finanzas/ajustes';
      }
    });
  });

  // 5. Crear Subcategoría
  const addSubcategoryForms = document.querySelectorAll('.add-subcategory-form');
  addSubcategoryForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const catId = parseInt(form.getAttribute('data-category-id'));
      const input = form.querySelector('input');
      const name = input.value.trim();

      if (name) {
        await db.addFinancesSubcategory(catId, name);
        input.value = '';
        location.hash = '#/finanzas/ajustes';
      }
    });
  });

  // 6. Eliminar Subcategoría
  const deleteSubcategoryBtns = document.querySelectorAll('.delete-subcategory-btn');
  deleteSubcategoryBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = parseInt(btn.getAttribute('data-id'));
      if (confirm('¿Eliminar esta subcategoría?')) {
        await db.deleteFinancesSubcategory(id);
        location.hash = '#/finanzas/ajustes';
      }
    });
  });
}
