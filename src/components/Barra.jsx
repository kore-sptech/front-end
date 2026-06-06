export default function Barra({ valor }) {
  return (
    <div className="h-1 w-full rounded-full bg-gray-700">
      <div
        className="h-1 rounded-full bg-blue-500 transition-all duration-500"
        style={{ width: `${valor}%` }}
      />
    </div>
  );
}
