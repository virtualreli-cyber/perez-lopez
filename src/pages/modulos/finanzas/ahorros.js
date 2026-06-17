import { Card } from '../../../components/Card.js';

/**
 * Renderiza la interfaz de Metas de Ahorro.
 * 
 * @param {Object} state - Estado global
 * @returns {string} HTML de la vista
 */
export function render(state) {
  const goal = state.savingsGoal;
  const pct = goal.target > 0 ? Math.min((goal.current / goal.target) * 100, 100) : 0;
  const formattedTarget = goal.target.toLocaleString('es-ES', { minimumFractionDigits: 2 });
  const formattedCurrent = goal.current.toLocaleString('es-ES', { minimumFractionDigits: 2 });
  const remaining = Math.max(goal.target - goal.current, 0);

  const content = `
    <!-- Menú de Sub-Páginas del Módulo Finanzas -->
    <div class="flex border-b border-outline-variant/20 mb-8 gap-1 overflow-x-auto pb-1 custom-scrollbar">
      <a href="#/finanzas/resumen" class="px-5 py-2.5 rounded-t-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 text-outline hover:text-primary hover:bg-white/50">Resumen</a>
      <a href="#/finanzas/transacciones" class="px-5 py-2.5 rounded-t-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 text-outline hover:text-primary hover:bg-white/50">Transacciones</a>
      <a href="#/finanzas/ahorros" class="px-5 py-2.5 rounded-t-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 bg-primary text-white">Metas de Ahorro</a>
      <a href="#/finanzas/ajustes" class="px-5 py-2.5 rounded-t-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 text-outline hover:text-primary hover:bg-white/50">Ajustes</a>
    </div>

    <div class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-3xl font-bold text-primary tracking-tight mb-2">Metas de Ahorro</h2>
        <p class="text-base text-outline">Planifiquen sus sueños y sigan el progreso de sus ahorros.</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      <!-- Panel de Progreso Activo -->
      <div class="lg:col-span-7 space-y-6">
        ${Card({
          content: `
            <div class="flex justify-between items-start mb-6">
              <div>
                <span class="text-accent text-xs font-bold uppercase tracking-wider block">Meta Activa</span>
                <h3 class="text-2xl font-bold text-primary mt-1" id="goal-title-display">${goal.name}</h3>
              </div>
              <span class="material-symbols-outlined text-accent text-4xl">savings</span>
            </div>

            <!-- Termómetro de progreso -->
            <div class="my-8">
              <div class="w-full h-5 bg-outline-variant/30 rounded-full overflow-hidden relative shadow-inner">
                <div id="goal-progress-bar" class="h-full bg-gradient-to-r from-primary-light to-accent rounded-full transition-all duration-500 shadow-md" style="width: ${pct}%"></div>
                <span class="absolute inset-0 flex items-center justify-center text-[10px] font-extrabold text-primary" id="goal-pct-display">${pct.toFixed(0)}%</span>
              </div>
              
              <div class="flex justify-between text-xs font-bold text-primary mt-3">
                <span>Actual: €${formattedCurrent}</span>
                <span>Objetivo: €${formattedTarget}</span>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-outline-variant/10 pt-6 text-xs text-outline font-medium">
              <div>
                <span class="block text-outline/65">Fecha Límite:</span>
                <span class="font-bold text-primary text-sm" id="goal-deadline-display">
                  ${goal.deadline ? new Date(goal.deadline).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Sin fecha límite'}
                </span>
              </div>
              <div>
                <span class="block text-outline/65">Faltan por ahorrar:</span>
                <span class="font-bold text-accent text-sm">€${remaining.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          `
        })}

        <!-- Aportación Rápida -->
        ${Card({
          content: `
            <h3 class="text-sm font-bold text-primary mb-4 uppercase tracking-wider">Aportación Rápida</h3>
            <form id="quick-deposit-form" class="flex flex-col sm:flex-row gap-4 items-end">
              <div class="flex-1 w-full">
                <label class="text-[10px] font-bold text-outline uppercase block mb-1">Monto a Añadir (€)</label>
                <input type="number" id="deposit-amount" step="0.01" min="0.01" placeholder="Ej: 50.00" required
                  class="w-full bg-background border-none rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-accent placeholder-outline/50"/>
              </div>
              <div class="w-full sm:w-auto">
                <button type="submit" class="w-full bg-accent hover:bg-accent/90 text-white font-semibold rounded-full transition-colors flex items-center justify-center gap-1.5 text-xs px-8 py-3.5">
                  <span class="material-symbols-outlined text-[16px]">add_circle</span> Añadir Ahorro
                </button>
              </div>
            </form>
          `
        })}
      </div>

      <!-- Configuración / Edición de la Meta -->
      <div class="lg:col-span-5">
        ${Card({
          content: `
            <h3 class="text-sm font-bold text-primary mb-4 uppercase tracking-wider">Ajustes de la Meta</h3>
            <form id="edit-goal-form" class="space-y-4">
              <div>
                <label class="text-[10px] font-bold text-outline uppercase block mb-1">Nombre de la Meta</label>
                <input type="text" id="edit-goal-name" value="${goal.name}" required
                  class="w-full bg-background border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent placeholder-outline/50"/>
              </div>

              <div>
                <label class="text-[10px] font-bold text-outline uppercase block mb-1">Monto Objetivo (€)</label>
                <input type="number" id="edit-goal-target" step="0.01" min="0.01" value="${goal.target}" required
                  class="w-full bg-background border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent placeholder-outline/50"/>
              </div>

              <div>
                <label class="text-[10px] font-bold text-outline uppercase block mb-1">Monto Actual Guardado (€)</label>
                <input type="number" id="edit-goal-current" step="0.01" min="0" value="${goal.current}" required
                  class="w-full bg-background border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent placeholder-outline/50"/>
              </div>

              <div>
                <label class="text-[10px] font-bold text-outline uppercase block mb-1">Fecha Límite</label>
                <input type="date" id="edit-goal-deadline" value="${goal.deadline || ''}"
                  class="w-full bg-background border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent text-outline"/>
              </div>

              <div class="flex justify-end pt-2">
                <button type="submit" class="bg-primary hover:bg-primary-dark text-white font-semibold rounded-full transition-colors flex items-center justify-center gap-1.5 text-xs px-8 py-3.5">
                  <span class="material-symbols-outlined text-[16px]">save</span> Guardar Ajustes
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
 * Agrega la lógica interactiva del listado y formularios de metas de ahorro.
 * 
 * @param {Object} state - Estado global
 * @param {Object} db - Interfaz de base de datos
 */
export function init(state, db) {
  // Aportación rápida
  const quickForm = document.getElementById('quick-deposit-form');
  if (quickForm) {
    quickForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const depositVal = parseFloat(document.getElementById('deposit-amount').value);
      if (depositVal > 0) {
        const newCurrent = state.savingsGoal.current + depositVal;
        await db.updateSavingsGoal(state.savingsGoal.id, newCurrent, state.savingsGoal.target, state.savingsGoal.name);
        quickForm.reset();
      }
    });
  }

  // Edición completa de la meta
  const editForm = document.getElementById('edit-goal-form');
  if (editForm) {
    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('edit-goal-name').value.trim();
      const target = parseFloat(document.getElementById('edit-goal-target').value);
      const current = parseFloat(document.getElementById('edit-goal-current').value);
      const deadline = document.getElementById('edit-goal-deadline').value;

      // Actualizar en base de datos
      await db.updateSavingsGoal(state.savingsGoal.id, current, target, name);
      
      // La base de datos o el realtime actualizará la fecha límite si lo conectamos, 
      // pero por ahora para el fallback local de la meta activa:
      state.savingsGoal.deadline = deadline;
      
      // Forzar rerenderizado para mostrar los cambios
      location.hash = '#/finanzas/ahorros';
    });
  }
}
