import { LayoutBase } from '../layouts/LayoutBase.js';
import { supabase } from '../lib/supabaseClient.js';

import { render as renderDashboard, init as initDashboard } from './dashboard.js';
import { render as renderAjustes, init as initAjustes } from './modulos/ajustes.js';
import { render as renderBodaTareas, init as initBodaTareas } from './modulos/boda/tareas.js';
import { render as renderBodaViaje, init as initBodaViaje } from './modulos/boda/viaje.js';
import { render as renderBodaFinanciacion, init as initBodaFinanciacion } from './modulos/boda/financiacion.js';
import { render as renderHogarCompras, init as initHogarCompras } from './modulos/hogar/compras.js';
import { render as renderEventos, init as initEventos } from './modulos/eventos/eventos.js';
import { render as renderFinanzasResumen, init as initFinanzasResumen } from './modulos/finanzas/resumen.js';
import { render as renderFinanzasTransacciones, init as initFinanzasTransacciones } from './modulos/finanzas/transacciones.js';
import { render as renderFinanzasAhorros, init as initFinanzasAhorros } from './modulos/finanzas/ahorros.js';
import { render as renderFinanzasAjustes, init as initFinanzasAjustes } from './modulos/finanzas/ajustes.js';

// --- ESTADO EN MEMORIA ---
let state = {
  parejaId: null,
  modulesConfig: [],
  shopping: [],
  weddingTasks: [],
  expenses: [], // Mantener para compatibilidad con Dashboard
  events: [],
  tripTasks: [],
  shoppingCategories: [],
  activeShoppingFilter: 'all',
  activeShoppingCategoryFilter: 'all',
  savingsGoal: { id: null, name: 'Ahorros Viaje', target: 5000, current: 4250, deadline: '2026-08-16' },
  financesAccounts: [],
  financesCategories: [],
  financesSubcategories: [],
  financesTransactions: [],
  activeFinancesFilterAccount: 'all',
  activeFinancesFilterCategory: 'all',
  activeFinancesFilterType: 'all',
  activeFinancesSearchQuery: ''
};

// --- DATA SEED POR DEFECTO (FALLBACK LOCALSTORAGE) ---
const defaultModulesConfig = [
  { key: 'dashboard', label: 'Dashboard', icon: 'dashboard', path: '#/dashboard', activo: true },
  { key: 'boda', label: 'Boda', icon: 'celebration', path: '#/boda/tareas', activo: true },
  { key: 'hogar', label: 'Hogar', icon: 'home', path: '#/hogar/compras', activo: true },
  { key: 'finanzas', label: 'Finanzas', icon: 'payments', path: '#/finanzas/resumen', activo: true },
  { key: 'eventos', label: 'Eventos', icon: 'event', path: '#/eventos', activo: true }
];

const defaultShopping = [
  { id: 1, name: 'Comprar aguacates', qty: 3, category: 'Frutería', completed: false },
  { id: 2, name: 'Leche de avena', qty: 2, category: 'Supermercado', completed: true },
  { id: 3, name: 'Vino tinto reserva', qty: 1, category: 'Otros', completed: false },
  { id: 4, name: 'Papel de horno', qty: 1, category: 'Hogar', completed: false },
];

const defaultWeddingTasks = [
  { id: 1, title: 'Confirmar lista final de invitados', category: 'Invitados', completed: false },
  { id: 2, title: 'Degustación de menú y banquete', category: 'Banquete', completed: true },
  { id: 3, title: 'Prueba de vestido e invitaciones', category: 'Vestimenta', completed: false },
  { id: 4, title: 'Contratar fotógrafo y videógrafo', category: 'Logística', completed: true },
  { id: 5, title: 'Elegir banda de música / DJ', category: 'Logística', completed: false },
];

const defaultEvents = [
  { id: 1, title: 'Cena familiar de Lidia', date: '2026-06-20', time: '21:00', category: 'Familia' },
  { id: 2, title: 'Cita con la modista (Boda)', date: '2026-06-25', time: '17:30', category: 'Social' },
  { id: 3, title: 'Revisión anual dentista Isra', date: '2026-07-02', time: '10:00', category: 'Salud' },
  { id: 4, title: 'Escapada de fin de semana', date: '2026-07-15', time: '09:00', category: 'Otros' },
];

const defaultFinancesAccounts = [
  { id: 1, name: 'Cuenta Común BBVA', initialBalance: 1500.00, color: '#3E5219' },
  { id: 2, name: 'Revolut Compartida', initialBalance: 350.00, color: '#4A8B8B' },
  { id: 3, name: 'Efectivo en Casa', initialBalance: 80.00, color: '#2D3436' }
];

const defaultFinancesCategories = [
  { id: 1, name: 'Alimentación', type: 'gasto', icon: 'restaurant' },
  { id: 2, name: 'Hogar & Servicios', type: 'gasto', icon: 'home' },
  { id: 3, name: 'Ingresos & Nóminas', type: 'ingreso', icon: 'payments' },
  { id: 4, name: 'Ocio & Viajes', type: 'gasto', icon: 'flight' },
  { id: 5, name: 'Otros', type: 'gasto', icon: 'star' }
];

const defaultFinancesSubcategories = [
  { id: 1, categoryId: 1, name: 'Supermercado' },
  { id: 2, categoryId: 1, name: 'Restaurantes y Cafés' },
  { id: 3, categoryId: 2, name: 'Alquiler/Hipoteca' },
  { id: 4, categoryId: 2, name: 'Luz, Internet y Gas' },
  { id: 5, categoryId: 3, name: 'Nómina Isra' },
  { id: 6, categoryId: 3, name: 'Nómina Lidia' },
  { id: 7, categoryId: 4, name: 'Cine y Conciertos' },
  { id: 8, categoryId: 4, name: 'Hoteles/Transporte' },
  { id: 9, categoryId: 5, name: 'Gastos Varios' }
];

const defaultFinancesTransactions = [
  { id: 1, accountId: 1, categoryId: 2, subcategoryId: 3, type: 'gasto', desc: 'Alquiler del mes', amount: 950.00, payer: 'Lidia', date: '2026-06-10' },
  { id: 2, accountId: 1, categoryId: 1, subcategoryId: 1, type: 'gasto', desc: 'Compra semanal Mercadona', amount: 120.00, payer: 'Isra', date: '2026-06-12' },
  { id: 3, accountId: 2, categoryId: 1, subcategoryId: 2, type: 'gasto', desc: 'Cena aniversario restaurante', amount: 80.00, payer: 'Isra', date: '2026-06-15' },
  { id: 4, accountId: 1, categoryId: 2, subcategoryId: 4, type: 'gasto', desc: 'Factura Luz & Internet', amount: 150.00, payer: 'Lidia', date: '2026-06-16' },
  { id: 5, accountId: 3, categoryId: 5, subcategoryId: 9, type: 'gasto', desc: 'Mantenimiento del coche', amount: 150.00, payer: 'Isra', date: '2026-06-17' },
  { id: 6, accountId: 1, categoryId: 3, subcategoryId: 5, type: 'ingreso', desc: 'Nómina Isra', amount: 2100.00, payer: 'Isra', date: '2026-06-01' },
  { id: 7, accountId: 1, categoryId: 3, subcategoryId: 6, type: 'ingreso', desc: 'Nómina Lidia', amount: 2100.00, payer: 'Lidia', date: '2026-06-01' }
];

// --- CARGA INICIAL DE DATOS (SUPABASE O LOCALSTORAGE) ---

