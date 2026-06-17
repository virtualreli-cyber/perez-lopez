import { Card } from '../components/Card.js';
import { Button } from '../components/Button.js';

/**
 * Renderiza la estructura de la página Dashboard.
 * 
 * @param {Object} state - Estado global
 * @returns {string} HTML de la vista envuelto en el LayoutBase
 */
export function render(state) {
  const pendingShoppingCount = state.shopping.filter(i => !i.completed).length;
  const totalWeddingTasks = state.weddingTasks.length;
  const completedWeddingTasks = state.weddingTasks.filter(t => t.completed).length;

  // Tareas de viaje pendientes
  const pendingTripTasks = state.tripTasks.filter(t => !t.completed).length;

  const content = `
    <div class="mb-10">
      <h2 class="text-3xl md:text-4xl font-bold text-primary tracking-tight mb-2">¡Hola, Isra y Lidia!</h2>
      <p class="text-base text-outline">Bienvenidos de vuelta a su rincón digital. Esto es lo que tienen pendiente para hoy.</p>
    </div>

    <!-- Bento Grid Layout -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
      
      <!-- Banner Viaje Aniversario (Luna de Miel) -->
      ${Card({
        className: 'md:col-span-8 min-h-[280px] flex flex-col justify-between relative overflow-hidden group',
        content: `
          <div class="absolute inset-0 z-0 scale-100 group-hover:scale-105 transition-transform duration-700 bg-cover bg-center" style="background-image: url('./honeymoon_trip.png');"></div>
          <div class="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/50 to-black/10 z-10"></div>
          
          <div class="relative z-20 flex justify-between items-start">
            <div>
              <span class="inline-flex px-3 py-1 bg-accent text-white rounded-full text-xs font-semibold tracking-wider uppercase">Próxima Aventura</span>
              <h3 class="text-2xl font-bold text-white mt-3 leading-tight">Viaje de Luna de Miel</h3>
              <p class="text-white/80 text-sm mt-1 flex items-center gap-1">
                <span class="material-symbols-outlined text-sm">location_on</span> Sri Lanka y Maldivas
              </p>
            </div>
            <span id="trip-countdown-badge" class="px-3.5 py-1.5 bg-white/10 backdrop-blur text-white rounded-full text-xs font-semibold border border-white/20">
              Cargando días...
            </span>
          </div>

          <div class="relative z-20 mt-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p class="text-white/90 text-sm max-w-sm">"Disfrutar de las playas paradisíacas, templos sagrados, selvas tropicales y celebrar nuestro matrimonio por todo lo alto."</p>
            <a href="#/boda/viaje" class="bg-accent hover:bg-accent/90 text-white font-semibold text-xs px-5 py-3 rounded-full transition-colors flex items-center justify-center gap-2 self-start shrink-0">
              <span class="material-symbols-outlined text-[16px]">flight_takeoff</span>
              <span>Ver Itinerario y Preparativos</span>
            </a>
          </div>
        `
      })}

      <!-- Cuenta Atrás Boda -->
      ${Card({
        className: 'md:col-span-4 flex flex-col justify-between bg-surface relative overflow-hidden',
        content: `
          <!-- Marca de agua del Logo de Boda de fondo -->
          <div class="absolute -right-6 -bottom-6 w-36 h-36 bg-contain bg-no-repeat opacity-15 pointer-events-none" style="background-image: url('./logo_boda.png');"></div>

          <div class="relative z-10 flex flex-col h-full justify-between">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-bold text-primary flex items-center gap-1.5 uppercase tracking-wider">
                <span class="material-symbols-outlined text-accent">celebration</span> La Boda
              </h3>
              <span class="px-2.5 py-1 bg-accent-light text-accent rounded-full text-[10px] font-bold">Ago 15, 2026 — 18:30</span>
            </div>
            
            <div class="grid grid-cols-4 gap-1.5 text-center my-auto">
              <div class="bg-background/80 backdrop-blur-sm rounded-lg py-2">
                <span id="countdown-days" class="block text-lg font-bold text-primary">-</span>
                <span class="text-[8px] text-outline uppercase font-semibold">Días</span>
              </div>
              <div class="bg-background/80 backdrop-blur-sm rounded-lg py-2">
                <span id="countdown-hours" class="block text-lg font-bold text-primary">-</span>
                <span class="text-[8px] text-outline uppercase font-semibold">Horas</span>
              </div>
              <div class="bg-background/80 backdrop-blur-sm rounded-lg py-2">
                <span id="countdown-minutes" class="block text-lg font-bold text-primary">-</span>
                <span class="text-[8px] text-outline uppercase font-semibold">Min</span>
              </div>
              <div class="bg-background/80 backdrop-blur-sm rounded-lg py-2">
                <span id="countdown-seconds" class="block text-lg font-bold text-primary">-</span>
                <span class="text-[8px] text-outline uppercase font-semibold">Seg</span>
              </div>
            </div>
          </div>
        `
      })}

      <!-- Bento Grid inferior para navegar a las subpáginas (Diferenciadas sutilmente) -->

      <!-- Card Boda Tareas -->
      ${Card({
        className: 'md:col-span-3 flex flex-col justify-between hover:shadow-linen-hover transition-all duration-300 border-l-4 border-primary',
        content: `
          <div>
            <div class="flex items-center gap-2 mb-3">
              <div class="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-[20px]">fact_check</span>
              </div>
              <div>
                <h4 class="text-[10px] font-bold text-outline uppercase tracking-wider">Boda</h4>
                <h3 class="text-sm font-bold text-primary">Checklist de Boda</h3>
              </div>
            </div>
            <p class="text-xs text-outline mt-2">Hitos y preparativos del gran día organizados en un checklist.</p>
            <div class="mt-4 flex items-center justify-between text-xs">
              <span class="text-primary font-bold">${completedWeddingTasks} de ${totalWeddingTasks} tareas</span>
              <span class="text-outline-variant font-medium">${totalWeddingTasks > 0 ? ((completedWeddingTasks/totalWeddingTasks)*100).toFixed(0) : 0}%</span>
            </div>
            <div class="w-full h-1.5 bg-outline-variant/30 mt-2 rounded-full overflow-hidden">
              <div class="h-full bg-primary rounded-full" style="width: ${totalWeddingTasks > 0 ? (completedWeddingTasks/totalWeddingTasks)*100 : 0}%"></div>
            </div>
          </div>
          <a href="#/boda/tareas" class="mt-5 text-accent hover:text-primary transition-colors flex items-center gap-1 text-xs font-bold">
            <span>Ir a Tareas Boda</span>
            <span class="material-symbols-outlined text-sm">arrow_forward</span>
          </a>
        `
      })}

      <!-- Card Boda Viaje -->
      ${Card({
        className: 'md:col-span-3 flex flex-col justify-between hover:shadow-linen-hover transition-all duration-300 border-l-4 border-primary-light',
        content: `
          <div>
            <div class="flex items-center gap-2 mb-3">
              <div class="w-9 h-9 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-[20px]">luggage</span>
              </div>
              <div>
                <h4 class="text-[10px] font-bold text-outline uppercase tracking-wider">Boda</h4>
                <h3 class="text-sm font-bold text-primary">Preparación Viaje</h3>
              </div>
            </div>
            <p class="text-xs text-outline mt-2">Checklist de pendientes de viaje e itinerario para Sri Lanka y Maldivas.</p>
            <div class="mt-4 flex items-center justify-between text-xs">
              <span class="text-primary font-bold">${pendingTripTasks} Tareas Pendientes</span>
              <span class="px-2 py-0.5 bg-accent-light text-accent rounded-full text-[9px] font-bold">Luna de Miel</span>
            </div>
          </div>
          <a href="#/boda/viaje" class="mt-5 text-accent hover:text-primary transition-colors flex items-center gap-1 text-xs font-bold">
            <span>Ir a Preparación Viaje</span>
            <span class="material-symbols-outlined text-sm">arrow_forward</span>
          </a>
        `
      })}

      <!-- Card Hogar Compras -->
      ${Card({
        className: 'md:col-span-3 flex flex-col justify-between hover:shadow-linen-hover transition-all duration-300 border-l-4 border-terracotta',
        content: `
          <div>
            <div class="flex items-center gap-2 mb-3">
              <div class="w-9 h-9 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-[20px]">shopping_basket</span>
              </div>
              <div>
                <h4 class="text-[10px] font-bold text-outline uppercase tracking-wider">Hogar</h4>
                <h3 class="text-sm font-bold text-primary">Lista Compra</h3>
              </div>
            </div>
            <p class="text-xs text-outline mt-2">Lista compartida para el supermercado. Añadan artículos al instante.</p>
            <div class="mt-4 flex items-center justify-between text-xs">
              <span class="text-primary font-bold">${pendingShoppingCount} artículo${pendingShoppingCount !== 1 ? 's' : ''} pendiente${pendingShoppingCount !== 1 ? 's' : ''}</span>
            </div>
          </div>
          <a href="#/hogar/compras" class="mt-5 text-terracotta hover:text-primary transition-colors flex items-center gap-1 text-xs font-bold">
            <span>Ver Lista Compra</span>
            <span class="material-symbols-outlined text-sm">arrow_forward</span>
          </a>
        `
      })}

      <!-- Card Eventos -->
      ${Card({
        className: 'md:col-span-3 flex flex-col justify-between hover:shadow-linen-hover transition-all duration-300 border-l-4 border-wine',
        content: `
          <div>
            <div class="flex items-center gap-2 mb-3">
              <div class="w-9 h-9 rounded-xl bg-wine/10 text-wine flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-[20px]">calendar_month</span>
              </div>
              <div>
                <h4 class="text-[10px] font-bold text-outline uppercase tracking-wider">Eventos</h4>
                <h3 class="text-sm font-bold text-primary">Citas y Eventos</h3>
              </div>
            </div>
            <p class="text-xs text-outline mt-2">Cenas familiares, planes, salud y recordatorios de la pareja.</p>
            <ul id="dashboard-events-list" class="mt-3.5 space-y-1">
              <!-- Cargado en init() -->
            </ul>
          </div>
          <a href="#/eventos" class="mt-5 text-wine hover:text-primary transition-colors flex items-center gap-1 text-xs font-bold">
            <span>Ver Calendario</span>
            <span class="material-symbols-outlined text-sm">arrow_forward</span>
          </a>
        `
      })}

    </div>
  `;

  return content;
}

