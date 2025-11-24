#  Guía del Editor de Consultas (Query Editor)

Esta guía explica cómo usar el **Query Editor** del proyecto, basado en **Monaco Editor**, el mismo motor que usa VS Code.  
Aquí aprenderás a escribir consultas, ejecutarlas, interpretar resultados y exportarlos.

---

##  1. ¿Qué es el Query Editor?

El Query Editor es una herramienta interactiva para que el estudiante pueda:

- Escribir consultas **SQL** (o del motor asignado).
- Ejecutarlas contra su instancia.
- Visualizar los resultados en forma de tabla.
- Exportarlos en CSV o JSON.

Está construido con:

- **Monaco Editor** → código con resaltado, autocompletado básico y formato estilo VS Code.
- **studentService.executeQuery()** → ejecuta la consulta en el backend.
- **ExportButtons** → exportar el resultado de la query.

---

##  2. Estructura del componente

El archivo principal es:

src/components/QueryEditor.tsx


El componente tiene tres partes:

1. **Encabezado** → Botón "Run" y botones de exportación.
2. **Editor Monaco** → Panel izquierdo.
3. **Vista de resultados** → Panel derecho con tabla o errores.

---

## 3. Escribiendo consultas

Puedes escribir cualquier consulta permitida por tu motor:

```sql
SELECT * FROM users;
SELECT COUNT(*) FROM orders;
```

El editor admite:

Syntax highlighting

Indentación automática

Marcado de errores (parcial)

Tema oscuro VSCode

# Importante:
No ejecuta validación de esquemas. Solo envía el texto al backend.

## 4. Ejecutando consultas

Haz clic en el botón:
```sql
Run
```

O usa:

```sql
CTRL + Enter
```
(Shortcut opcional según implementación)

El editor enviará:

El texto del editor (code)

El instanceId obtenido de la URL

Ejemplo:

/query?instance=my_instance

## 5. Leyendo los resultados

Existen 3 posibles estados:

A) Resultado exitoso

Aparece una tabla:

Encabezados = result.columns

Filas = result.rows

Tiempo de ejecución mostrado arriba

B) Resultado vacío

La tabla mostrará:

Sin filas

C) Error

En caso de error del backend:

SQL inválido

Conexión rota

Timeouts

Se mostrará en rojo:

Error: <mensaje>

## 6. Exportando resultados

Debajo del botón Run aparecen los botones de exportación:

Export CSV

Export JSON

Estos exportan exactamente:

result.columns

result.rows

Formato adecuado para inspección, descarga o carga en otro software.

## 7. API utilizada

El editor invoca el servicio:

studentService.executeQuery(instanceId, code)


El backend debe responder con:

{
"columns": ["id", "name", ...],
"rows": [
[1, "Daniel"],
[2, "Maria"]
],
"executionTimeMs": 8
}


En caso de error:

{
"error": "Syntax error near ..."
}

## 8. Ejemplos de consultas
Obtener todos los usuarios
SELECT * FROM users;

Filtrar por condición
SELECT * FROM orders WHERE amount > 100;

Obtener conteos
SELECT COUNT(*) AS total FROM sessions;

## 9. Consejos de uso

Mantén tus consultas simples primero (evita SELECT * en tablas enormes).

Revisa siempre el nombre de las columnas.

Si una fila contiene objetos o JSON, el editor los mostrará como texto serializado.

Usa comentarios:

-- Ejemplo de consulta
SELECT 1;

## 10. Limitaciones actuales

No ofrece autocompletado de esquemas aún.

No hay formato automático (aunque puede agregarse).

No permite varias pestañas de consultas (por ahora).

## 11. Próximas mejoras sugeridas

Puedes extender el editor con:

CTRL + Enter para ejecutar

Formateador SQL (prettier-plugin-sql)

Autocompletado basado en esquema

Historial de consultas

Pestañas múltiples estilo VSCode

## Final

Esta guía esta incluida en el repositorio como:

EDITOR_GUIDE.md


para que los estudiantes entiendan cómo usar el editor sin mirar el código.