async function loadInitialData() {
  if (supabase) {
    try {
      console.log('Intentando conectar con base de datos de Supabase de forma pública...');
      
      // Crear una promesa de timeout de 7 segundos para evitar pantallas en blanco si la red se cuelga (útil para despertar base de datos pausada)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout al conectar con Supabase (7s)')), 7000)
      );

      await Promise.race([
        (async () => {
          // 1. Obtener Pareja
          let { data: parejas, error: parejaErr } = await supabase.from('parejas').select('id').limit(1);
          if (parejaErr) throw parejaErr;
          
          if (!parejas || parejas.length === 0) {
            const { data: newPareja, error: insErr } = await supabase
              .from('parejas')
              .insert({ nombre_1: 'Isra', nombre_2: 'Lidia', plan_suscripcion: 'Premium' })
              .select()
              .single();
            if (insErr) throw insErr;
            state.parejaId = newPareja.id;
          } else {
            state.parejaId = parejas[0].id;
          }

          // 2. Cargar Configuración de Módulos (Tratando de unificar compatibilidad)
          let { data: modulos, error: modErr } = await supabase.from('modulos_config').select('*').order('id', { ascending: true });
          if (modErr) throw modErr;
          
          const keyToHash = {
            dashboard: '#/dashboard',
            boda: '#/boda/tareas',
            hogar: '#/hogar/compras',
            finanzas: '#/finanzas/resumen',
            eventos: '#/eventos'
          };

          if (!modulos || modulos.length === 0) {
            const { data: initMods, error: initModsErr } = await supabase
              .from('modulos_config')
              .insert(defaultModulesConfig.map(m => ({
                key_modulo: m.key,
                nombre_menu: m.label,
                icono: m.icon,
                ruta_url: m.path,
                activo: m.activo
              })))
              .select();
            if (initModsErr) throw initModsErr;
            state.modulesConfig = initMods.map(m => ({
              key: m.key_modulo, label: m.nombre_menu, icon: m.icono, path: keyToHash[m.key_modulo] || m.ruta_url, activo: m.activo
            }));
          } else {
            const newModulesMap = {
              dashboard: { key: 'dashboard', label: 'Dashboard', icon: 'dashboard', path: '#/dashboard', activo: true },
              wedding: { key: 'boda', label: 'Boda', icon: 'celebration', path: '#/boda/tareas', activo: true },
              boda: { key: 'boda', label: 'Boda', icon: 'celebration', path: '#/boda/tareas', activo: true },
              compra: { key: 'hogar', label: 'Hogar', icon: 'home', path: '#/hogar/compras', activo: true },
              hogar: { key: 'hogar', label: 'Hogar', icon: 'home', path: '#/hogar/compras', activo: true },
              finance: { key: 'finanzas', label: 'Finanzas', icon: 'payments', path: '#/finanzas/resumen', activo: true },
              finanzas: { key: 'finanzas', label: 'Finanzas', icon: 'payments', path: '#/finanzas/resumen', activo: true },
              events: { key: 'eventos', label: 'Eventos', icon: 'event', path: '#/eventos', activo: true },
              eventos: { key: 'eventos', label: 'Eventos', icon: 'event', path: '#/eventos', activo: true }
            };

            const uniqueModules = {};
            modulos.forEach(m => {
              const mapped = newModulesMap[m.key_modulo];
              if (mapped) {
                uniqueModules[mapped.key] = {
                  ...mapped,
                  activo: uniqueModules[mapped.key] ? uniqueModules[mapped.key].activo && m.activo : m.activo
                };
              }
            });

            // Aseguramos los 5 principales
            ['dashboard', 'boda', 'hogar', 'finanzas', 'eventos'].forEach(key => {
              if (!uniqueModules[key]) {
                const def = defaultModulesConfig.find(dm => dm.key === key);
                if (def) uniqueModules[key] = { ...def };
              }
            });

            state.modulesConfig = Object.values(uniqueModules);
          }

          // 3. Cargar compras
          let { data: comprasData, error: compErr } = await supabase
            .from('compras')
            .select('*')
            .eq('pareja_id', state.parejaId)
            .order('id', { ascending: true });
          if (compErr) throw compErr;
          state.shopping = comprasData.map(c => ({
            id: c.id, name: c.nombre, qty: c.cantidad, category: c.categoria, completed: c.completado
          }));

          // 4. Tareas de boda
          let { data: tareasData, error: tarErr } = await supabase
            .from('boda_tareas')
            .select('*')
            .eq('pareja_id', state.parejaId)
            .order('id', { ascending: true });
          if (tarErr) throw tarErr;
          state.weddingTasks = tareasData.map(t => ({
            id: t.id, title: t.titulo, category: t.categoria, completed: t.completado
          }));

          // 5. Cuentas Bancarias
          let { data: cuentasData, error: cErr } = await supabase
            .from('finanzas_cuentas')
            .select('*')
            .eq('pareja_id', state.parejaId)
            .order('id', { ascending: true });
          if (!cErr && cuentasData) {
            state.financesAccounts = cuentasData.map(c => ({
              id: c.id, name: c.nombre, initialBalance: parseFloat(c.saldo_inicial), color: c.color
            }));
          } else {
            state.financesAccounts = [...defaultFinancesAccounts];
          }

          // 6. Categorías Financieras
          let { data: catFinData, error: catFinErr } = await supabase
            .from('finanzas_categorias')
            .select('*')
            .eq('pareja_id', state.parejaId)
            .order('id', { ascending: true });
          if (!catFinErr && catFinData) {
            state.financesCategories = catFinData.map(c => ({
              id: c.id, name: c.nombre, type: c.tipo, icon: c.icono
            }));
          } else {
            state.financesCategories = [...defaultFinancesCategories];
          }

          // 7. Subcategorías Financieras
          let { data: subcatData, error: subcatErr } = await supabase
            .from('finanzas_subcategorias')
            .select('*')
            .order('id', { ascending: true });
          if (!subcatErr && subcatData) {
            state.financesSubcategories = subcatData.map(s => ({
              id: s.id, categoryId: s.categoria_id, name: s.nombre
            }));
          } else {
            state.financesSubcategories = [...defaultFinancesSubcategories];
          }

          // 8. Transacciones Financieras
          let { data: transData, error: tErr } = await supabase
            .from('finanzas_transacciones')
            .select('*')
            .eq('pareja_id', state.parejaId)
            .order('fecha', { ascending: false });
          if (!tErr && transData) {
            state.financesTransactions = transData.map(t => ({
              id: t.id, accountId: t.cuenta_id, categoryId: t.categoria_id, subcategoryId: t.subcategoria_id,
              type: t.tipo, desc: t.descripcion, amount: parseFloat(t.monto), payer: t.pagador, date: t.fecha
            }));
          } else {
            state.financesTransactions = [...defaultFinancesTransactions];
          }

          // Sincronizar state.expenses para compatibilidad
          state.expenses = state.financesTransactions.filter(t => t.type === 'gasto').map(t => ({
            id: t.id, desc: t.desc, amount: t.amount, payer: t.payer, date: t.date
          }));

          // 9. Eventos
          let { data: eventosData, error: evtErr } = await supabase
            .from('eventos')
            .select('*')
            .eq('pareja_id', state.parejaId)
            .order('fecha', { ascending: true });
          if (evtErr) throw evtErr;
          state.events = eventosData.map(e => ({
            id: e.id, title: e.titulo, date: e.fecha, time: e.hora, category: e.categoria, completed: e.completado || false
          }));

          // 10. Metas de Ahorro
          let { data: ahorrosData, error: ahorrosErr } = await supabase
            .from('ahorros_metas')
            .select('*')
            .eq('pareja_id', state.parejaId)
            .eq('activo', true)
            .limit(1);
          if (!ahorrosErr && ahorrosData && ahorrosData.length > 0) {
            state.savingsGoal = {
              id: ahorrosData[0].id,
              name: ahorrosData[0].nombre,
              target: parseFloat(ahorrosData[0].monto_objetivo),
              current: parseFloat(ahorrosData[0].monto_actual),
              deadline: ahorrosData[0].fecha_limite
            };
          }

          // 11. Tareas del Viaje
          let { data: viajeTareasData, error: vtErr } = await supabase
            .from('viaje_tareas')
            .select('*')
            .eq('pareja_id', state.parejaId)
            .order('id', { ascending: true });
          if (!vtErr) {
            state.tripTasks = viajeTareasData.map(t => ({
              id: t.id, title: t.titulo, category: t.categoria || 'Otros', completed: t.completado
            }));
          }

          // 12. Categorías de la Lista de la Compra
          let { data: catData, error: catErr } = await supabase
            .from('compra_categorias')
            .select('*')
            .eq('pareja_id', state.parejaId)
            .order('id', { ascending: true });
          if (!catErr && catData) {
            state.shoppingCategories = catData.map(c => ({
              id: c.id, name: c.nombre
            }));
          } else {
            state.shoppingCategories = [
              { id: 1, name: 'Alimentación' },
              { id: 2, name: 'Frutería' },
              { id: 3, name: 'Hogar' },
              { id: 4, name: 'Otros' }
            ];
          }

          console.log('Datos públicos cargados correctamente desde Supabase.');
        })(),
        timeoutPromise
      ]);
      return;
    } catch (err) {
      console.warn('La conexión con Supabase no se pudo establecer en el tiempo límite (usando LocalStorage como fallback):', err.message || err);
    }
  }

  // FALLBACK LOCALSTORAGE
  state.modulesConfig = JSON.parse(localStorage.getItem('state_modules_config')) || defaultModulesConfig;
  state.shopping = JSON.parse(localStorage.getItem('state_shopping')) || defaultShopping;
  state.weddingTasks = JSON.parse(localStorage.getItem('state_wedding')) || defaultWeddingTasks;
  state.events = JSON.parse(localStorage.getItem('state_events')) || defaultEvents;
  state.savingsGoal = JSON.parse(localStorage.getItem('state_savings_goal')) || { id: null, name: 'Ahorros Viaje', target: 5000, current: 4250, deadline: '2026-08-16' };
  
  const defaultTripTasks = [
    { id: 1, title: 'Reservar vuelos internacionales', category: 'Reservas', completed: true },
    { id: 2, title: 'Solicitar visado para Sri Lanka', category: 'Documentos', completed: false },
    { id: 3, title: 'Contratar seguro médico internacional', category: 'Documentos', completed: false },
    { id: 4, title: 'Reservar resorts sobre el agua en Maldivas', category: 'Reservas', completed: true },
    { id: 5, title: 'Preparar adaptador de corriente y botiquín', category: 'Equipaje', completed: false }
  ];
  state.tripTasks = JSON.parse(localStorage.getItem('state_trip_tasks')) || defaultTripTasks;
  state.shoppingCategories = JSON.parse(localStorage.getItem('state_shopping_categories')) || [
    { id: 1, name: 'Alimentación' },
    { id: 2, name: 'Frutería' },
    { id: 3, name: 'Hogar' },
    { id: 4, name: 'Otros' }
  ];

  // Cuentas, categorías, subcategorías y transacciones en local
  state.financesAccounts = JSON.parse(localStorage.getItem('state_finances_accounts')) || defaultFinancesAccounts;
  state.financesCategories = JSON.parse(localStorage.getItem('state_finances_categories')) || defaultFinancesCategories;
  state.financesSubcategories = JSON.parse(localStorage.getItem('state_finances_subcategories')) || defaultFinancesSubcategories;
  state.financesTransactions = JSON.parse(localStorage.getItem('state_finances_transactions')) || defaultFinancesTransactions;
  
  // Sincronizar expenses para compatibilidad
  state.expenses = state.financesTransactions.filter(t => t.type === 'gasto').map(t => ({
    id: t.id, desc: t.desc, amount: t.amount, payer: t.payer, date: t.date
  }));

  console.log('Datos cargados de forma local (LocalStorage).');
}