/**
 * Inicializa y arranca la interactividad del Dashboard.
 * 
 * @param {Object} state - Estado global
 * @param {Object} db - Interfaz de base de datos
 */
export function init(state, db) {
  // Renderizar próximas citas en dashboard
  const listEl = document.getElementById('dashboard-events-list');
  if (listEl) {
    listEl.innerHTML = '';
    const sortedEvents = [...state.events].sort((a,b) => new Date(a.date) - new Date(b.date)).slice(0, 2);
    
    if (sortedEvents.length === 0) {
      listEl.innerHTML = `<li class="text-xs text-outline italic py-2 text-center bg-background rounded-xl">No hay citas agendadas</li>`;
    } else {
      sortedEvents.forEach(evt => {
        const formattedDate = new Date(evt.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
        listEl.innerHTML += `
          <li class="flex items-center justify-between py-1 border-b border-outline-variant/10 last:border-0">
            <span class="text-xs text-primary truncate max-w-[120px]">${evt.title}</span>
            <span class="text-[10px] text-accent font-semibold shrink-0">${formattedDate}</span>
          </li>
        `;
      });
    }
  }

  // Reloj suizo de cuenta atrás (Boda y Viaje)
  const weddingDate = new Date('2026-08-15T18:30:00').getTime();
  const tripDate = new Date('2026-08-16T22:00:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    
    // Cuenta atrás de boda
    const weddingDistance = weddingDate - now;
    const daysEl = document.getElementById('countdown-days');
    if (daysEl) {
      if (weddingDistance < 0) {
        document.getElementById('countdown-days').innerText = '0';
        document.getElementById('countdown-hours').innerText = '0';
        document.getElementById('countdown-minutes').innerText = '0';
        document.getElementById('countdown-seconds').innerText = '0';
      } else {
        const days = Math.floor(weddingDistance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((weddingDistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((weddingDistance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((weddingDistance % (1000 * 60)) / 1000);

        daysEl.innerText = days;
        document.getElementById('countdown-hours').innerText = hours;
        document.getElementById('countdown-minutes').innerText = minutes;
        document.getElementById('countdown-seconds').innerText = seconds;
      }
    }

    // Cuenta atrás de viaje
    const tripDistance = tripDate - now;
    const countdownBadge = document.getElementById('trip-countdown-badge');
    if (countdownBadge) {
      const tripDays = Math.floor(tripDistance / (1000 * 60 * 60 * 24));
      if (tripDistance < 0) {
        countdownBadge.innerText = '¡De viaje! 🌴';
      } else if (tripDays > 0) {
        countdownBadge.innerText = `Faltan ${tripDays} días`;
      } else {
        const hoursLeft = Math.floor(tripDistance / (1000 * 60 * 60));
        if (hoursLeft > 0) {
          countdownBadge.innerText = `¡Salimos en ${hoursLeft}h! ✈️`;
        } else {
          countdownBadge.innerText = '¡Despegando! 🛫';
        }
      }
    }
  }

  updateCountdown();
  if (window.activeCountdownInterval) clearInterval(window.activeCountdownInterval);
  window.activeCountdownInterval = setInterval(updateCountdown, 1000);
}
