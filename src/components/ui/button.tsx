// src/components/ui/button.tsx (ASUMIENDO QUE ESTÁ AQUÍ)

import type React from "react";
import { type MouseEventHandler } from "react"; // Importamos el tipo de evento de React

export default function Button({
  children,
  onClick, // AÑADIDO: Aceptar onClick
  className = "", // AÑADIDO: Aceptar className
}: {
  children: React.ReactNode;
  // ELIMINADO: mensaje
  onClick?: MouseEventHandler<HTMLButtonElement>; // MODIFICADO: Tipo para manejar clics
  className?: string; // AÑADIDO: Tipo para estilos
}) {
  // ELIMINADO la función handleClick y alert() ya que se usará para navegación

  return (
      // Aplicamos onClick y className
      <button onClick={onClick} className={`border rounded-xl p-2 ${className}`}>
        {children}
      </button>
  );
}