// Guardar datos en LocalStorage (Solo en modo Fallback)
function saveToLocalStorage() {
  localStorage.setItem('state_modules_config', JSON.stringify(state.modulesConfig));
  localStorage.setItem('state_shopping', JSON.stringify(state.shopping));
  localStorage.setItem('state_wedding', JSON.stringify(state.weddingTasks));
  localStorage.setItem('state_events', JSON.stringify(state.events));
  localStorage.setItem('state_savings_goal', JSON.stringify(state.savingsGoal));
  localStorage.setItem('state_trip_tasks', JSON.stringify(state.tripTasks));
  localStorage.setItem('state_shopping_categories', JSON.stringify(state.shoppingCategories));
  
  localStorage.setItem('state_finances_accounts', JSON.stringify(state.financesAccounts));
  localStorage.setItem('state_finances_categories', JSON.stringify(state.financesCategories));
  localStorage.setItem('state_finances_subcategories', JSON.stringify(state.financesSubcategories));
  localStorage.setItem('state_finances_transactions', JSON.stringify(state.financesTransactions));
}

// --- INTERFAZ DE BASE DE DATOS UNIFICADA (DB INTERFACE) CON ACTUALIZACIONES OPTIMISTAS ---

// Rerenderiza la vista actual basándose en el estado en memoria
function triggerRerender() {
  router();
}

