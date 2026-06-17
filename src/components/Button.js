/**
 * Componente Botón Reutilizable.
 * Retorna un string HTML para ser renderizado en plantillas.
 * 
 * @param {Object} props
 * @param {string} props.text - Texto del botón
 * @param {string} [props.icon] - Icono de Material Symbols
 * @param {'primary' | 'secondary' | 'accent'} [props.type] - Tipo de botón
 * @param {string} [props.className] - Clases de Tailwind adicionales
 * @param {string} [props.id] - Identificador único
 * @returns {string} HTML String
 */
export function Button({ text, icon = '', type = 'primary', className = '', id = '' }) {
  const idAttr = id ? `id="${id}"` : '';
  
  const baseStyles = 'font-semibold px-5 py-3 rounded-full transition-colors flex items-center justify-center gap-2 select-none';
  
  const typeStyles = {
    primary: 'bg-primary hover:bg-primary-dark text-white shadow-sm',
    secondary: 'border border-primary text-primary hover:bg-primary/5',
    accent: 'bg-accent hover:bg-accent/90 text-white shadow-sm'
  };
  
  const chosenType = typeStyles[type] || typeStyles.primary;
  
  const iconSpan = icon ? `<span class="material-symbols-outlined text-[18px]">${icon}</span>` : '';

  return `
    <button ${idAttr} class="${baseStyles} ${chosenType} ${className}">
      ${iconSpan}
      <span>${text}</span>
    </button>
  `;
}
