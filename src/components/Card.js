/**
 * Componente Tarjeta (Card) Reutilizable.
 * Retorna un string HTML para ser renderizado en plantillas.
 * 
 * @param {Object} props
 * @param {string} props.content - Contenido HTML interno de la tarjeta
 * @param {string} [props.className] - Clases de Tailwind adicionales
 * @returns {string} HTML String
 */
export function Card({ content, className = '' }) {
  return `
    <div class="bg-surface rounded-2xl p-6 md:p-8 shadow-linen hover:shadow-linen-hover transition-all duration-300 border border-outline-variant/20 ${className}">
      ${content}
    </div>
  `;
}