export const db = {
  // --- COMPRA ---
  async addShoppingItem(name, qty, category) {
    const tempId = -Date.now();
    const newItem = { id: tempId, name, qty, category, completed: false };
    
    // Actualización optimista instantánea
    state.shopping.push(newItem);
    triggerRerender();

    if (supabase && state.parejaId) {
      try {
        const { data, error } = await supabase
          .from('compras')
          .insert({ pareja_id: state.parejaId, nombre: name, cantidad: qty, categoria: category, completado: false })
          .select()
          .single();
        if (!error && data) {
          // Reemplazar el elemento optimista por el real confirmado
          state.shopping = state.shopping.map(i => i.id === tempId ? { id: data.id, name: data.nombre, qty: data.cantidad, category: data.categoria, completed: data.completado } : i);
          return;
        }
        console.error('Error Supabase:', error);
      } catch (err) {
        console.error('Excepción al insertar en Supabase:', err);
      }
      // Si falla en Supabase, removemos el item temporal
      state.shopping = state.shopping.filter(i => i.id !== tempId);
      triggerRerender();
      return;
    }
    // Fallback Local
    newItem.id = Date.now();
    state.shopping.push(newItem);
    saveToLocalStorage();
    triggerRerender();
  },

  async toggleShoppingItem(id, completed) {
    // Actualización optimista instantánea
    state.shopping = state.shopping.map(i => i.id === id ? { ...i, completed } : i);
    triggerRerender();

    if (supabase) {
      const { error } = await supabase
        .from('compras')
        .update({ completado: completed })
        .eq('id', id);
      if (error) {
        console.error('Error al actualizar en Supabase:', error);
        // Revertir
        state.shopping = state.shopping.map(i => i.id === id ? { ...i, completed: !completed } : i);
        triggerRerender();
      }
    } else {
      saveToLocalStorage();
    }
  },

  async updateShoppingItem(id, updates) {
    const originalItem = state.shopping.find(i => i.id === id);
    if (!originalItem) return;

    // Actualización optimista
    state.shopping = state.shopping.map(i => i.id === id ? { ...i, ...updates } : i);
    triggerRerender();

    if (supabase) {
      const dbUpdates = {};
      if (updates.name !== undefined) dbUpdates.nombre = updates.name;
      if (updates.qty !== undefined) dbUpdates.cantidad = updates.qty;
      if (updates.category !== undefined) dbUpdates.categoria = updates.category;
      if (updates.completed !== undefined) dbUpdates.completado = updates.completed;

      const { error } = await supabase
        .from('compras')
        .update(dbUpdates)
        .eq('id', id);
      if (error) {
        console.error('Error al actualizar en Supabase:', error);
        state.shopping = state.shopping.map(i => i.id === id ? originalItem : i);
        triggerRerender();
      }
    } else {
      saveToLocalStorage();
    }
  },

  async deleteShoppingItem(id) {
    const originalItem = state.shopping.find(i => i.id === id);
    // Actualización optimista instantánea
    state.shopping = state.shopping.filter(i => i.id !== id);
    triggerRerender();

    if (supabase) {
      const { error } = await supabase.from('compras').delete().eq('id', id);
      if (error) {
        console.error('Error al eliminar en Supabase:', error);
        // Revertir
        if (originalItem) {
          state.shopping.push(originalItem);
          triggerRerender();
        }
      }
    } else {
      saveToLocalStorage();
    }
  },

  async deleteShoppingItems(ids) {
    const originalItems = [...state.shopping];
    state.shopping = state.shopping.filter(i => !ids.includes(i.id));
    triggerRerender();

    if (supabase) {
      const { error } = await supabase.from('compras').delete().in('id', ids);
      if (error) {
        console.error('Error Supabase:', error);
        state.shopping = originalItems;
        triggerRerender();
      }
    } else {
      saveToLocalStorage();
    }
  },

  async clearCompletedShopping() {
    const originalShopping = [...state.shopping];
    state.shopping = state.shopping.filter(i => !i.completed);
    triggerRerender();

    if (supabase && state.parejaId) {
      const { error } = await supabase
        .from('compras')
        .delete()
        .eq('pareja_id', state.parejaId)
        .eq('completado', true);
      if (error) {
        console.error('Error al limpiar compras en Supabase:', error);
        state.shopping = originalShopping;
        triggerRerender();
      }
    } else {
      saveToLocalStorage();
    }
  },

  // --- BODA ---
  async addWeddingTask(title, category) {
    const tempId = -Date.now();
    const newTask = { id: tempId, title, category, completed: false };

    state.weddingTasks.push(newTask);
    triggerRerender();

    if (supabase && state.parejaId) {
      try {
        const { data, error } = await supabase
          .from('boda_tareas')
          .insert({ pareja_id: state.parejaId, titulo: title, categoria: category, completado: false })
          .select()
          .single();
        if (!error && data) {
          state.weddingTasks = state.weddingTasks.map(t => t.id === tempId ? { id: data.id, title: data.titulo, category: data.categoria, completed: data.completado } : t);
          return;
        }
        console.error('Error Supabase:', error);
      } catch (err) {
        console.error('Excepción Supabase:', err);
      }
      state.weddingTasks = state.weddingTasks.filter(t => t.id !== tempId);
      triggerRerender();
      return;
    }
    newTask.id = Date.now();
    state.weddingTasks.push(newTask);
    saveToLocalStorage();
    triggerRerender();
  },

  async toggleWeddingTask(id, completed) {
    state.weddingTasks = state.weddingTasks.map(t => t.id === id ? { ...t, completed } : t);
    triggerRerender();

    if (supabase) {
      const { error } = await supabase
        .from('boda_tareas')
        .update({ completado: completed })
        .eq('id', id);
      if (error) {
        console.error('Error Supabase:', error);
        state.weddingTasks = state.weddingTasks.map(t => t.id === id ? { ...t, completed: !completed } : t);
        triggerRerender();
      }
    } else {
      saveToLocalStorage();
    }
  },

  async updateWeddingTask(id, updates) {
    const originalTask = state.weddingTasks.find(t => t.id === id);
    if (!originalTask) return;

    state.weddingTasks = state.weddingTasks.map(t => t.id === id ? { ...t, ...updates } : t);
    triggerRerender();

    if (supabase) {
      const dbUpdates = {};
      if (updates.title !== undefined) dbUpdates.titulo = updates.title;
      if (updates.category !== undefined) dbUpdates.categoria = updates.category;
      if (updates.completed !== undefined) dbUpdates.completado = updates.completed;

      const { error } = await supabase
        .from('boda_tareas')
        .update(dbUpdates)
        .eq('id', id);
      if (error) {
        console.error('Error al actualizar en Supabase:', error);
        state.weddingTasks = state.weddingTasks.map(t => t.id === id ? originalTask : t);
        triggerRerender();
      }
    } else {
      saveToLocalStorage();
    }
  },

  async deleteWeddingTask(id) {
    const originalTask = state.weddingTasks.find(t => t.id === id);
    state.weddingTasks = state.weddingTasks.filter(t => t.id !== id);
    triggerRerender();

    if (supabase) {
      const { error } = await supabase.from('boda_tareas').delete().eq('id', id);
      if (error) {
        console.error('Error Supabase:', error);
        if (originalTask) {
          state.weddingTasks.push(originalTask);
          triggerRerender();
        }
      }
    } else {
      saveToLocalStorage();
    }
  },

  async deleteWeddingTasks(ids) {
    const originalTasks = [...state.weddingTasks];
    state.weddingTasks = state.weddingTasks.filter(t => !ids.includes(t.id));
    triggerRerender();

    if (supabase) {
      const { error } = await supabase.from('boda_tareas').delete().in('id', ids);
      if (error) {
        console.error('Error Supabase:', error);
        state.weddingTasks = originalTasks;
        triggerRerender();
      }
    } else {
      saveToLocalStorage();
    }
  },

  // --- FINANZAS NUEVO MÓDULO ---
  // --- CUENTAS ---
  async addFinancesAccount(name, initialBalance, color) {
    const tempId = -Date.now();
    const newAccount = { id: tempId, name, initialBalance, color };
    state.financesAccounts.push(newAccount);
    triggerRerender();

    if (supabase && state.parejaId) {
      try {
        const { data, error } = await supabase
          .from('finanzas_cuentas')
          .insert({ pareja_id: state.parejaId, nombre: name, saldo_inicial: initialBalance, color })
          .select()
          .single();
        if (!error && data) {
          state.financesAccounts = state.financesAccounts.map(a => a.id === tempId ? { id: data.id, name: data.nombre, initialBalance: parseFloat(data.saldo_inicial), color: data.color } : a);
          return;
        }
        console.error('Error Supabase:', error);
      } catch (err) {
        console.error('Excepción Supabase:', err);
      }
      state.financesAccounts = state.financesAccounts.filter(a => a.id !== tempId);
      triggerRerender();
      return;
    }
    newAccount.id = Date.now();
    state.financesAccounts.push(newAccount);
    saveToLocalStorage();
    triggerRerender();
  },

  async updateFinancesAccount(id, name, initialBalance, color) {
    state.financesAccounts = state.financesAccounts.map(a => a.id === id ? { ...a, name, initialBalance, color } : a);
    triggerRerender();

    if (supabase) {
      const { error } = await supabase
        .from('finanzas_cuentas')
        .update({ nombre: name, saldo_inicial: initialBalance, color })
        .eq('id', id);
      if (error) console.error('Error Supabase:', error);
    } else {
      saveToLocalStorage();
    }
  },

  async deleteFinancesAccount(id) {
    const originalAccounts = [...state.financesAccounts];
    state.financesAccounts = state.financesAccounts.filter(a => a.id !== id);
    // Borrar transacciones de esta cuenta de forma optimista
    const originalTrans = [...state.financesTransactions];
    state.financesTransactions = state.financesTransactions.filter(t => t.accountId !== id);
    // Sincronizar expenses
    state.expenses = state.financesTransactions.filter(t => t.type === 'gasto').map(t => ({
      id: t.id, desc: t.desc, amount: t.amount, payer: t.payer, date: t.date
    }));
    triggerRerender();

    if (supabase) {
      const { error } = await supabase.from('finanzas_cuentas').delete().eq('id', id);
      if (error) {
        console.error('Error Supabase:', error);
        state.financesAccounts = originalAccounts;
        state.financesTransactions = originalTrans;
        state.expenses = state.financesTransactions.filter(t => t.type === 'gasto').map(t => ({
          id: t.id, desc: t.desc, amount: t.amount, payer: t.payer, date: t.date
        }));
        triggerRerender();
      }
    } else {
      saveToLocalStorage();
    }
  },

  // --- CATEGORÍAS ---
  async addFinancesCategory(name, type, icon = 'payments') {
    const tempId = -Date.now();
    const newCat = { id: tempId, name, type, icon };
    state.financesCategories.push(newCat);
    triggerRerender();

    if (supabase && state.parejaId) {
      try {
        const { data, error } = await supabase
          .from('finanzas_categorias')
          .insert({ pareja_id: state.parejaId, nombre: name, tipo: type, icono: icon })
          .select()
          .single();
        if (!error && data) {
          state.financesCategories = state.financesCategories.map(c => c.id === tempId ? { id: data.id, name: data.nombre, type: data.tipo, icon: data.icono } : c);
          return;
        }
        console.error('Error Supabase:', error);
      } catch (err) {
        console.error('Excepción Supabase:', err);
      }
      state.financesCategories = state.financesCategories.filter(c => c.id !== tempId);
      triggerRerender();
      return;
    }
    newCat.id = Date.now();
    state.financesCategories.push(newCat);
    saveToLocalStorage();
    triggerRerender();
  },

  async updateFinancesCategory(id, name, type, icon) {
    state.financesCategories = state.financesCategories.map(c => c.id === id ? { ...c, name, type, icon } : c);
    triggerRerender();

    if (supabase) {
      const { error } = await supabase
        .from('finanzas_categorias')
        .update({ nombre: name, tipo: type, icono: icon })
        .eq('id', id);
      if (error) console.error('Error Supabase:', error);
    } else {
      saveToLocalStorage();
    }
  },

  async deleteFinancesCategory(id) {
    const originalCats = [...state.financesCategories];
    const originalSubcats = [...state.financesSubcategories];
    const originalTrans = [...state.financesTransactions];

    state.financesCategories = state.financesCategories.filter(c => c.id !== id);
    state.financesSubcategories = state.financesSubcategories.filter(s => s.categoryId !== id);
    state.financesTransactions = state.financesTransactions.map(t => t.categoryId === id ? { ...t, categoryId: null, subcategoryId: null } : t);
    
    // Sincronizar expenses
    state.expenses = state.financesTransactions.filter(t => t.type === 'gasto').map(t => ({
      id: t.id, desc: t.desc, amount: t.amount, payer: t.payer, date: t.date
    }));
    triggerRerender();

    if (supabase) {
      const { error } = await supabase.from('finanzas_categorias').delete().eq('id', id);
      if (error) {
        console.error('Error Supabase:', error);
        state.financesCategories = originalCats;
        state.financesSubcategories = originalSubcats;
        state.financesTransactions = originalTrans;
        state.expenses = state.financesTransactions.filter(t => t.type === 'gasto').map(t => ({
          id: t.id, desc: t.desc, amount: t.amount, payer: t.payer, date: t.date
        }));
        triggerRerender();
      }
    } else {
      saveToLocalStorage();
    }
  },

  // --- SUBCATEGORÍAS ---
  async addFinancesSubcategory(categoryId, name) {
    const tempId = -Date.now();
    const newSub = { id: tempId, categoryId, name };
    state.financesSubcategories.push(newSub);
    triggerRerender();

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('finanzas_subcategorias')
          .insert({ categoria_id: categoryId, nombre: name })
          .select()
          .single();
        if (!error && data) {
          state.financesSubcategories = state.financesSubcategories.map(s => s.id === tempId ? { id: data.id, categoryId: data.categoria_id, name: data.nombre } : s);
          return;
        }
        console.error('Error Supabase:', error);
      } catch (err) {
        console.error('Excepción Supabase:', err);
      }
      state.financesSubcategories = state.financesSubcategories.filter(s => s.id !== tempId);
      triggerRerender();
      return;
    }
    newSub.id = Date.now();
    state.financesSubcategories.push(newSub);
    saveToLocalStorage();
    triggerRerender();
  },

  async deleteFinancesSubcategory(id) {
    const originalSub = [...state.financesSubcategories];
    const originalTrans = [...state.financesTransactions];

    state.financesSubcategories = state.financesSubcategories.filter(s => s.id !== id);
    state.financesTransactions = state.financesTransactions.map(t => t.subcategoryId === id ? { ...t, subcategoryId: null } : t);
    triggerRerender();

    if (supabase) {
      const { error } = await supabase.from('finanzas_subcategorias').delete().eq('id', id);
      if (error) {
        console.error('Error Supabase:', error);
        state.financesSubcategories = originalSub;
        state.financesTransactions = originalTrans;
        triggerRerender();
      }
    } else {
      saveToLocalStorage();
    }
  },

  // --- TRANSACCIONES ---
  async addFinancesTransaction(accountId, categoryId, subcategoryId, type, desc, amount, payer, date) {
    const tempId = -Date.now();
    const newTrans = {
      id: tempId,
      accountId: parseInt(accountId),
      categoryId: categoryId ? parseInt(categoryId) : null,
      subcategoryId: subcategoryId ? parseInt(subcategoryId) : null,
      type,
      desc,
      amount: parseFloat(amount),
      payer,
      date: date || new Date().toISOString().split('T')[0]
    };

    state.financesTransactions.unshift(newTrans);
    // Sincronizar expenses para compatibilidad
    state.expenses = state.financesTransactions.filter(t => t.type === 'gasto').map(t => ({
      id: t.id, desc: t.desc, amount: t.amount, payer: t.payer, date: t.date
    }));
    triggerRerender();

    if (supabase && state.parejaId) {
      try {
        const { data, error } = await supabase
          .from('finanzas_transacciones')
          .insert({
            pareja_id: state.parejaId,
            cuenta_id: accountId,
            categoria_id: categoryId || null,
            subcategoria_id: subcategoryId || null,
            tipo: type,
            descripcion: desc,
            monto: amount,
            pagador: payer,
            fecha: date || new Date().toISOString().split('T')[0]
          })
          .select()
          .single();
        if (!error && data) {
          state.financesTransactions = state.financesTransactions.map(t => t.id === tempId ? {
            id: data.id, accountId: data.cuenta_id, categoryId: data.categoria_id, subcategoryId: data.subcategoria_id,
            type: data.tipo, desc: data.descripcion, amount: parseFloat(data.monto), payer: data.pagador, date: data.fecha
          } : t);
          // Sincronizar expenses
          state.expenses = state.financesTransactions.filter(t => t.type === 'gasto').map(t => ({
            id: t.id, desc: t.desc, amount: t.amount, payer: t.payer, date: t.date
          }));
          triggerRerender();
          return;
        }
        console.error('Error Supabase:', error);
      } catch (err) {
        console.error('Excepción Supabase:', err);
      }
      state.financesTransactions = state.financesTransactions.filter(t => t.id !== tempId);
      state.expenses = state.financesTransactions.filter(t => t.type === 'gasto').map(t => ({
        id: t.id, desc: t.desc, amount: t.amount, payer: t.payer, date: t.date
      }));
      triggerRerender();
      return;
    }
    newTrans.id = Date.now();
    state.financesTransactions.unshift(newTrans);
    state.expenses = state.financesTransactions.filter(t => t.type === 'gasto').map(t => ({
      id: t.id, desc: t.desc, amount: t.amount, payer: t.payer, date: t.date
    }));
    saveToLocalStorage();
    triggerRerender();
  },

  async deleteFinancesTransaction(id) {
    const originalTrans = [...state.financesTransactions];
    state.financesTransactions = state.financesTransactions.filter(t => t.id !== id);
    state.expenses = state.financesTransactions.filter(t => t.type === 'gasto').map(t => ({
      id: t.id, desc: t.desc, amount: t.amount, payer: t.payer, date: t.date
    }));
    triggerRerender();

    if (supabase) {
      const { error } = await supabase.from('finanzas_transacciones').delete().eq('id', id);
      if (error) {
        console.error('Error Supabase:', error);
        state.financesTransactions = originalTrans;
        state.expenses = state.financesTransactions.filter(t => t.type === 'gasto').map(t => ({
          id: t.id, desc: t.desc, amount: t.amount, payer: t.payer, date: t.date
        }));
        triggerRerender();
      }
    } else {
      saveToLocalStorage();
    }
  },

  async deleteFinancesTransactions(ids) {
    const originalTrans = [...state.financesTransactions];
    state.financesTransactions = state.financesTransactions.filter(t => !ids.includes(t.id));
    state.expenses = state.financesTransactions.filter(t => t.type === 'gasto').map(t => ({
      id: t.id, desc: t.desc, amount: t.amount, payer: t.payer, date: t.date
    }));
    triggerRerender();

    if (supabase) {
      const { error } = await supabase.from('finanzas_transacciones').delete().in('id', ids);
      if (error) {
        console.error('Error Supabase:', error);
        state.financesTransactions = originalTrans;
        state.expenses = state.financesTransactions.filter(t => t.type === 'gasto').map(t => ({
          id: t.id, desc: t.desc, amount: t.amount, payer: t.payer, date: t.date
        }));
        triggerRerender();
      }
    } else {
      saveToLocalStorage();
    }
  },

  // Mantener compatibilidad con metodos antiguos
  async addExpense(desc, amount, payer) {
    await this.addFinancesTransaction(1, 5, 9, 'gasto', desc, amount, payer, new Date().toISOString().split('T')[0]);
  },
  async deleteExpense(id) {
    await this.deleteFinancesTransaction(id);
  },
  async deleteExpenses(ids) {
    await this.deleteFinancesTransactions(ids);
  },

  // --- EVENTOS ---
  async addEvent(title, date, time, category) {
    const tempId = -Date.now();
    const newEvt = { id: tempId, title, date, time, category, completed: false };

    state.events.push(newEvt);
    triggerRerender();

    if (supabase && state.parejaId) {
      try {
        const { data, error } = await supabase
          .from('eventos')
          .insert({ pareja_id: state.parejaId, titulo: title, fecha: date, hora: time, categoria: category, completado: false })
          .select()
          .single();
        if (!error && data) {
          state.events = state.events.map(e => e.id === tempId ? { id: data.id, title: data.titulo, date: data.fecha, time: data.hora, category: data.categoria, completed: data.completado || false } : e);
          return;
        }
        console.error('Error Supabase:', error);
      } catch (err) {
        console.error('Excepción Supabase:', err);
      }
      state.events = state.events.filter(e => e.id !== tempId);
      triggerRerender();
      return;
    }
    newEvt.id = Date.now();
    state.events.push(newEvt);
    saveToLocalStorage();
    triggerRerender();
  },

  async deleteEvent(id) {
    const originalEvent = state.events.find(e => e.id === id);
    state.events = state.events.filter(e => e.id !== id);
    triggerRerender();

    if (supabase) {
      const { error } = await supabase.from('eventos').delete().eq('id', id);
      if (error) {
        console.error('Error Supabase:', error);
        if (originalEvent) {
          state.events.push(originalEvent);
          triggerRerender();
        }
      }
    } else {
      saveToLocalStorage();
    }
  },

  async deleteEvents(ids) {
    const originalEvents = [...state.events];
    state.events = state.events.filter(e => !ids.includes(e.id));
    triggerRerender();

    if (supabase) {
      const { error } = await supabase.from('eventos').delete().in('id', ids);
      if (error) {
        console.error('Error Supabase:', error);
        state.events = originalEvents;
        triggerRerender();
      }
    } else {
      saveToLocalStorage();
    }
  },

  async updateEvent(id, { title, date, time, category, completed }) {
    const originalEvents = [...state.events];
    state.events = state.events.map(e => e.id === id ? { ...e, title, date, time, category, completed: completed !== undefined ? completed : e.completed } : e);
    triggerRerender();

    if (supabase) {
      const { error } = await supabase
        .from('eventos')
        .update({ titulo: title, fecha: date, hora: time, categoria: category, completado: completed })
        .eq('id', id);
      if (error) {
        console.error('Error Supabase:', error);
        state.events = originalEvents;
        triggerRerender();
      }
    } else {
      saveToLocalStorage();
    }
  },

  async toggleEvent(id, completed) {
    const originalEvents = [...state.events];
    state.events = state.events.map(e => e.id === id ? { ...e, completed } : e);
    triggerRerender();

    if (supabase) {
      const { error } = await supabase
        .from('eventos')
        .update({ completado: completed })
        .eq('id', id);
      if (error) {
        console.error('Error Supabase:', error);
        state.events = originalEvents;
        triggerRerender();
      }
    } else {
      saveToLocalStorage();
    }
  },

  // --- CONFIGURACIÓN DE MÓDULOS (AJUSTES) ---
  async toggleModule(key, activo) {
    state.modulesConfig = state.modulesConfig.map(m => m.key === key ? { ...m, activo } : m);
    triggerRerender();

    if (supabase) {
      const { error } = await supabase
        .from('modulos_config')
        .update({ activo })
        .eq('key_modulo', key);
      if (error) {
        console.error('Error Supabase:', error);
        state.modulesConfig = state.modulesConfig.map(m => m.key === key ? { ...m, activo: !activo } : m);
        triggerRerender();
      }
    } else {
      saveToLocalStorage();
    }
  },

  // --- METAS DE AHORRO ---
  async updateSavingsGoal(id, current, target, name) {
    if (supabase) {
      const targetId = id || state.savingsGoal.id;
      if (targetId) {
        const { error } = await supabase
          .from('ahorros_metas')
          .update({ monto_actual: current, monto_objetivo: target, nombre: name })
          .eq('id', targetId);
        if (error) console.error('Error al actualizar meta de ahorro en Supabase:', error);
      } else if (state.parejaId) {
        const { data, error } = await supabase
          .from('ahorros_metas')
          .insert({ pareja_id: state.parejaId, nombre: name, monto_objetivo: target, monto_actual: current, activo: true })
          .select()
          .single();
        if (!error && data) {
          state.savingsGoal.id = data.id;
        } else {
          console.error('Error al insertar meta de ahorro en Supabase:', error);
        }
      }
    }
    state.savingsGoal.current = current;
    state.savingsGoal.target = target;
    state.savingsGoal.name = name;
    saveToLocalStorage();
    triggerRerender();
  },

  // --- TAREAS DE VIAJE ---
  async addTripTask(title, category = 'Otros') {
    const tempId = -Date.now();
    const newTask = { id: tempId, title, category, completed: false };

    state.tripTasks.push(newTask);
    triggerRerender();

    if (supabase && state.parejaId) {
      try {
        const { data, error } = await supabase
          .from('viaje_tareas')
          .insert({ pareja_id: state.parejaId, titulo: title, categoria: category, completado: false })
          .select()
          .single();
        if (!error && data) {
          state.tripTasks = state.tripTasks.map(t => t.id === tempId ? { id: data.id, title: data.titulo, category: data.categoria || 'Otros', completed: data.completado } : t);
          return;
        }
        console.error('Error Supabase:', error);
      } catch (err) {
        console.error('Excepción Supabase:', err);
      }
      state.tripTasks = state.tripTasks.filter(t => t.id !== tempId);
      triggerRerender();
      return;
    }
    newTask.id = Date.now();
    state.tripTasks.push(newTask);
    saveToLocalStorage();
    triggerRerender();
  },

  async toggleTripTask(id, completed) {
    state.tripTasks = state.tripTasks.map(t => t.id === id ? { ...t, completed } : t);
    triggerRerender();

    if (supabase) {
      const { error } = await supabase
        .from('viaje_tareas')
        .update({ completado: completed })
        .eq('id', id);
      if (error) {
        console.error('Error Supabase:', error);
        state.tripTasks = state.tripTasks.map(t => t.id === id ? { ...t, completed: !completed } : t);
        triggerRerender();
      }
    } else {
      saveToLocalStorage();
    }
  },

  async updateTripTask(id, updates) {
    const originalTask = state.tripTasks.find(t => t.id === id);
    if (!originalTask) return;

    state.tripTasks = state.tripTasks.map(t => t.id === id ? { ...t, ...updates } : t);
    triggerRerender();

    if (supabase) {
      const dbUpdates = {};
      if (updates.title !== undefined) dbUpdates.titulo = updates.title;
      if (updates.category !== undefined) dbUpdates.categoria = updates.category;
      if (updates.completed !== undefined) dbUpdates.completado = updates.completed;

      const { error } = await supabase
        .from('viaje_tareas')
        .update(dbUpdates)
        .eq('id', id);
      if (error) {
        console.error('Error al actualizar en Supabase:', error);
        state.tripTasks = state.tripTasks.map(t => t.id === id ? originalTask : t);
        triggerRerender();
      }
    } else {
      saveToLocalStorage();
    }
  },

  async deleteTripTask(id) {
    const originalTask = state.tripTasks.find(t => t.id === id);
    state.tripTasks = state.tripTasks.filter(t => t.id !== id);
    triggerRerender();

    if (supabase) {
      const { error } = await supabase.from('viaje_tareas').delete().eq('id', id);
      if (error) {
        console.error('Error Supabase:', error);
        if (originalTask) {
          state.tripTasks.push(originalTask);
          triggerRerender();
        }
      }
    } else {
      saveToLocalStorage();
    }
  },

  async deleteTripTasks(ids) {
    const originalTasks = [...state.tripTasks];
    state.tripTasks = state.tripTasks.filter(t => !ids.includes(t.id));
    triggerRerender();

    if (supabase) {
      const { error } = await supabase.from('viaje_tareas').delete().in('id', ids);
      if (error) {
        console.error('Error Supabase:', error);
        state.tripTasks = originalTasks;
        triggerRerender();
      }
    } else {
      saveToLocalStorage();
    }
  },

  // --- CATEGORÍAS DE COMPRA ---
  async addShoppingCategory(name) {
    const tempId = -Date.now();
    const newCat = { id: tempId, name };
    state.shoppingCategories.push(newCat);
    triggerRerender();

    if (supabase && state.parejaId) {
      try {
        const { data, error } = await supabase
          .from('compra_categorias')
          .insert({ pareja_id: state.parejaId, nombre: name })
          .select()
          .single();
        if (!error && data) {
          state.shoppingCategories = state.shoppingCategories.map(c => c.id === tempId ? { id: data.id, name: data.nombre } : c);
          return;
        }
        console.error('Error Supabase:', error);
      } catch (err) {
        console.error('Excepción Supabase:', err);
      }
      state.shoppingCategories = state.shoppingCategories.filter(c => c.id !== tempId);
      triggerRerender();
      return;
    }
    newCat.id = Date.now();
    state.shoppingCategories.push(newCat);
    saveToLocalStorage();
    triggerRerender();
  },

  async updateShoppingCategory(id, name) {
    state.shoppingCategories = state.shoppingCategories.map(c => c.id === id ? { ...c, name } : c);
    triggerRerender();

    if (supabase) {
      const { error } = await supabase
        .from('compra_categorias')
        .update({ nombre: name })
        .eq('id', id);
      if (error) {
        console.error('Error Supabase:', error);
      }
    } else {
      saveToLocalStorage();
    }
  },

  async deleteShoppingCategory(id) {
    const originalCat = state.shoppingCategories.find(c => c.id === id);
    state.shoppingCategories = state.shoppingCategories.filter(c => c.id !== id);
    triggerRerender();

    if (supabase) {
      const { error } = await supabase.from('compra_categorias').delete().eq('id', id);
      if (error) {
        console.error('Error Supabase:', error);
        if (originalCat) {
          state.shoppingCategories.push(originalCat);
          triggerRerender();
        }
      }
    } else {
      saveToLocalStorage();
    }
  }
};

