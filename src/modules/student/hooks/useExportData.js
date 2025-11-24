export function useExportData() {
    const triggerDownload = (blob, filename) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };
    const exportJSON = (columns, rows, filename = "export.json") => {
        const json = rows.map((row) => {
            const obj = {};
            columns.forEach((col, i) => (obj[col] = row[i]));
            return obj;
        });
        const blob = new Blob([JSON.stringify(json, null, 2)], { type: "application/json" });
        triggerDownload(blob, filename);
    };
    const exportCSV = (columns, rows, filename = "export.csv") => {
        const csvHeader = columns.join(",");
        const csvRows = rows
            .map((row) => row
            .map((cell) => {
            const escaped = String(cell ?? "").replace(/"/g, '""');
            return `"${escaped}"`;
        })
            .join(","))
            .join("\n");
        const csvContent = `${csvHeader}\n${csvRows}`;
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        triggerDownload(blob, filename);
    };
    // Simple SpreadsheetML (XML) so Excel can open it as XLSX-like file without deps.
    // It's not a true .xlsx (ZIP+XML), but Excel opens SpreadsheetML (.xml) fine.
    const exportXLSX = (columns, rows, filename = "export.xml") => {
        const headerRow = columns
            .map((c) => `<Cell><Data ss:Type="String">${escapeXml(String(c))}</Data></Cell>`)
            .join("");
        const dataRows = rows
            .map((row) => `<Row>${row
            .map((cell) => `<Cell><Data ss:Type="String">${escapeXml(String(cell ?? ""))}</Data></Cell>`)
            .join("")}</Row>`)
            .join("");
        const xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns="urn:schemas-microsoft-com:office:spreadsheet">
  <Worksheet ss:Name="Sheet1">
    <Table>
      <Row>${headerRow}</Row>
      ${dataRows}
    </Table>
  </Worksheet>
</Workbook>`;
        const blob = new Blob([xml], { type: "application/xml" });
        // Use .xml extension so Excel opens it; user can save as .xlsx later
        triggerDownload(blob, filename);
    };
    const copyCSVToClipboard = async (columns, rows) => {
        const csvHeader = columns.join(",");
        const csvRows = rows
            .map((row) => row
            .map((cell) => {
            const escaped = String(cell ?? "").replace(/"/g, '""');
            return `"${escaped}"`;
        })
            .join(","))
            .join("\n");
        const text = `${csvHeader}\n${csvRows}`;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        }
        else {
            // fallback
            const ta = document.createElement("textarea");
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
            return true;
        }
    };
    const exportSchema = (schema, filename = "schema.json") => {
        let out;
        if (Array.isArray(schema)) {
            out = schema;
        }
        else {
            out = schema;
        }
        const blob = new Blob([JSON.stringify(out, null, 2)], { type: "application/json" });
        triggerDownload(blob, filename);
    };
    return { exportJSON, exportCSV, exportXLSX, copyCSVToClipboard, exportSchema };
}
// small helper
function escapeXml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}
