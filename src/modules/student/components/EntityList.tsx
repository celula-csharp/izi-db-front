interface EntityListProps {
    entities: string[];
    selected?: string | null;
    onSelect: (name: string) => void;
}

export default function EntityList({ entities, selected, onSelect }: EntityListProps) {
    return (
        <div className="flex flex-col">
            <h2 className="py-3 font-semibold text-white border-b border-gray-700">
                
                Tablas / Colecciones
            </h2>
            
            <ul className="flex flex-col mt-2">
                {entities.map((entity) => (
                    <li
                        key={entity}
                        onClick={() => onSelect(entity)}
                        className={`
                            px-4 py-2 cursor-pointer transition-colors rounded-lg capitalize text-sm my-0.5
                            ${selected === entity
                            ? "bg-red-600 font-semibold text-white"
                            : "text-gray-300 hover:bg-[#202534] hover:text-white"
                        }
                        `}
                    >
                        {entity}
                    </li>
                ))}
            </ul>
        </div>
    );
}