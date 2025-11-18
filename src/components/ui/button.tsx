import type React from "react";

export default function Button({
  children,
  mensaje,
}: {
  children: React.ReactNode;
  mensaje?: string;
}) {
  const handleClick = () => {
    alert(mensaje ?? "Mensaje por defecto.");
  };
  return (
    <button onClick={handleClick} className="border rounded-xl p-2">
      {children}
    </button>
  );
}
