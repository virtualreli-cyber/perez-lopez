/**
 * Layout Base ("Marco Visual Wrapper") Dinámico Público.
 * Dibuja la estructura general y las barras de navegación lateral e inferior dinámicamente.
 * No incluye botones de cierre de sesión (Auth desactivado).
 * 
 * @param {string} childrenHtml - Contenido HTML dinámico de la página activa
 * @param {string} activeTab - Hash o identificador de pestaña activa
 * @param {Array<Object>} modulesConfig - Configuración de módulos del estado
 * @returns {string} HTML String del Layout completo
 */
export function LayoutBase(childrenHtml, activeTab = 'dashboard', modulesConfig = []) {
  
  // Filtrar los módulos que están activos en la configuración
  const activeModules = modulesConfig.filter(m => m.activo);

  // Generar enlaces de navegación del Menú Lateral (Escritorio)
  const renderSidebarLinks = () => {
    return activeModules.map(m => {
      const isSelected = activeTab === m.key || activeTab.startsWith(m.key + '/');
      const btnClass = isSelected
        ? 'w-full flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-200 text-left font-medium bg-white/10 text-white border-l-4 border-accent'
        : 'w-full flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-200 text-left font-medium text-white/70 hover:bg-white/10 hover:text-white';
      
      return `
        <li>
          <a href="${m.path}" class="${btnClass}">
            <span class="material-symbols-outlined">${m.icon}</span>
            <span>${m.label}</span>
          </a>
        </li>
      `;
    }).join('');
  };

  // Generar enlaces de navegación del Menú Inferior (Móvil)
  const renderMobileLinks = () => {
    return activeModules.map(m => {
      const isSelected = activeTab === m.key || activeTab.startsWith(m.key + '/');
      const linkClass = isSelected
        ? 'flex flex-col items-center gap-1 text-accent'
        : 'flex flex-col items-center gap-1 text-outline hover:text-primary transition-colors';
      
      const mobileLabels = {
        dashboard: 'Inicio',
        boda: 'Boda',
        hogar: 'Hogar',
        finanzas: 'Finanzas',
        eventos: 'Citas'
      };
      const label = mobileLabels[m.key] || m.label.split(' ')[0];

      return `
        <a href="${m.path}" class="${linkClass}">
          <span class="material-symbols-outlined text-2xl">${m.icon}</span>
          <span class="text-[10px] font-bold">${label}</span>
        </a>
      `;
    }).join('');
  };

  // Título de la cabecera móvil según vista
  const activeModule = modulesConfig.find(m => activeTab === m.key || activeTab.startsWith(m.key + '/')) || { label: 'Ajustes' };
  const mobileTitle = activeModule.label;

  // Clase del botón de ajustes
  const isAjustesSelected = activeTab === 'settings';
  const ajustesBtnClass = isAjustesSelected
    ? 'w-full flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-200 text-left font-medium bg-white/10 text-white border-l-4 border-accent'
    : 'w-full flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-200 text-left font-medium text-white/70 hover:bg-white/10 hover:text-white';

  const mobileAjustesLinkClass = isAjustesSelected
    ? 'flex flex-col items-center gap-1 text-accent'
    : 'flex flex-col items-center gap-1 text-outline hover:text-primary transition-colors';

  return `
    <div class="h-full w-full flex flex-col lg:flex-row bg-background text-charcoal font-sans antialiased overflow-hidden">
      
      <!-- 1. SIDEBAR (Escritorio - Fijo a la izquierda) -->
      <nav class="hidden lg:flex flex-col w-[280px] bg-primary text-white h-screen shrink-0 justify-between py-8 px-6 shadow-xl relative z-20">
        <div>
          <div class="px-4 mb-10 flex items-center gap-3">
            <span class="material-symbols-outlined text-accent text-3xl font-bold">favorite</span>
            <h2 class="text-xl font-bold tracking-tight">Nuestro Espacio</h2>
          </div>

          <ul class="flex flex-col gap-2">
            <!-- Render dinámico de módulos activos -->
            ${renderSidebarLinks()}
            
            <li class="mt-4 pt-4 border-t border-white/5">
              <a href="#/ajustes" class="${ajustesBtnClass}">
                <span class="material-symbols-outlined">settings</span>
                <span>Ajustes</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Perfil de Pareja (Público - Sin logout) -->
        <div class="px-4 border-t border-white/10 pt-6 flex items-center gap-3">
          <div class="relative">
            <img alt="Couple Profile" class="w-9 h-9 rounded-full object-cover border border-accent" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80"/>
            <div class="absolute -bottom-1 -right-1 bg-accent w-3 h-3 rounded-full flex items-center justify-center">
              <span class="text-[6px] text-white">♥</span>
            </div>
          </div>
          <div class="flex flex-col">
            <span class="font-bold text-xs">Isra & Lidia</span>
            <span class="text-[10px] text-white/60">Nuestro Rincón Privado</span>
          </div>
        </div>
      </nav>

      <!-- 2. CABECERA MÓVIL (Móvil/Tablet) -->
      <header class="lg:hidden w-full bg-surface border-b border-outline-variant/30 flex justify-between items-center px-6 py-4 relative z-20">
        <div class="flex items-center gap-2.5">
          <span class="material-symbols-outlined text-primary text-2xl font-bold">favorite</span>
          <h1 class="font-bold text-lg text-primary tracking-tight">${mobileTitle}</h1>
        </div>
        
        <div class="flex items-center gap-3">
          <button class="relative text-outline hover:text-primary transition-colors p-1" aria-label="Notificaciones">
            <span class="material-symbols-outlined text-2xl">notifications</span>
            <span class="absolute top-1 right-1 w-2.5 h-2.5 bg-accent rounded-full border border-surface"></span>
          </button>
          <img alt="Profile" class="w-8 h-8 rounded-full object-cover border border-outline-variant" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80"/>
        </div>
      </header>

      <!-- 3. CONTENEDOR PRINCIPAL -->
      <main id="main-content" class="flex-1 overflow-y-auto h-full px-6 py-8 md:px-12 md:py-10 max-w-[1440px] mx-auto w-full custom-scrollbar pb-24 lg:pb-10 relative z-10">
        <div class="view-transition opacity-100 transform translate-y-0 duration-300">
          ${childrenHtml}
        </div>
      </main>

      <!-- 4. NAVEGACIÓN MÓVIL (Fija abajo) -->
      <nav class="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-outline-variant/30 flex justify-around items-center py-3 z-30 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
        <!-- Render dinámico de módulos móviles activos -->
        ${renderMobileLinks()}
        
        <!-- Enlace fijo a Ajustes -->
        <a href="#/ajustes" class="${mobileAjustesLinkClass}">
          <span class="material-symbols-outlined text-2xl">settings</span>
          <span class="text-[10px] font-bold">Ajustes</span>
        </a>
      </nav>

    </div>
  `;
}
