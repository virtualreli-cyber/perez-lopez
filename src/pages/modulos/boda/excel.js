import { Card } from '../../../components/Card.js';

/**
 * Renderiza la vista de Tabla Excel del Presupuesto de la Boda.
 * 
 * @param {Object} state - Estado global
 * @returns {string} HTML de la vista
 */
export function render(state) {
  return `
    <!-- Menú de Sub-Páginas del Módulo Boda -->
    <div class="flex border-b border-outline-variant/20 mb-8 gap-1 overflow-x-auto pb-1 custom-scrollbar">
      <a href="#/boda/tareas" class="px-5 py-2.5 rounded-t-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 text-outline hover:text-primary hover:bg-white/50">Checklist Boda</a>
      <a href="#/boda/viaje" class="px-5 py-2.5 rounded-t-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 text-outline hover:text-primary hover:bg-white/50">Preparación Viaje</a>
      <a href="#/boda/financiacion" class="px-5 py-2.5 rounded-t-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 text-outline hover:text-primary hover:bg-white/50">Presupuesto Boda</a>
      <a href="#/boda/excel" class="px-5 py-2.5 rounded-t-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 bg-primary text-white">Tabla Excel</a>
    </div>

    <div class="mb-6">
      <h2 class="text-3xl font-bold text-primary tracking-tight mb-2">Vista Detallada del Presupuesto</h2>
      <p class="text-base text-outline">Consulte y analice todos los conceptos y sumatorios en formato de hoja de cálculo.</p>
    </div>

    <!-- Contenedor de la Tabla en Ancho Completo -->
    <div class="w-full">
      ${Card({
        content: `
          <div class="flex items-center justify-between mb-4 border-b border-outline-variant/20 pb-4">
            <h3 class="text-lg font-bold text-primary flex items-center gap-2">
              <span class="material-symbols-outlined">table_view</span> Hoja de Gastos (Lectura)
            </h3>
            <span id="excel-item-count" class="text-xs bg-primary/10 text-primary font-bold px-3 py-1 rounded-full">Cargando...</span>
          </div>

          <div class="overflow-auto max-h-[650px] border border-outline-variant/25 rounded-xl bg-background/10 shadow-inner custom-scrollbar">
            <table class="w-full text-left border-collapse text-xs">
              <thead class="sticky top-0 bg-primary text-white z-10 shadow-sm">
                <tr>
                  <th class="p-3 font-bold uppercase tracking-wider">Categoría</th>
                  <th class="p-3 font-bold uppercase tracking-wider">Concepto / Proveedor</th>
                  <th class="p-3 font-bold uppercase tracking-wider text-right">Presupuesto</th>
                  <th class="p-3 font-bold uppercase tracking-wider text-right">Pagado</th>
                  <th class="p-3 font-bold uppercase tracking-wider text-right">Pendiente</th>
                  <th class="p-3 font-bold uppercase tracking-wider">Fecha Vto. Pago</th>
                  <th class="p-3 font-bold uppercase tracking-wider">Importe Prox. Pago</th>
                  <th class="p-3 font-bold uppercase tracking-wider text-center">Tipo</th>
                </tr>
              </thead>
              <tbody id="excel-table-rows" class="divide-y divide-outline-variant/15 bg-white">
                <tr>
                  <td colspan="8" class="p-6 text-center text-outline font-semibold">Cargando conceptos...</td>
                </tr>
              </tbody>
              <tfoot class="sticky bottom-0 bg-surface border-t border-outline-variant/20 font-bold z-10 text-primary">
                <tr id="excel-table-totals-row">
                  <!-- Rellenado dinámicamente -->
                </tr>
              </tfoot>
            </table>
          </div>
        `
      })}
    </div>
  `;
}

/**
 * Lógica de inicialización de la Vista Tabla Excel.
 * 
 * @param {Object} state - Estado global
 * @param {Object} db - Interfaz unificada de base de datos
 */
