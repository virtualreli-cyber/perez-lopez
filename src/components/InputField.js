/**
 * Componente Campo de Entrada (Input Field) Reutilizable.
 * Retorna un string HTML para ser renderizado en plantillas.
 * 
 * @param {Object} props
 * @param {string} props.id - ID del input
 * @param {string} props.label - Etiqueta superior del input
 * @param {string} [props.type] - Tipo de entrada (text, number, date, time, etc.)
 * @param {string} [props.placeholder] - Texto de sugerencia
 * @param {string | number} [props.value] - Valor inicial
 * @param {boolean} [props.required] - Si es obligatorio
 * @param {string} [props.className] - Clases de Tailwind adicionales para el wrapper
 * @param {string} [props.inputClassName] - Clases de Tailwind adicionales para el input
 * @returns {string} HTML String
 */
export function InputField({ 
  id, 
  label, 
  type = 'text', 
  placeholder = '', 
  value = '', 
  required = false, 
  className = '',
  inputClassName = ''
}) {
  const reqAttr = required ? 'required' : '';
  const valAttr = value ? `value="${value}"` : '';
  
  return `
    <div class="${className}">
      <label for="${id}" class="block text-xs font-bold text-primary uppercase tracking-wider mb-1">${label}</label>
      <input 
        type="${type}" 
        id="${id}" 
        placeholder="${placeholder}" 
        ${valAttr}
        ${reqAttr}
        class="w-full bg-background border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent placeholder-outline/50 ${inputClassName}"
      />
    </div>
  `;
}