// --- SISTEMA DE ENRUTAMIENTO (ROUTER) ---

const routes = {
  '#/dashboard': { render: renderDashboard, init: initDashboard, tab: 'dashboard' },
  '#/boda/tareas': { render: renderBodaTareas, init: initBodaTareas, tab: 'boda/tareas' },
  '#/boda/viaje': { render: renderBodaViaje, init: initBodaViaje, tab: 'boda/viaje' },
  '#/boda/financiacion': { render: renderBodaFinanciacion, init: initBodaFinanciacion, tab: 'boda/financiacion' },
  '#/hogar/compras': { render: renderHogarCompras, init: initHogarCompras, tab: 'hogar/compras' },
  '#/finanzas/resumen': { render: renderFinanzasResumen, init: initFinanzasResumen, tab: 'finanzas/resumen' },
  '#/finanzas/transacciones': { render: renderFinanzasTransacciones, init: initFinanzasTransacciones, tab: 'finanzas/transacciones' },
  '#/finanzas/ahorros': { render: renderFinanzasAhorros, init: initFinanzasAhorros, tab: 'finanzas/ahorros' },
  '#/finanzas/ajustes': { render: renderFinanzasAjustes, init: initFinanzasAjustes, tab: 'finanzas/ajustes' },
  '#/eventos': { render: renderEventos, init: initEventos, tab: 'eventos' },
  '#/ajustes': { render: renderAjustes, init: initAjustes, tab: 'settings' },
};

