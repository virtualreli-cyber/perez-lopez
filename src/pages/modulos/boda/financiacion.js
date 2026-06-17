import { Card } from '../../../components/Card.js';
import { InputField } from '../../../components/InputField.js';
import { Button } from '../../../components/Button.js';

let editingItemId = null;

/**
 * Renderiza la interfaz de Financiación y Presupuesto de la Boda.
 * 
 * @param {Object} state - Estado global
 * @returns {string} HTML de la vista
 */
export function render(state) {
  editingItemId = null;

  const content = `
    <!-- Menú de Sub-Páginas del Módulo Boda -->
    <div class="flex border-b border-outline-variant/20 mb-8 gap-1 overflow-x-auto pb-1 custom-scrollbar">
      <a href="#/boda/tareas" class="px-5 py-2.5 rounded-t-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 text-outline hover:text-primary hover:bg-white/50">Checklist Boda</a>
      <a href="#/boda/viaje" class="px-5 py-2.5 rounded-t-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 text-outline hover:text-primary hover:bg-white/50">Preparación Viaje</a>
      <a href="#/boda/financiacion" class="px-5 py-2.5 rounded-t-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 bg-primary text-white">Presupuesto Boda</a>
    </div>

    <div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-3xl font-bold text-primary tracking-tight mb-2">Presupuesto y Financiación</h2>
        <p class="text-base text-outline">Gestionen los pagos, proveedores y costes de la boda de forma integrada.</p>
      </div>
      <div>
        <button id="toggle-budget-form-btn" class="bg-accent hover:bg-accent/90 text-white font-semibold text-xs px-5 py-2.5 rounded-full transition-all flex items-center gap-2 shadow-md focus:ring-0 focus:outline-none">
          <span class="material-symbols-outlined text-[16px]" id="budget-form-btn-icon">add</span>
          <span id="budget-form-btn-text">Nuevo Concepto</span>
        </button>
      </div>
    </div>

    <!-- Formulario para Añadir Concepto -->
    <div id="add-budget-form-container" class="hidden mb-8 w-full">
      ${Card({
        content: `
          <h3 class="text-lg font-bold text-primary mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined">add_card</span> Añadir nuevo concepto al presupuesto
          </h3>
          
          <form id="add-budget-item-form" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label for="budget-item-category" class="block text-xs font-bold text-primary uppercase tracking-wider mb-1">Categoría</label>
                <select id="budget-item-category" class="w-full bg-background border-none rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-accent text-outline">
                  <option value="BANQUETE">Banquete</option>
                  <option value="FIESTA">Fiesta</option>
                  <option value="FOTO/VIDEO">Foto / Vídeo</option>
                  <option value="IGLESIA">Iglesia</option>
                  <option value="IMAGEN">Imagen</option>
                  <option value="REGALOS">Regalos</option>
                  <option value="VIAJE">Viaje</option>
                  <option value="OTROS">Otros</option>
                </select>
              </div>
              <div class="md:col-span-2">
                ${InputField({ id: 'budget-item-concept', label: 'Concepto / Proveedor', placeholder: 'Ej: Alquiler Finca, DJ Extra, Catering...', required: true })}
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
              ${InputField({ id: 'budget-item-total', label: 'Presupuesto Total (€)', type: 'number', placeholder: '0.00', required: true })}
              ${InputField({ id: 'budget-item-paid', label: 'Importe Pagado (€)', type: 'number', placeholder: '0.00', required: true })}
              ${InputField({ id: 'budget-item-next-date', label: 'Fecha Próximo Pago', placeholder: 'Ej: Julio' })}
              ${InputField({ id: 'budget-item-next-amount', label: 'Importe Próximo Pago', placeholder: 'Ej: 2.621€' })}
            </div>

            <div class="flex items-center justify-between border-t border-outline-variant/10 pt-4 flex-wrap gap-4">
              <label class="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" id="budget-item-is-gift" class="rounded border-outline-variant text-accent focus:ring-0 w-4 h-4 cursor-pointer" />
                <span class="text-xs font-bold text-primary">¿Es un regalo? <span class="text-[10px] text-outline font-normal">(como el vestido de novia, no cuenta en el coste real de la pareja)</span></span>
              </label>
              ${Button({ text: 'Añadir Concepto', icon: 'check', className: 'px-6 py-2.5 text-sm focus:ring-0 focus:outline-none' })}
            </div>
          </form>
        `
      })}
    </div>

    <!-- Cuadrícula Principal del Dashboard -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
      
      <!-- KPIs Resumen en la parte superior (5 Columnas) -->
      <div class="lg:col-span-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        <!-- KPI 1: Total Global -->
        <div class="bg-surface rounded-2xl p-6 border border-outline-variant/20 shadow-linen flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <span class="material-symbols-outlined">payments</span>
          </div>
          <div>
            <span class="text-[10px] text-outline font-bold uppercase tracking-wider block">Total Global</span>
            <span id="kpi-total-global" class="text-xl font-black text-primary">€0,00</span>
            <span class="text-[9px] text-outline block mt-0.5">Suma de todo el presupuesto</span>
          </div>
        </div>

        <!-- KPI 2: Total Real (sin regalos) -->
        <div class="bg-surface rounded-2xl p-6 border border-outline-variant/20 shadow-linen flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
            <span class="material-symbols-outlined">account_balance_wallet</span>
          </div>
          <div>
            <span class="text-[10px] text-outline font-bold uppercase tracking-wider block">Total Real (Pareja)</span>
            <span id="kpi-total-real" class="text-xl font-black text-accent">€0,00</span>
            <span class="text-[9px] text-outline block mt-0.5">Excluyendo regalos</span>
          </div>
        </div>

        <!-- KPI 3: Presupuesto Neto (sin cubierto) -->
        <div class="bg-surface rounded-2xl p-6 border border-outline-variant/20 shadow-linen flex flex-col justify-between h-full gap-2">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-wine/10 flex items-center justify-center text-wine shrink-0">
              <span class="material-symbols-outlined">savings</span>
            </div>
            <div class="min-w-0">
              <span class="text-[10px] text-outline font-bold uppercase tracking-wider block">Neto Pareja (Sin Cubierto)</span>
              <span id="kpi-total-neto" class="text-xl font-black text-wine">€0,00</span>
            </div>
          </div>
          <div class="w-full">
            <div class="flex justify-between items-center text-[9px] font-bold text-outline mb-1">
              <span id="kpi-neto-pct-text">0% pagado</span>
              <span id="kpi-neto-values-text">€0 / €0</span>
            </div>
            <div class="w-full h-1.5 bg-outline-variant/20 rounded-full overflow-hidden">
              <div id="kpi-neto-bar" class="h-full bg-wine rounded-full transition-all duration-500" style="width: 0%"></div>
            </div>
          </div>
        </div>

        <!-- KPI 4: Total Pagado (sin regalos) -->
        <div class="bg-surface rounded-2xl p-6 border border-outline-variant/20 shadow-linen flex flex-col justify-between h-full gap-2">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <span class="material-symbols-outlined">price_check</span>
            </div>
            <div class="min-w-0">
              <span class="text-[10px] text-outline font-bold uppercase tracking-wider block">Total Pagado</span>
              <span id="kpi-total-pagado" class="text-xl font-black text-primary">€0,00</span>
            </div>
          </div>
          <div class="w-full">
            <div class="flex justify-between items-center text-[9px] font-bold text-outline mb-1">
              <span id="kpi-pagado-pct-text">0% pagado</span>
              <span id="kpi-pagado-values-text">€0 / €0</span>
            </div>
            <div class="w-full h-1.5 bg-outline-variant/20 rounded-full overflow-hidden">
              <div id="kpi-pagado-bar" class="h-full bg-primary rounded-full transition-all duration-500" style="width: 0%"></div>
            </div>
          </div>
        </div>

        <!-- KPI 5: Pendiente Real -->
        <div class="bg-surface rounded-2xl p-6 border border-outline-variant/20 shadow-linen flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-error/10 flex items-center justify-center text-error shrink-0">
            <span class="material-symbols-outlined">pending_actions</span>
          </div>
          <div>
            <span class="text-[10px] text-outline font-bold uppercase tracking-wider block">Pendiente Real</span>
            <span id="kpi-pendiente-real" class="text-xl font-black text-error">€0,00</span>
            <span class="text-[9px] text-outline block mt-0.5">Restante por liquidar</span>
          </div>
        </div>
      </div>

      <!-- Fila de Banquete & Controles (Izquierda) e Historial (Derecha) -->
      
      <!-- Columna Izquierda: Parámetros e Invitados -->
      <div class="lg:col-span-4 space-y-6">
        <!-- Parámetros de la Boda -->
        ${Card({
          content: `
            <h3 class="text-sm font-bold text-primary mb-4 uppercase tracking-wider flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px]">group</span> Control de Invitados
            </h3>
            
            <div class="space-y-4">
              <div>
                <label for="input-wedding-guests" class="block text-xs font-bold text-primary uppercase tracking-wider mb-1">Invitados Estimados</label>
                <div class="relative flex items-center">
                  <input type="number" id="input-wedding-guests" value="${state.weddingGuests}" class="w-full bg-background border-none rounded-xl pl-4 pr-10 py-3 text-sm font-bold text-primary focus:ring-2 focus:ring-accent" />
                  <span class="absolute right-3 text-outline material-symbols-outlined text-lg">people</span>
                </div>
              </div>
              
              <div>
                <label for="input-catering-cost-pax" class="block text-xs font-bold text-primary uppercase tracking-wider mb-1">Coste Catering por Persona (€)</label>
                <div class="relative flex items-center">
                  <input type="number" step="0.01" id="input-catering-cost-pax" value="${state.weddingCostPax}" class="w-full bg-background border-none rounded-xl pl-4 pr-10 py-3 text-sm font-bold text-primary focus:ring-2 focus:ring-accent" />
                  <span class="absolute right-3 text-outline font-bold text-xs">€</span>
                </div>
              </div>

              <div class="pt-2">
                <button id="save-params-btn" class="w-full bg-primary hover:bg-primary-dark text-white font-semibold text-xs py-3 rounded-full transition-all flex items-center justify-center gap-2 select-none shadow-sm">
                  <span class="material-symbols-outlined text-[16px]">sync</span>
                  <span>Recalcular e Sincronizar</span>
                </button>
              </div>
            </div>
          `
        })}

        <!-- Desglose por Invitado del Banquete -->
        ${Card({
          content: `
            <div class="flex items-center justify-between mb-4 border-b border-outline-variant/15 pb-3">
              <h3 class="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px]">restaurant_menu</span> Costes por Cubierto
              </h3>
              <span id="pax-count-badge" class="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">280 invitados</span>
            </div>
            
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="border-b border-outline-variant/10">
                    <th class="pb-2 text-[10px] font-bold text-outline uppercase">Concepto</th>
                    <th class="pb-2 text-[10px] font-bold text-outline uppercase text-right">Total</th>
                    <th class="pb-2 text-[10px] font-bold text-outline uppercase text-right">Por Pax</th>
                  </tr>
                </thead>
                <tbody id="banquete-breakdown-rows" class="divide-y divide-outline-variant/5 text-xs">
                  <!-- Renderizado dinámicamente -->
                </tbody>
              </table>
            </div>

            <div class="mt-4 pt-3 border-t border-outline-variant/15 flex flex-col gap-1 text-center bg-background/50 rounded-xl p-3">
              <span class="text-[10px] text-outline font-bold uppercase">Coste Real de la Boda por Invitado</span>
              <span id="wedding-total-pax-cost" class="text-xl font-black text-accent">€0,00</span>
              <span class="text-[9px] text-outline font-medium">Boda completa (sin regalos) / invitados</span>
            </div>
          `
        })}
      </div>

      <!-- Columna Derecha: Tabla de Presupuesto Detallada (Permitiendo scroll natural) -->
      <div class="lg:col-span-8">
        ${Card({
          content: `
            <div class="flex items-center justify-between mb-4 border-b border-outline-variant/20 pb-4">
              <h3 class="text-lg font-bold text-primary flex items-center gap-2">
                <span class="material-symbols-outlined">list_alt</span> Desglose de Gastos
              </h3>
            </div>
            
            <div id="budget-categories-container" class="space-y-6">
              <!-- Renderizado dinámicamente -->
            </div>
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
  
  // Filtrar filas de totales si existieran en el estado (defensa contra semillas CSV literales)
  const getFilteredBudget = () => {
    return (state.weddingBudget || []).filter(item => {
      const cat = (item.category || '').trim().toUpperCase();
      return cat !== 'Z. TOTALES' && cat !== 'TOTALES';
    });
  };

  const renderKPIs = () => {
    const budget = getFilteredBudget();
    const N = state.weddingGuests || 280;
    const C = state.weddingCostPax || 90.00;
    
    // 1. Suma Global (con todos los conceptos reales)
    const totalGlobal = budget.reduce((sum, item) => sum + item.total, 0);
    
    // 2. Total Real de la Pareja (excluyendo regalos)
    const totalReal = budget.filter(item => !item.isGift).reduce((sum, item) => sum + item.total, 0);
    const totalPagadoReal = budget.filter(item => !item.isGift).reduce((sum, item) => sum + item.paid, 0);
    const pendienteReal = Math.max(totalReal - totalPagadoReal, 0);
    const pctPagado = totalReal > 0 ? ((totalPagadoReal / totalReal) * 100).toFixed(1) : '0.0';

    // 3. Neto Pareja (Descontando todo lo cubierto por los cubiertos/banquete de los invitados)
    // Conceptos considerados "dentro del cubierto": Catering (N * C), Finca (50%), Iluminación y DJ.
    // Para calcular este total, restamos las versiones contratadas de estos conceptos de la suma real.
    let totalSinCubierto = 0;
    let paidSinCubierto = 0;

    budget.forEach(item => {
      if (item.isGift) return; // Ignorar regalos de antemano

      const conceptLower = item.concept.toLowerCase();
      const isCatering = conceptLower.includes('catering');
      const isFinca = conceptLower.includes('finca');
      const isIlum = conceptLower.includes('iluminación') || conceptLower.includes('ilumiación');
      const isDJ = conceptLower.includes('dj') || conceptLower.includes('sonido');

      if (isCatering || isIlum || isDJ) {
        // Asumimos que entran al 100% dentro del cubierto, se descuentan
        return;
      }

      if (isFinca) {
        // La finca se asume al 50% cubierta por el banquete, por tanto la pareja asume el otro 50%
        totalSinCubierto += item.total / 2;
        paidSinCubierto += item.paid / 2;
      } else {
        // El resto de conceptos son pagados enteramente por la pareja
        totalSinCubierto += item.total;
        paidSinCubierto += item.paid;
      }
    });

    const pctNeto = totalSinCubierto > 0 ? ((paidSinCubierto / totalSinCubierto) * 100).toFixed(1) : '0.0';

    // Rellenar elementos DOM
    const elGlobal = document.getElementById('kpi-total-global');
    const elReal = document.getElementById('kpi-total-real');
    const elPagado = document.getElementById('kpi-total-pagado');
    const elPendiente = document.getElementById('kpi-pendiente-real');
    const elPctText = document.getElementById('kpi-pagado-pct-text');
    const elValText = document.getElementById('kpi-pagado-values-text');
    const elBar = document.getElementById('kpi-pagado-bar');

    const elNeto = document.getElementById('kpi-total-neto');
    const elNetoPctText = document.getElementById('kpi-neto-pct-text');
    const elNetoValText = document.getElementById('kpi-neto-values-text');
    const elNetoBar = document.getElementById('kpi-neto-bar');

    if (elGlobal) elGlobal.innerText = `€${totalGlobal.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (elReal) elReal.innerText = `€${totalReal.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (elPagado) elPagado.innerText = `€${totalPagadoReal.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (elPendiente) elPendiente.innerText = `€${pendienteReal.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    if (elPctText) elPctText.innerText = `${pctPagado}% pagado`;
    if (elValText) elValText.innerText = `€${totalPagadoReal.toLocaleString('es-ES', { maximumFractionDigits: 0 })} / €${totalReal.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`;
    if (elBar) elBar.style.width = `${Math.min(parseFloat(pctPagado), 100)}%`;

    if (elNeto) elNeto.innerText = `€${totalSinCubierto.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (elNetoPctText) elNetoPctText.innerText = `${pctNeto}% pagado`;
    if (elNetoValText) elNetoValText.innerText = `€${paidSinCubierto.toLocaleString('es-ES', { maximumFractionDigits: 0 })} / €${totalSinCubierto.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`;
    if (elNetoBar) elNetoBar.style.width = `${Math.min(parseFloat(pctNeto), 100)}%`;
  };

  const renderBanquete = () => {
    const budget = getFilteredBudget();
    const N = state.weddingGuests || 280;
    const C = state.weddingCostPax || 90.00;

    const badge = document.getElementById('pax-count-badge');
    if (badge) badge.innerText = `${N} invitados`;

    // Buscar Finca
    const fincaItem = budget.find(item => item.category === 'BANQUETE' && item.concept.toLowerCase().includes('finca'));
    const fincaTotal = fincaItem ? fincaItem.total : 5200.00;
    const fincaHalfTotal = fincaTotal / 2;

    // Buscar Iluminación
    const ilumItem = budget.find(item => item.category === 'BANQUETE' && item.concept.toLowerCase().includes('iluminación'));
    const ilumTotal = ilumItem ? ilumItem.total : 3086.00;

    // Buscar DJ
    const djItem = budget.find(item => item.category === 'FIESTA' && item.concept.toLowerCase().includes('dj'));
    const djTotal = djItem ? djItem.total : 2257.00;

    // Totales
    const cateringTotalVal = N * C;
    const fincaTotalVal = fincaHalfTotal;
    const ilumTotalVal = ilumTotal;
    const djTotalVal = djTotal;
    const banqueteTotalVal = cateringTotalVal + fincaTotalVal + ilumTotalVal + djTotalVal;

    // Por pax
    const cateringPaxVal = C;
    const fincaPaxVal = N > 0 ? fincaHalfTotal / N : 0;
    const ilumPaxVal = N > 0 ? ilumTotal / N : 0;
    const djPaxVal = N > 0 ? djTotal / N : 0;
    const banquetePaxVal = cateringPaxVal + fincaPaxVal + ilumPaxVal + djPaxVal;

    const tbody = document.getElementById('banquete-breakdown-rows');
    if (tbody) {
      tbody.innerHTML = `
        <tr class="hover:bg-white/30 transition-all border-b border-outline-variant/5">
          <td class="py-2.5 font-semibold text-primary">Catering (${N} pax x €${C.toLocaleString('es-ES', { minimumFractionDigits: 0 })})</td>
          <td class="py-2.5 text-right font-bold text-primary">€${cateringTotalVal.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td class="py-2.5 text-right font-bold text-accent">€${cateringPaxVal.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>
        <tr class="hover:bg-white/30 transition-all border-b border-outline-variant/5">
          <td class="py-2.5 font-semibold text-primary">Alquiler Finca (50%)</td>
          <td class="py-2.5 text-right font-bold text-primary">€${fincaTotalVal.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td class="py-2.5 text-right font-bold text-accent">€${fincaPaxVal.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>
        <tr class="hover:bg-white/30 transition-all border-b border-outline-variant/5">
          <td class="py-2.5 font-semibold text-primary">Iluminación</td>
          <td class="py-2.5 text-right font-bold text-primary">€${ilumTotalVal.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td class="py-2.5 text-right font-bold text-accent">€${ilumPaxVal.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>
        <tr class="hover:bg-white/30 transition-all border-b border-outline-variant/5">
          <td class="py-2.5 font-semibold text-primary">DJ + Sonido</td>
          <td class="py-2.5 text-right font-bold text-primary">€${djTotalVal.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td class="py-2.5 text-right font-bold text-accent">€${djPaxVal.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>
        <tr class="font-bold bg-primary/5">
          <td class="py-3 pl-2 text-primary rounded-l-xl">TOTAL BANQUETE</td>
          <td class="py-3 text-right text-primary">€${banqueteTotalVal.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td class="py-3 pr-2 text-right text-accent rounded-r-xl">€${banquetePaxVal.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>
      `;
    }

    // Coste real de la boda entera por invitado
    const totalReal = budget.filter(item => !item.isGift).reduce((sum, item) => sum + item.total, 0);
    const wholeWeddingPaxCost = N > 0 ? totalReal / N : 0;
    const elWholeCost = document.getElementById('wedding-total-pax-cost');
    if (elWholeCost) {
      elWholeCost.innerText = `€${wholeWeddingPaxCost.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / pax`;
    }
  };

  const renderBudgetList = () => {
    const container = document.getElementById('budget-categories-container');
    if (!container) return;

    container.innerHTML = '';
    const budget = getFilteredBudget();

    const categories = ['BANQUETE', 'FIESTA', 'FOTO/VIDEO', 'IGLESIA', 'IMAGEN', 'REGALOS', 'VIAJE', 'OTROS'];

    categories.forEach(catName => {
      const catItems = budget.filter(item => {
        const itemCat = (item.category || 'OTROS').toUpperCase();
        if (catName === 'OTROS') {
          return !['BANQUETE', 'FIESTA', 'FOTO/VIDEO', 'IGLESIA', 'IMAGEN', 'REGALOS', 'VIAJE'].includes(itemCat);
        }
        return itemCat === catName;
      });

      if (catItems.length === 0) return;

      // Calcular totales por categoría
      const catTotal = catItems.reduce((sum, item) => sum + item.total, 0);
      const catPaid = catItems.reduce((sum, item) => sum + item.paid, 0);
      const catPending = Math.max(catTotal - catPaid, 0);

      // Limpiar y securizar ID del selector (evitando barras '/' que rompen querySelector)
      const cleanCatId = `cat-items-list-${catName.replace(/[^A-Z0-9]/ig, '-')}`;

      // Crear sección de la categoría
      const catSection = document.createElement('div');
      catSection.className = 'bg-background/25 rounded-2xl p-4 border border-outline-variant/10 shadow-sm space-y-3';
      
      catSection.innerHTML = `
        <div class="flex items-center justify-between flex-wrap gap-2 border-b border-outline-variant/10 pb-2">
          <div class="flex items-center gap-2">
            <span class="text-xs font-black text-primary uppercase tracking-wider">${catName}</span>
            <span class="text-[10px] bg-primary/10 text-primary font-bold px-2.5 py-0.5 rounded-full">${catItems.length} concepto${catItems.length !== 1 ? 's' : ''}</span>
          </div>
          <div class="text-[10px] text-outline font-semibold flex items-center gap-3">
            <span>Total: <strong>€${catTotal.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</strong></span>
            <span class="text-success">Pagado: <strong>€${catPaid.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</strong></span>
            <span class="text-error">Pendiente: <strong>€${catPending.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</strong></span>
          </div>
        </div>
        <div class="divide-y divide-outline-variant/5" id="${cleanCatId}">
          <!-- Conceptos renderizados dinámicamente -->
        </div>
      `;

      container.appendChild(catSection);
      const itemsList = catSection.querySelector(`#${cleanCatId}`);

      catItems.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'transition-all duration-200';
        
        const isEditing = editingItemId === item.id;
        
        if (isEditing) {
          // MODO EDICIÓN INLINE
          itemEl.innerHTML = `
            <div class="bg-surface/50 p-4 rounded-xl border border-outline-variant/30 space-y-4 my-3 transition-all">
              <div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                <div class="md:col-span-4">
                  <label class="block text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Concepto / Proveedor</label>
                  <input type="text" id="edit-concept-${item.id}" value="${item.concept}" class="w-full bg-background border-none rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-accent text-outline font-semibold" required />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Presupuesto (€)</label>
                  <input type="number" step="0.01" id="edit-total-${item.id}" value="${item.total}" class="w-full bg-background border-none rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-accent text-outline font-semibold text-right" required />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Pagado (€)</label>
                  <input type="number" step="0.01" id="edit-paid-${item.id}" value="${item.paid}" class="w-full bg-background border-none rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-accent text-outline font-semibold text-right" required />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Fecha Pago</label>
                  <input type="text" id="edit-next-date-${item.id}" value="${item.nextPaymentDate}" class="w-full bg-background border-none rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-accent text-outline" placeholder="Ej: Julio" />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Importe Pago</label>
                  <input type="text" id="edit-next-amount-${item.id}" value="${item.nextPaymentAmount}" class="w-full bg-background border-none rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-accent text-outline" placeholder="Ej: 2.621€" />
                </div>
              </div>
              <div class="flex items-center justify-between border-t border-outline-variant/10 pt-3 flex-wrap gap-3">
                <label class="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" id="edit-is-gift-${item.id}" ${item.isGift ? 'checked' : ''} class="rounded border-outline-variant text-accent focus:ring-0 w-4 h-4 cursor-pointer" />
                  <span class="text-xs font-bold text-primary">¿Es un regalo? <span class="text-[10px] text-outline font-normal">(no cuenta en el gasto real)</span></span>
                </label>
                <div class="flex items-center gap-2">
                  <button class="save-edit-btn bg-accent hover:bg-accent/90 text-white font-semibold text-xs px-4 py-2 rounded-full transition-all flex items-center gap-1.5 shadow-sm focus:outline-none">
                    <span class="material-symbols-outlined text-[14px]">check</span>
                    <span>Guardar</span>
                  </button>
                  <button class="cancel-edit-btn bg-outline-variant/20 hover:bg-outline-variant/30 text-outline hover:text-primary font-semibold text-xs px-4 py-2 rounded-full transition-all flex items-center gap-1.5 focus:outline-none">
                    <span class="material-symbols-outlined text-[14px]">close</span>
                    <span>Cancelar</span>
                  </button>
                </div>
              </div>
            </div>
          `;

          const saveBtn = itemEl.querySelector('.save-edit-btn');
          const cancelBtn = itemEl.querySelector('.cancel-edit-btn');

          saveBtn.addEventListener('click', async (e) => {
            e.currentTarget.blur();
            const concept = itemEl.querySelector(`#edit-concept-${item.id}`).value.trim();
            const total = parseFloat(itemEl.querySelector(`#edit-total-${item.id}`).value) || 0;
            const paid = parseFloat(itemEl.querySelector(`#edit-paid-${item.id}`).value) || 0;
            const nextDate = itemEl.querySelector(`#edit-next-date-${item.id}`).value.trim();
            const nextAmount = itemEl.querySelector(`#edit-next-amount-${item.id}`).value.trim();
            const isGift = itemEl.querySelector(`#edit-is-gift-${item.id}`).checked;

            if (concept) {
              await db.updateWeddingBudgetItem(item.id, {
                category: item.category,
                concept,
                total,
                paid,
                nextPaymentDate: nextDate,
                nextPaymentAmount: nextAmount,
                pending: Math.max(total - paid, 0),
                isGift
              });
              editingItemId = null;
              renderAll();
            }
          });

          cancelBtn.addEventListener('click', (e) => {
            e.currentTarget.blur();
            editingItemId = null;
            renderAll();
          });

          // Soporte Enter y Escape
          const inputs = itemEl.querySelectorAll('input');
          inputs.forEach(input => {
            input.addEventListener('keydown', async (evt) => {
              if (evt.key === 'Enter') {
                evt.preventDefault();
                saveBtn.click();
              } else if (evt.key === 'Escape') {
                cancelBtn.click();
              }
            });
          });

        } else {
          // MODO LECTURA NORMAL
          const itemPending = Math.max(item.total - item.paid, 0);
          itemEl.innerHTML = `
            <div class="flex flex-col md:flex-row md:items-center justify-between py-3.5 hover:bg-white/40 transition-all px-2 rounded-xl group gap-4 border-b border-outline-variant/5 last:border-b-0">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="font-bold text-xs text-primary cursor-pointer hover:underline item-concept-click" title="Clic para editar">${item.concept}</span>
                  ${item.isGift ? '<span class="text-[8px] bg-accent/10 text-accent border border-accent/20 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Regalo</span>' : ''}
                </div>
                <div class="text-[10px] text-outline mt-1 flex gap-3 flex-wrap font-medium">
                  <span>Próximo pago: <strong class="text-primary">${item.nextPaymentDate || 'N/A'}</strong> ${item.nextPaymentAmount ? `(${item.nextPaymentAmount})` : ''}</span>
                </div>
              </div>
              <div class="grid grid-cols-3 md:flex md:items-center gap-6 text-right shrink-0">
                <div class="md:w-20">
                  <span class="block text-[8px] text-outline font-bold uppercase tracking-wider md:hidden mb-0.5">Total</span>
                  <span class="text-xs font-bold text-primary">€${item.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span>
                </div>
                <div class="md:w-20">
                  <span class="block text-[8px] text-outline font-bold uppercase tracking-wider md:hidden mb-0.5">Pagado</span>
                  <span class="text-xs font-bold text-success">€${item.paid.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span>
                </div>
                <div class="md:w-20">
                  <span class="block text-[8px] text-outline font-bold uppercase tracking-wider md:hidden mb-0.5">Pendiente</span>
                  <span class="text-xs font-bold text-error">€${itemPending.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
              <div class="flex items-center justify-end gap-1.5 shrink-0 border-l border-outline-variant/10 pl-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <button class="edit-item-btn text-outline hover:text-accent p-1 focus:outline-none" title="Editar">
                  <span class="material-symbols-outlined text-[16px]">edit</span>
                </button>
                <button class="delete-item-btn text-outline hover:text-error p-1 focus:outline-none" title="Eliminar">
                  <span class="material-symbols-outlined text-[16px]">delete</span>
                </button>
              </div>
            </div>
          `;

          const triggerEdit = () => {
            editingItemId = item.id;
            renderAll();
          };

          itemEl.querySelector('.item-concept-click').addEventListener('click', triggerEdit);
          itemEl.querySelector('.edit-item-btn').addEventListener('click', (e) => {
            e.currentTarget.blur();
            triggerEdit();
          });

          itemEl.querySelector('.delete-item-btn').addEventListener('click', async (e) => {
            e.currentTarget.blur();
            if (confirm(`¿Estás seguro de que deseas eliminar "${item.concept}" del presupuesto?`)) {
              await db.deleteWeddingBudgetItem(item.id);
            }
          });
        }

        itemsList.appendChild(itemEl);
      });
    });
  };

  const renderAll = () => {
    renderKPIs();
    renderBanquete();
    renderBudgetList();
  };

  // Sincronizar Invitados y Catering Cost Pax
  const triggerSaveParams = async () => {
    const inputGuests = document.getElementById('input-wedding-guests');
    const inputCostPax = document.getElementById('input-catering-cost-pax');
    if (!inputGuests || !inputCostPax) return;

    const count = parseInt(inputGuests.value) || 0;
    const pricePerPax = parseFloat(inputCostPax.value) || 0;
    await db.updateWeddingGuests(count, pricePerPax);
  };

  const saveBtn = document.getElementById('save-params-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', async (e) => {
      e.currentTarget.blur();
      await triggerSaveParams();
    });
  }

  const inputGuests = document.getElementById('input-wedding-guests');
  const inputCostPax = document.getElementById('input-catering-cost-pax');
  if (inputGuests) {
    inputGuests.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        inputGuests.blur();
        await triggerSaveParams();
      }
    });
  }
  if (inputCostPax) {
    inputCostPax.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        inputCostPax.blur();
        await triggerSaveParams();
      }
    });
  }

  // Toggle del Formulario para Añadir Concepto
  const toggleBtn = document.getElementById('toggle-budget-form-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.target.blur();
      const formContainer = document.getElementById('add-budget-form-container');
      const btnIcon = document.getElementById('budget-form-btn-icon');
      const btnText = document.getElementById('budget-form-btn-text');

      if (formContainer.classList.contains('hidden')) {
        formContainer.classList.remove('hidden');
        btnIcon.innerText = 'close';
        btnText.innerText = 'Cancelar';
      } else {
        formContainer.classList.add('hidden');
        btnIcon.innerText = 'add';
        btnText.innerText = 'Nuevo Concepto';
      }
    });
  }

  // Submit Formulario Añadir Concepto
  const form = document.getElementById('add-budget-item-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const catSelect = document.getElementById('budget-item-category');
      const conceptInput = document.getElementById('budget-item-concept');
      const totalInput = document.getElementById('budget-item-total');
      const paidInput = document.getElementById('budget-item-paid');
      const nextDateInput = document.getElementById('budget-item-next-date');
      const nextAmountInput = document.getElementById('budget-item-next-amount');
      const isGiftCheckbox = document.getElementById('budget-item-is-gift');

      const total = parseFloat(totalInput.value) || 0;
      const paid = parseFloat(paidInput.value) || 0;

      const item = {
        category: catSelect.value,
        concept: conceptInput.value.trim(),
        total,
        paid,
        nextPaymentDate: nextDateInput.value.trim(),
        nextPaymentAmount: nextAmountInput.value.trim(),
        pending: Math.max(total - paid, 0),
        isGift: isGiftCheckbox.checked
      };

      await db.addWeddingBudgetItem(item);
    });
  }

  renderAll();
}
