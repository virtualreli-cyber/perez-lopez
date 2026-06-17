import { Card } from '../../../components/Card.js';
import { InputField } from '../../../components/InputField.js';
import { Button } from '../../../components/Button.js';

/**
 * Renderiza la interfaz de Financiación y Presupuesto de la Boda.
 * 
 * @param {Object} state - Estado global
 * @returns {string} HTML de la vista
 */
export function render(state) {
  const content = `
    <!-- Menú de Sub-Páginas del Módulo Boda -->
    <div class="flex border-b border-outline-variant/20 mb-8 gap-1 overflow-x-auto pb-1 custom-scrollbar">
      <a href="#/boda/tareas" class="px-5 py-2.5 rounded-t-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 text-outline hover:text-primary hover:bg-white/50">Checklist Boda</a>
      <a href="#/boda/viaje" class="px-5 py-2.5 rounded-t-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 text-outline hover:text-primary hover:bg-white/50">Preparación Viaje</a>
      <a href="#/boda/financiacion" class="px-5 py-2.5 rounded-t-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 bg-primary text-white">Presupuesto Boda</a>
    </div>

    <div class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-3xl font-bold text-primary tracking-tight mb-2">Presupuesto y Financiación</h2>
        <p class="text-base text-outline">Controlen los gastos de la boda. Límite máximo establecido: €20.000.</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      <!-- Balance General -->
      <div class="lg:col-span-4 space-y-6">
        ${Card({
          content: `
            <h3 class="text-sm font-bold text-primary mb-4 uppercase tracking-wider">Estado del Presupuesto</h3>
            <div class="flex justify-between items-end mb-2">
              <div>
                <span class="text-xs text-outline font-medium block">Gastado</span>
                <span id="wedding-spent-val" class="text-3xl font-bold text-primary">€0</span>
              </div>
              <div class="text-right">
                <span class="text-xs text-outline font-medium block">Objetivo Máx</span>
                <span class="text-sm font-bold text-primary">€20.000</span>
              </div>
            </div>

            <div class="w-full h-3.5 bg-outline-variant/30 rounded-full overflow-hidden mb-4">
              <div id="wedding-budget-pct-bar" class="h-full bg-accent rounded-full transition-all duration-500" style="width: 0%"></div>
            </div>

            <div class="grid grid-cols-2 gap-2 text-center pt-2 border-t border-outline-variant/10">
              <div>
                <span class="text-[10px] text-outline uppercase font-semibold">Disponible</span>
                <span id="wedding-avail-val" class="block text-sm font-bold text-primary mt-0.5">€0</span>
              </div>
              <div>
                <span class="text-[10px] text-outline uppercase font-semibold">Porcentaje</span>
                <span id="wedding-pct-val" class="block text-sm font-bold text-accent mt-0.5">0%</span>
              </div>
            </div>
          `
        })}

        ${Card({
          content: `
            <h3 class="text-sm font-bold text-primary mb-3 uppercase tracking-wider">Añadir Gasto Boda</h3>
            <form id="wedding-add-expense-form" class="space-y-3">
              ${InputField({ id: 'wedding-exp-desc', label: 'Concepto', placeholder: 'Ej: Flores del altar, Alianza Isra', required: true })}
              ${InputField({ id: 'wedding-exp-amount', label: 'Importe (€)', type: 'number', placeholder: '0.00', required: true })}
              <div>
                <label for="wedding-exp-payer" class="block text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Pagador</label>
                <select id="wedding-exp-payer" class="w-full bg-background border-none rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-accent text-outline">
                  <option value="Isra">Isra</option>
                  <option value="Lidia">Lidia</option>
                </select>
              </div>
              ${Button({ text: 'Añadir Gasto', icon: 'add_card', className: 'w-full py-3 text-sm' })}
            </form>
          `
        })}
      </div>

      <!-- Detalle de Gastos de la Boda -->
      <div class="lg:col-span-8">
        ${Card({
          content: `
            <h3 class="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <span class="material-symbols-outlined">receipt_long</span> Lista de Gastos Específicos
            </h3>
            <ul id="wedding-expenses-list" class="divide-y divide-outline-variant/10 max-h-[500px] overflow-y-auto pr-1">
              <!-- Se renderiza en init() -->
            </ul>
          `
        })}
      </div>

    </div>
  `;

  return content;
}