async function router() {
  const hash = location.hash || '#/dashboard';
  let route = routes[hash];
  
  if (route && route.tab !== 'settings') {
    const parentTab = route.tab.split('/')[0];
    const isModuleActive = state.modulesConfig.find(m => m.key === parentTab)?.activo;
    if (isModuleActive === false) {
      location.hash = '#/dashboard';
      return;
    }
  }
  
  if (!route) {
    location.hash = '#/dashboard';
    return;
  }

  // Guardar scroll del contenedor principal y de todos los sub-elementos con scroll
  const scrollPositions = [];
  
  // Guardar scroll de la ventana global
  scrollPositions.push({
    isWindow: true,
    scrollTop: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop,
    scrollLeft: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft
  });

  const scrollableElements = document.querySelectorAll('#main-content, .overflow-y-auto, .overflow-auto');
  scrollableElements.forEach(el => {
    let identifier = el.id ? '#' + el.id : null;
    if (!identifier && el.className) {
      identifier = el.tagName + '.' + Array.from(el.classList).join('.');
    }
    scrollPositions.push({ id: identifier, scrollTop: el.scrollTop, scrollLeft: el.scrollLeft });
  });

  // Guardar elemento enfocado activo de manera robusta
  const activeEl = document.activeElement;
  let activeSelector = null;
  let cursorStart = null;
  let cursorEnd = null;

  if (activeEl && activeEl !== document.body) {
    if (activeEl.id) {
      activeSelector = '#' + activeEl.id;
    } else {
      const uniqueAttrs = ['data-toggle-triptask-id', 'data-toggle-id', 'data-id', 'data-select-id', 'data-delete-triptask-id', 'data-delete-id'];
      for (const attr of uniqueAttrs) {
        if (activeEl.hasAttribute(attr)) {
          activeSelector = `${activeEl.tagName}[${attr}="${activeEl.getAttribute(attr)}"]`;
          break;
        }
      }
    }
    try {
      cursorStart = activeEl.selectionStart;
      cursorEnd = activeEl.selectionEnd;
    } catch(e) {}
  }

  const innerHtml = route.render(state);

  // Si ya existe el contenedor y la ruta no ha cambiado, solo actualizamos el interior para evitar scroll jumps y parpadeos
  const container = document.getElementById('main-content');
  if (container && window.currentRouteHash === hash) {
    const transitionContainer = container.querySelector('.view-transition');
    if (transitionContainer) {
      transitionContainer.innerHTML = innerHtml;
    } else {
      container.innerHTML = `
        <div class="view-transition opacity-100 transform translate-y-0 duration-300">
          ${innerHtml}
        </div>
      `;
    }
  } else {
    // Si cambió la ruta o es la carga inicial, redibujar todo
    if (window.activeCountdownInterval) {
      clearInterval(window.activeCountdownInterval);
      window.activeCountdownInterval = null;
    }
    if (window.activeTripCountdownInterval) {
      clearInterval(window.activeTripCountdownInterval);
      window.activeTripCountdownInterval = null;
    }
    
    document.body.innerHTML = LayoutBase(innerHtml, route.tab, state.modulesConfig);
    window.currentRouteHash = hash;
  }

  route.init(state, db);

  // Restaurar el scroll position de todos los elementos guardados
  scrollPositions.forEach(item => {
    if (item.isWindow) {
      window.scrollTo(item.scrollLeft, item.scrollTop);
      return;
    }
    let targetEl = null;
    if (item.id && item.id.startsWith('#')) {
      targetEl = document.getElementById(item.id.slice(1));
    }
    if (!targetEl && item.id) {
      try {
        targetEl = document.querySelector(item.id);
      } catch(e) {}
    }
    if (targetEl) {
      targetEl.scrollTop = item.scrollTop;
      targetEl.scrollLeft = item.scrollLeft;
    }
  });

  // Restaurar el foco y el cursor
  if (activeSelector) {
    try {
      const elToFocus = document.querySelector(activeSelector);
      if (elToFocus) {
        elToFocus.focus();
        if (cursorStart !== null && cursorEnd !== null) {
          elToFocus.setSelectionRange(cursorStart, cursorEnd);
        }
      }
    } catch(e) {}
  }
}

