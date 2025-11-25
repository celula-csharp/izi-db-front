import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function EntityList({ entities, selected, onSelect }) {
    return (_jsxs("div", { className: "flex flex-col", children: [_jsx("h2", { className: "py-3 font-semibold text-white border-b border-gray-700", children: "Tablas / Colecciones" }), _jsx("ul", { className: "flex flex-col mt-2", children: entities.map((entity) => (_jsx("li", { onClick: () => onSelect(entity), className: `
                            px-4 py-2 cursor-pointer transition-colors rounded-lg capitalize text-sm my-0.5
                            ${selected === entity
                        ? "bg-red-600 font-semibold text-white"
                        : "text-gray-300 hover:bg-[#202534] hover:text-white"}
                        `, children: entity }, entity))) })] }));
}