/**
 * Lógica de interactividad de la página Financiación Boda.
 * 
 * @param {Object} state - Estado global
 * @param {Object} db - Interfaz unificada de base de datos
 */
export function init(state, db) {
  const isWeddingExpense = (exp) => {
    const desc = exp.desc.toLowerCase();
    return desc.includes('boda') || desc.includes('vestido') || desc.includes('banquete') || desc.includes('fotógrafo') || desc.includes('alianza') || desc.includes('flores');
  };

  const renderAll = () => {
    // 1. Filtrar gastos relacionados con la boda
    const weddingExpenses = state.expenses.filter(isWeddingExpense);
    const calculatedSpent = weddingExpenses.reduce((sum, e) => sum + e.amount, 0);
    // Base de 12.500 como estimación base de banquetes/señales previas
    const totalSpent = calculatedSpent + 12500;
    const limit = 20000;
    const pct = Math.min((totalSpent / limit) * 100, 100).toFixed(1);

    const spentEl = document.getElementById('wedding-spent-val');
    const availEl = document.getElementById('wedding-avail-val');
    const pctEl = document.getElementById('wedding-pct-val');
    const barEl = document.getElementById('wedding-budget-pct-bar');

    if (spentEl) spentEl.innerText = `€${totalSpent.toLocaleString('es-ES')}`;
    if (availEl) availEl.innerText = `€${Math.max(limit - totalSpent, 0).toLocaleString('es-ES')}`;
    if (pctEl) pctEl.innerText = `${pct}%`;
    if (barEl) barEl.style.width = `${pct}%`;

    // 2. Renderizar listado de gastos de boda
    const listEl = document.getElementById('wedding-expenses-list');
    if (!listEl) return;

    listEl.innerHTML = '';

    // Añadir línea base ficticia (para coincidir con el gasto inicial base)
    listEl.innerHTML += `
      <li class="flex items-center justify-between py-3.5">
        <div>
          <p class="text-xs font-bold text-primary">Señales previas y Banquete (Base)</p>
          <p class="text-[10px] text-outline mt-0.5">Estimado inicial acumulado</p>
        </div>
        <div class="text-right">
          <p class="text-xs font-bold text-primary">€12.500,00</p>
          <span class="text-[9px] text-outline font-semibold px-2 py-0.5 bg-background rounded-full">Suscripción</span>
        </div>
      </li>
    `;

    if (weddingExpenses.length > 0) {
      weddingExpenses.forEach(exp => {
        const li = document.createElement('li');
        li.className = 'flex items-center justify-between py-3.5 group';
        li.innerHTML = `
          <div>
            <p class="text-xs font-bold text-primary">${exp.desc}</p>
            <p class="text-[10px] text-outline mt-0.5">${exp.date} — Pagado por ${exp.payer}</p>
          </div>
          <div class="flex items-center gap-3">
            <p class="text-xs font-bold text-accent">€${exp.amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</p>
            <button class="delete-exp-btn text-outline hover:text-error lg:opacity-0 lg:group-hover:opacity-100 focus:opacity-100 transition-opacity p-1" aria-label="Eliminar gasto">
              <span class="material-symbols-outlined text-sm">delete</span>
            </button>
          </div>
        `;

        li.querySelector('.delete-exp-btn').addEventListener('click', async () => {
          if (confirm(`¿Estás seguro de que deseas eliminar el gasto "${exp.desc}"?`)) {
            await db.deleteExpense(exp.id);
          }
        });

        listEl.appendChild(li);
      });
    }
  };

  // Guardar nuevo gasto
  const form = document.getElementById('wedding-add-expense-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const descEl = document.getElementById('wedding-exp-desc');
      const amountEl = document.getElementById('wedding-exp-amount');
      const payerEl = document.getElementById('wedding-exp-payer');

      const desc = `Boda: ${descEl.value.trim()}`;
      const amount = parseFloat(amountEl.value);
      const payer = payerEl.value;

      await db.addExpense(desc, amount, payer);

      descEl.value = '';
      amountEl.value = '';
    });
  }

  renderAll();
}