export function init(state, db) {
  // Filtrar filas de totales si existieran
  const getFilteredBudget = () => {
    return (state.weddingBudget || []).filter(item => {
      const cat = (item.category || '').trim().toUpperCase();
      return cat !== 'Z. TOTALES' && cat !== 'TOTALES';
    });
  };

  const formatCurrency = (val) => {
    return val.toLocaleString('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: val % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2
    });
  };

  const formatNextPaymentAmount = (val) => {
    if (!val) return '';
    const cleanVal = val.replace(/[€\s]/g, '').replace(',', '.');
    const num = parseFloat(cleanVal);
    if (!isNaN(num) && isFinite(num) && /^[0-9.,]+$/.test(cleanVal)) {
      return formatCurrency(num);
    }
    return val;
  };

  const renderTable = () => {
    const tbody = document.getElementById('excel-table-rows');
    const tfoot = document.getElementById('excel-table-totals-row');
    const countBadge = document.getElementById('excel-item-count');
    if (!tbody || !tfoot) return;

    const budget = getFilteredBudget();

    if (countBadge) {
      countBadge.innerText = `${budget.length} concepto${budget.length !== 1 ? 's' : ''}`;
    }

    if (budget.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="p-6 text-center text-outline font-semibold">No hay conceptos registrados.</td>
        </tr>
      `;
      tfoot.innerHTML = '';
      return;
    }

    const sortedBudget = [...budget].sort((a, b) => {
      const catComp = a.category.localeCompare(b.category);
      if (catComp !== 0) return catComp;
      return a.concept.localeCompare(b.concept);
    });

    tbody.innerHTML = sortedBudget.map((item, idx) => {
      const pending = Math.max(item.total - item.paid, 0);
      const isAlt = idx % 2 === 1;
      const rowBg = isAlt ? 'bg-background/5' : 'bg-white';
      
      return `
        <tr class="${rowBg} hover:bg-primary/5 transition-all border-b border-outline-variant/10 text-xs">
          <td class="p-3.5 font-bold text-primary uppercase text-[10px] tracking-wider">${item.category}</td>
          <td class="p-3.5 font-semibold text-charcoal max-w-[250px] truncate" title="${item.concept}">${item.concept}</td>
          <td class="p-3.5 text-right font-semibold text-charcoal">${formatCurrency(item.total)}</td>
          <td class="p-3.5 text-right font-semibold text-success">${formatCurrency(item.paid)}</td>
          <td class="p-3.5 text-right font-semibold text-error">${formatCurrency(pending)}</td>
          <td class="p-3.5 text-outline">${item.nextPaymentDate || '-'}</td>
          <td class="p-3.5 text-outline">${formatNextPaymentAmount(item.nextPaymentAmount) || '-'}</td>
          <td class="p-3.5 text-center">
            ${item.isGift 
              ? '<span class="text-[9px] bg-accent/10 text-accent font-bold px-2 py-0.5 rounded-full border border-accent/20">Regalo</span>' 
              : '<span class="text-[9px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full border border-primary/20">Pareja</span>'
            }
          </td>
        </tr>
      `;
    }).join('');

    const totalGlobal = budget.reduce((sum, item) => sum + item.total, 0);
    const totalPaid = budget.reduce((sum, item) => sum + item.paid, 0);
    const totalPending = Math.max(totalGlobal - totalPaid, 0);

    tfoot.innerHTML = `
      <td colspan="2" class="p-4 text-primary font-black uppercase text-[10px] tracking-wider">TOTAL GENERAL</td>
      <td class="p-4 text-right font-black text-primary">${formatCurrency(totalGlobal)}</td>
      <td class="p-4 text-right font-black text-success">${formatCurrency(totalPaid)}</td>
      <td class="p-4 text-right font-black text-error">${formatCurrency(totalPending)}</td>
      <td colspan="3" class="p-4 text-outline/50 text-[10px] font-normal text-right">Valores acumulados (incluye regalos)</td>
    `;
  };

  renderTable();
}
