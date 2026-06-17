import { supabase } from '../lib/supabaseClient.js';
import { Card } from '../components/Card.js';
import { InputField } from '../components/InputField.js';
import { Button } from '../components/Button.js';

/**
 * Renderiza la interfaz de la pantalla de Inicio de Sesión.
 * 
 * @returns {string} HTML de la vista
 */
export function render() {
  return `
    <div class="min-h-screen bg-background flex flex-col justify-center items-center px-6 py-12 select-none">
      
      <!-- Contenedor de Login Estético y Minimalista -->
      <div class="w-full max-w-[400px]">
        
        <!-- Cabecera del Portal -->
        <div class="text-center mb-8 flex flex-col items-center">
          <span class="material-symbols-outlined text-primary text-5xl font-bold mb-3 animate-pulse">favorite</span>
          <h2 class="text-3xl font-bold text-primary tracking-tight">Nuestro Espacio</h2>
          <p class="text-sm text-outline mt-2">Introduce tus datos para acceder a vuestro rincón privado</p>
        </div>

        <!-- Tarjeta de Formulario -->
        ${Card({
          className: 'shadow-linen',
          content: `
            <form id="login-form" class="space-y-5">
              ${InputField({ 
                id: 'login-email', 
                label: 'Correo Electrónico', 
                type: 'email', 
                placeholder: 'ejemplo@correo.com', 
                required: true 
              })}

              ${InputField({ 
                id: 'login-password', 
                label: 'Contraseña', 
                type: 'password', 
                placeholder: '••••••••', 
                required: true 
              })}

              <!-- Alerta de Error -->
              <div id="login-error-msg" class="hidden bg-error-container text-on-error-container text-xs p-3 rounded-xl border border-error/20 font-medium">
                Credenciales incorrectas. Inténtalo de nuevo.
              </div>

              ${Button({ 
                text: 'Iniciar Sesión', 
                icon: 'lock_open', 
                className: 'w-full py-3.5 text-sm mt-2' 
              })}
            </form>
          `
        })}

        <!-- Pie de página discreto -->
        <p class="text-center text-[10px] text-outline/60 mt-8">
          Protegido con Supabase Row-Level Security (RLS) Nivel 2
        </p>

      </div>
    </div>
  `;
}

/**
 * Inicializa los controladores del Formulario de Inicio de Sesión.
 */
export function init() {
  const form = document.getElementById('login-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const emailEl = document.getElementById('login-email');
    const passwordEl = document.getElementById('login-password');
    const errorEl = document.getElementById('login-error-msg');
    const submitBtn = form.querySelector('button[type="submit"]');

    if (!supabase) {
      errorEl.innerText = 'Error: Supabase no está configurado en las variables de entorno.';
      errorEl.classList.remove('hidden');
      return;
    }

    try {
      // Desactivar botón y mostrar carga
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="material-symbols-outlined text-[18px] animate-spin">sync</span>
        <span>Validando accesos...</span>
      `;
      errorEl.classList.add('hidden');

      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailEl.value,
        password: passwordEl.value,
      });

      if (error) {
        throw error;
      }
      
      console.log('Inicio de sesión exitoso:', data.user.email);
      
    } catch (err) {
      console.error('Error de autenticación:', err.message);
      errorEl.innerText = err.message === 'Invalid login credentials' 
        ? 'El correo o la contraseña son incorrectos.' 
        : `Error: ${err.message}`;
      errorEl.classList.remove('hidden');
      
      // Reactivar botón
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <span class="material-symbols-outlined text-[18px]">lock_open</span>
        <span>Iniciar Sesión</span>
      `;
    }
  });
}
