import { jsx as _jsx } from "react/jsx-runtime";
export default function Button({ children, onClick, // AÑADIDO: Aceptar onClick
className = "", // AÑADIDO: Aceptar className
 }) {
    // ELIMINADO la función handleClick y alert() ya que se usará para navegación
    return (
    // Aplicamos onClick y className
    _jsx("button", { onClick: onClick, className: `border rounded-xl p-2 ${className}`, children: children }));
}