// --- CONFIGURACIÓN DE SUSCRIPCIÓN EN TIEMPO REAL (SUPABASE REALTIME) ---

function subscribeToRealtime() {
  if (!supabase) return;

  const keyToHash = {
    dashboard: '#/dashboard',
    compra: '#/compra',
    wedding: '#/bodas',
    finanzas: '#/finanzas/resumen',
    events: '#/eventos'
  };

  supabase
    .channel('db-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'compras' }, (payload) => {
      const { eventType, new: newRow, old: oldRow } = payload;
      if (eventType === 'INSERT') {
        const optItem = state.shopping.find(i => i.id < 0 && i.name === newRow.nombre);
        if (optItem) {
          optItem.id = newRow.id;
        } else if (!state.shopping.some(i => i.id === newRow.id)) {
          state.shopping.push({
            id: newRow.id,
            name: newRow.nombre,
            qty: newRow.cantidad,
            category: newRow.categoria,
            completed: newRow.completado
          });
        }
      } else if (eventType === 'UPDATE') {
        state.shopping = state.shopping.map(i => i.id === newRow.id ? {
          ...i,
          name: newRow.nombre,
          qty: newRow.cantidad,
          category: newRow.categoria,
          completed: newRow.completado
        } : i);
      } else if (eventType === 'DELETE') {
        state.shopping = state.shopping.filter(i => i.id !== oldRow.id);
      }
      triggerRerender();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'boda_tareas' }, (payload) => {
      const { eventType, new: newRow, old: oldRow } = payload;
      if (eventType === 'INSERT') {
        const optItem = state.weddingTasks.find(t => t.id < 0 && t.title === newRow.titulo);
        if (optItem) {
          optItem.id = newRow.id;
        } else if (!state.weddingTasks.some(t => t.id === newRow.id)) {
          state.weddingTasks.push({
            id: newRow.id,
            title: newRow.titulo,
            category: newRow.categoria,
            completed: newRow.completado
          });
        }
      } else if (eventType === 'UPDATE') {
        state.weddingTasks = state.weddingTasks.map(t => t.id === newRow.id ? {
          ...t,
          title: newRow.titulo,
          category: newRow.categoria,
          completed: newRow.completado
        } : t);
      } else if (eventType === 'DELETE') {
        state.weddingTasks = state.weddingTasks.filter(t => t.id !== oldRow.id);
      }
      triggerRerender();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'finanzas_cuentas' }, (payload) => {
      const { eventType, new: newRow, old: oldRow } = payload;
      if (eventType === 'INSERT') {
        const optItem = state.financesAccounts.find(a => a.id < 0 && a.name === newRow.nombre);
        if (optItem) {
          optItem.id = newRow.id;
        } else if (!state.financesAccounts.some(a => a.id === newRow.id)) {
          state.financesAccounts.push({
            id: newRow.id,
            name: newRow.nombre,
            initialBalance: parseFloat(newRow.saldo_inicial),
            color: newRow.color
          });
        }
      } else if (eventType === 'UPDATE') {
        state.financesAccounts = state.financesAccounts.map(a => a.id === newRow.id ? {
          ...a,
          name: newRow.nombre,
          initialBalance: parseFloat(newRow.saldo_inicial),
          color: newRow.color
        } : a);
      } else if (eventType === 'DELETE') {
        state.financesAccounts = state.financesAccounts.filter(a => a.id !== oldRow.id);
      }
      triggerRerender();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'finanzas_categorias' }, (payload) => {
      const { eventType, new: newRow, old: oldRow } = payload;
      if (eventType === 'INSERT') {
        const optItem = state.financesCategories.find(c => c.id < 0 && c.name === newRow.nombre);
        if (optItem) {
          optItem.id = newRow.id;
        } else if (!state.financesCategories.some(c => c.id === newRow.id)) {
          state.financesCategories.push({
            id: newRow.id,
            name: newRow.nombre,
            type: newRow.tipo,
            icon: newRow.icono
          });
        }
      } else if (eventType === 'UPDATE') {
        state.financesCategories = state.financesCategories.map(c => c.id === newRow.id ? {
          ...c,
          name: newRow.nombre,
          type: newRow.tipo,
          icon: newRow.icono
        } : c);
      } else if (eventType === 'DELETE') {
        state.financesCategories = state.financesCategories.filter(c => c.id !== oldRow.id);
      }
      triggerRerender();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'finanzas_subcategorias' }, (payload) => {
      const { eventType, new: newRow, old: oldRow } = payload;
      if (eventType === 'INSERT') {
        if (!state.financesSubcategories.some(s => s.id === newRow.id)) {
          state.financesSubcategories.push({
            id: newRow.id,
            categoryId: newRow.categoria_id,
            name: newRow.nombre
          });
        }
      } else if (eventType === 'UPDATE') {
        state.financesSubcategories = state.financesSubcategories.map(s => s.id === newRow.id ? {
          ...s,
          categoryId: newRow.categoria_id,
          name: newRow.nombre
        } : s);
      } else if (eventType === 'DELETE') {
        state.financesSubcategories = state.financesSubcategories.filter(s => s.id !== oldRow.id);
      }
      triggerRerender();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'finanzas_transacciones' }, (payload) => {
      const { eventType, new: newRow, old: oldRow } = payload;
      if (eventType === 'INSERT') {
        const optItem = state.financesTransactions.find(t => t.id < 0 && t.desc === newRow.descripcion && t.amount === parseFloat(newRow.monto));
        if (optItem) {
          optItem.id = newRow.id;
        } else if (!state.financesTransactions.some(t => t.id === newRow.id)) {
          state.financesTransactions.unshift({
            id: newRow.id,
            accountId: newRow.cuenta_id,
            categoryId: newRow.categoria_id,
            subcategoryId: newRow.subcategoria_id,
            type: newRow.tipo,
            desc: newRow.descripcion,
            amount: parseFloat(newRow.monto),
            payer: newRow.pagador,
            date: newRow.fecha
          });
        }
      } else if (eventType === 'UPDATE') {
        state.financesTransactions = state.financesTransactions.map(t => t.id === newRow.id ? {
          ...t,
          accountId: newRow.cuenta_id,
          categoryId: newRow.categoria_id,
          subcategoryId: newRow.subcategoria_id,
          type: newRow.tipo,
          desc: newRow.descripcion,
          amount: parseFloat(newRow.monto),
          payer: newRow.pagador,
          date: newRow.fecha
        } : t);
      } else if (eventType === 'DELETE') {
        state.financesTransactions = state.financesTransactions.filter(t => t.id !== oldRow.id);
      }
      
      // Sincronizar expenses para compatibilidad
      state.expenses = state.financesTransactions.filter(t => t.type === 'gasto').map(t => ({
        id: t.id, desc: t.desc, amount: t.amount, payer: t.payer, date: t.date
      }));
      triggerRerender();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'eventos' }, (payload) => {
      const { eventType, new: newRow, old: oldRow } = payload;
      if (eventType === 'INSERT') {
        const optItem = state.events.find(e => e.id < 0 && e.title === newRow.titulo);
        if (optItem) {
          optItem.id = newRow.id;
        } else if (!state.events.some(e => e.id === newRow.id)) {
          state.events.push({
            id: newRow.id,
            title: newRow.titulo,
            date: newRow.fecha,
            time: newRow.hora,
            category: newRow.categoria
          });
        }
      } else if (eventType === 'UPDATE') {
        state.events = state.events.map(e => e.id === newRow.id ? {
          ...e,
          title: newRow.titulo,
          date: newRow.fecha,
          time: newRow.hora,
          category: newRow.categoria
        } : e);
      } else if (eventType === 'DELETE') {
        state.events = state.events.filter(e => e.id !== oldRow.id);
      }
      triggerRerender();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'modulos_config' }, (payload) => {
      const { eventType, new: newRow } = payload;
      if (eventType === 'UPDATE') {
        const keyMap = {
          wedding: 'boda',
          compra: 'hogar',
          finance: 'finanzas',
          finanzas: 'finanzas',
          events: 'eventos'
        };
        const mappedKey = keyMap[newRow.key_modulo] || newRow.key_modulo;
        state.modulesConfig = state.modulesConfig.map(m => m.key === mappedKey ? {
          ...m,
          activo: newRow.activo,
          label: newRow.nombre_menu === 'Nuestra Boda' || newRow.nombre_menu === 'Finanzas' || newRow.nombre_menu === 'Lista de Compra' ? (mappedKey === 'boda' ? 'Boda' : (mappedKey === 'finanzas' ? 'Finanzas' : 'Hogar')) : newRow.nombre_menu,
          icon: newRow.icono,
          path: mappedKey === 'boda' ? '#/boda/tareas' : (mappedKey === 'finanzas' ? '#/finanzas/resumen' : (mappedKey === 'hogar' ? '#/hogar/compras' : newRow.ruta_url))
        } : m);
        triggerRerender();
      }
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'ahorros_metas' }, (payload) => {
      const { eventType, new: newRow } = payload;
      if (eventType === 'UPDATE' || eventType === 'INSERT') {
        state.savingsGoal = {
          id: newRow.id,
          name: newRow.nombre,
          target: parseFloat(newRow.monto_objetivo),
          current: parseFloat(newRow.monto_actual),
          deadline: newRow.fecha_limite
        };
        triggerRerender();
      }
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'viaje_tareas' }, (payload) => {
      const { eventType, new: newRow, old: oldRow } = payload;
      if (eventType === 'INSERT') {
        const optItem = state.tripTasks.find(t => t.id < 0 && t.title === newRow.titulo);
        if (optItem) {
          optItem.id = newRow.id;
        } else if (!state.tripTasks.some(t => t.id === newRow.id)) {
          state.tripTasks.push({
            id: newRow.id,
            title: newRow.titulo,
            category: newRow.categoria || 'Otros',
            completed: newRow.completado
          });
        }
      } else if (eventType === 'UPDATE') {
        state.tripTasks = state.tripTasks.map(t => t.id === newRow.id ? {
          ...t,
          title: newRow.titulo,
          category: newRow.categoria || 'Otros',
          completed: newRow.completado
        } : t);
      } else if (eventType === 'DELETE') {
        state.tripTasks = state.tripTasks.filter(t => t.id !== oldRow.id);
      }
      triggerRerender();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'compra_categorias' }, (payload) => {
      const { eventType, new: newRow, old: oldRow } = payload;
      if (eventType === 'INSERT') {
        const optItem = state.shoppingCategories.find(c => c.id < 0 && c.name === newRow.nombre);
        if (optItem) {
          optItem.id = newRow.id;
        } else if (!state.shoppingCategories.some(c => c.id === newRow.id)) {
          state.shoppingCategories.push({
            id: newRow.id,
            name: newRow.nombre
          });
        }
      } else if (eventType === 'UPDATE') {
        state.shoppingCategories = state.shoppingCategories.map(c => c.id === newRow.id ? {
          ...c,
          name: newRow.nombre
        } : c);
      } else if (eventType === 'DELETE') {
        state.shoppingCategories = state.shoppingCategories.filter(c => c.id !== oldRow.id);
      }
      triggerRerender();
    })
    .subscribe();
}

// Iniciar aplicación cargando datos públicos inmediatamente
async function startApp() {
  await loadInitialData();
  subscribeToRealtime();
  router();
}

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', startApp);
// Fin de index.js
