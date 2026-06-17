import { Card } from '../../../components/Card.js';

/**
 * Renderiza la vista del Resumen de Finanzas.
 * 
 * @param {Object} state - Estado global
 * @returns {string} HTML de la vista
 */
export function render(state) {
  // Calcular saldos de cuentas
  const accountsBalances = state.financesAccounts.map(acc => {
    // transacciones asociadas a la cuenta
    const trans = state.financesTransactions.filter(t => t.accountId === acc.id);
    const totalIncome = trans.filter(t => t.type === 'ingreso').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = trans.filter(t => t.type === 'gasto').reduce((sum, t) => sum + t.amount, 0);
    const currentBalance = acc.initialBalance + totalIncome - totalExpenses;
    return {
      ...acc,
      currentBalance
    };
  });

  const totalWealth = accountsBalances.reduce((sum, acc) => sum + acc.currentBalance, 0);

  // Calcular balances del mes actual
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Filtrar transacciones del mes actual
  const currentMonthTrans = state.financesTransactions.filter(t => {
    const tDate = new Date(t.date);
    return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
  });

  const monthlyIncome = currentMonthTrans.filter(t => t.type === 'ingreso').reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpenses = currentMonthTrans.filter(t => t.type === 'gasto').reduce((sum, t) => sum + t.amount, 0);
  const netCashflow = monthlyIncome - monthlyExpenses;

  // Reparto 50/50 de gastos del mes
  let israPaid = 0;
  let lidiaPaid = 0;
  let sharedPaid = 0;

  currentMonthTrans.filter(t => t.type === 'gasto').forEach(t => {
    if (t.payer === 'Isra') israPaid += t.amount;
    else if (t.payer === 'Lidia') lidiaPaid += t.amount;
    else sharedPaid += t.amount; // Compartido / 50/50
  });

  const totalMonthlyExpenses = israPaid + lidiaPaid + sharedPaid;
  
  // Aportación real en el mes (lo que pagó cada uno)
  const israActualContrib = israPaid;
  const lidiaActualContrib = lidiaPaid;
  
  // Balance: lo que debería haber pagado cada uno (50% del total)
  const halfExpense = totalMonthlyExpenses / 2;
  const balanceDifference = israActualContrib - halfExpense; // Si es positivo, Lidia le debe a Isra. Si es negativo, Isra le debe a Lidia.

  let splitText = '';
  let splitAction = '';
  
  if (totalMonthlyExpenses === 0) {
    splitText = 'No hay gastos registrados este mes.';
    splitAction = 'Todo está al día.';
  } else if (Math.abs(balanceDifference) < 0.01) {
    splitText = '¡Las cuentas están perfectamente equilibradas!';
    splitAction = 'Nadie debe nada a nadie.';
  } else if (balanceDifference > 0) {
    splitText = `Isra ha pagado más este mes. Diferencia acumulada: €${(totalMonthlyExpenses).toFixed(2)}`;
    splitAction = `Lidia debe transferir a Isra <strong>€${balanceDifference.toFixed(2)}</strong> para cuadrar 50/50.`;
  } else {
    splitText = `Lidia ha pagado más este mes. Diferencia acumulada: €${(totalMonthlyExpenses).toFixed(2)}`;
    splitAction = `Isra debe transferir a Lidia <strong>€${Math.abs(balanceDifference).toFixed(2)}</strong> para cuadrar 50/50.`;
  }

  // Categorías de gastos con montos del mes
  const categoryExpenses = state.financesCategories.filter(c => c.type === 'gasto').map(cat => {
    const total = currentMonthTrans
      .filter(t => t.type === 'gasto' && t.categoryId === cat.id)
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      ...cat,
      total
    };
  }).filter(c => c.total > 0).sort((a, b) => b.total - a.total);

  const content = `
    <!-- Menú de Sub-Páginas del Módulo Finanzas -->
    <div class="flex border-b border-outline-variant/20 mb-8 gap-1 overflow-x-auto pb-1 custom-scrollbar">
      <a href="#/finanzas/resumen" class="px-5 py-2.5 rounded-t-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 bg-primary text-white">Resumen</a>
      <a href="#/finanzas/transacciones" class="px-5 py-2.5 rounded-t-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 text-outline hover:text-primary hover:bg-white/50">Transacciones</a>
      <a href="#/finanzas/ahorros" class="px-5 py-2.5 rounded-t-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 text-outline hover:text-primary hover:bg-white/50">Metas de Ahorro</a>
      <a href="#/finanzas/ajustes" class="px-5 py-2.5 rounded-t-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 text-outline hover:text-primary hover:bg-white/50">Ajustes</a>
    </div>

    <div class="mb-6">
      <h2 class="text-3xl font-bold text-primary tracking-tight mb-1">Finanzas Compartidas</h2>
      <p class="text-base text-outline">Estado actual de sus cuentas bancarias, ingresos, gastos y reparto mensual.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      <!-- Bloque Izquierdo: Cuentas y Reparto -->
      <div class="lg:col-span-5 space-y-6">
        
        <!-- Saldo Total / Cuentas -->
        ${Card({
          content: `
            <div class="flex justify-between items-start mb-6">
              <div>
                <h3 class="text-sm font-bold text-primary uppercase tracking-wider">Saldo Total Neto</h3>
                <p class="text-4xl font-extrabold text-primary mt-1">€${totalWealth.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <span class="material-symbols-outlined text-accent text-3xl">account_balance_wallet</span>
            </div>
            
            <div class="space-y-3 mt-4">
              <h4 class="text-[10px] font-bold text-outline uppercase tracking-wider">Cuentas Bancarias</h4>
              ${accountsBalances.map(acc => `
                <div class="flex justify-between items-center p-3 rounded-xl bg-background/50 hover:bg-background transition-colors border border-outline-variant/10">
                  <div class="flex items-center gap-3">
                    <div class="w-3 h-3 rounded-full" style="background-color: ${acc.color || '#4A8B8B'}"></div>
                    <span class="text-sm font-semibold text-primary">${acc.name}</span>
                  </div>
                  <span class="text-sm font-bold text-primary">€${acc.currentBalance.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              `).join('')}
            </div>
          `
        })}

        <!-- Split / Reparto 50/50 -->
        <div class="bg-accent-light/70 rounded-2xl p-6 border border-accent/20 shadow-linen flex items-start gap-4">
          <span class="material-symbols-outlined text-accent text-3xl font-bold">swap_horiz</span>
          <div class="flex-1">
            <h4 class="text-sm font-bold text-primary">Cuentas Claras (Gasto Mensual)</h4>
            <p class="text-xs text-primary-light mt-1.5 font-medium">${splitText}</p>
            
            <div class="mt-4 grid grid-cols-2 gap-4 text-xs border-t border-accent/10 pt-3">
              <div>
                <span class="text-outline block">Isra pagó:</span>
                <span class="font-bold text-primary">€${israActualContrib.toFixed(2)}</span>
              </div>
              <div>
                <span class="text-outline block">Lidia pagó:</span>
                <span class="font-bold text-primary">€${lidiaActualContrib.toFixed(2)}</span>
              </div>
            </div>
            
            <div class="mt-4 p-3 bg-white/60 rounded-xl border border-accent/10 text-xs text-primary">
              ${splitAction}
            </div>
          </div>
        </div>

      </div>

      <!-- Bloque Derecho: Flujo de caja e informe mensual -->
      <div class="lg:col-span-7 space-y-6">
        
        <!-- Tarjetas Resumen Mensual (Ingresos vs Gastos) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div class="bg-white rounded-2xl p-5 border border-outline-variant/20 shadow-linen">
            <span class="text-outline text-[10px] font-bold uppercase tracking-wider block">Ingresos del Mes</span>
            <span class="text-2xl font-bold text-primary mt-1 block">€${monthlyIncome.toFixed(2)}</span>
            <span class="text-[9px] text-green-700 font-semibold bg-green-100 px-1.5 py-0.5 rounded mt-2 inline-block">Entradas</span>
          </div>

          <div class="bg-white rounded-2xl p-5 border border-outline-variant/20 shadow-linen">
            <span class="text-outline text-[10px] font-bold uppercase tracking-wider block">Gastos del Mes</span>
            <span class="text-2xl font-bold text-error mt-1 block">€${monthlyExpenses.toFixed(2)}</span>
            <span class="text-[9px] text-error font-semibold bg-error-container px-1.5 py-0.5 rounded mt-2 inline-block">Salidas</span>
          </div>

          <div class="bg-white rounded-2xl p-5 border border-outline-variant/20 shadow-linen">
            <span class="text-outline text-[10px] font-bold uppercase tracking-wider block">Flujo Neto</span>
            <span class="text-2xl font-bold ${netCashflow >= 0 ? 'text-primary' : 'text-error'} mt-1 block">
              ${netCashflow >= 0 ? '+' : ''}€${netCashflow.toFixed(2)}
            </span>
            <span class="text-[9px] font-semibold ${netCashflow >= 0 ? 'text-green-700 bg-green-100' : 'text-error bg-error-container'} px-1.5 py-0.5 rounded mt-2 inline-block">
              Balance Neto
            </span>
          </div>

        </div>

        <!-- Desglose de Gastos por Categoría -->
        ${Card({
          content: `
            <h3 class="text-sm font-bold text-primary mb-6 uppercase tracking-wider">Gastos por Categoría (${now.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })})</h3>
            
            ${categoryExpenses.length === 0 ? `
              <div class="text-sm text-outline italic py-8 text-center bg-background/20 rounded-xl">
                No hay transacciones de gastos este mes.
              </div>
            ` : `
              <div class="space-y-4">
                ${categoryExpenses.map(cat => {
                  const pct = totalMonthlyExpenses > 0 ? (cat.total / totalMonthlyExpenses) * 100 : 0;
                  return `
                    <div>
                      <div class="flex justify-between items-center text-xs font-bold text-primary mb-1">
                        <div class="flex items-center gap-2">
                          <span class="material-symbols-outlined text-[16px] text-accent">${cat.icon || 'star'}</span>
                          <span>${cat.name}</span>
                        </div>
                        <span>€${cat.total.toFixed(2)} (${pct.toFixed(0)}%)</span>
                      </div>
                      <div class="w-full h-2 bg-outline-variant/30 rounded-full overflow-hidden">
                        <div class="h-full bg-accent rounded-full transition-all duration-500" style="width: ${pct}%"></div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            `}
          `
        })}

      </div>

    </div>
  `;

  return content;
}

/**
 * Agrega comportamiento al resumen de finanzas.
 * 
 * @param {Object} state - Estado global
 * @param {Object} db - Interfaz de base de datos
 */
export function init(state, db) {
  // En resumen sólo mostramos gráficos e información estática derivada
}
