
interface EntityListProps {
    entities: string[];
    selected?: string | null;
    onSelect: (name: string) => void;
}

export default function EntityList({ entities, selected, onSelect }: EntityListProps) {
    return (
        <div className="w-64 border-r border-gray-200 bg-white">
            <h2 className="px-4 py-3 font-semibold text-gray-700 border-b">
                Tablas / Colecciones
            </h2>

            <ul className="divide-y divide-gray-100">
                {entities.map((entity) => (
                    <li
                        key={entity}
                        onClick={() => onSelect(entity)}
                        className={`px-4 py-3 cursor-pointer hover:bg-gray-100
              ${selected === entity ? "bg-blue-100 font-medium" : ""}`}
                    >
                        {entity}
                    </li>
                ))}
            </ul>
        </div>
    );
}
