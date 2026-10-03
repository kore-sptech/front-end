/**
 * Molecule: legenda de gráfico (cor + rótulo + valor).
 *
 * @param {object} props
 * @param {Array<{name: string, color: string, value: React.ReactNode}>} props.items
 */
export default function ChartLegend({ items = [], className = "" }) {
  return (
    <div className={`mt-4 space-y-2 ${className}`}>
      {items.map((item) => (
        <div key={item.name} className="flex justify-between text-sm">
          <span className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            {item.name}
          </span>
          <span className="font-bold">{item.value}</span>
        </div>
      ))}
    </div>
  );
}