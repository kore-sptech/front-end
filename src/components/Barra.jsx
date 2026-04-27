export default function Barra({ valor }) {
  return (
    <div className="w-full bg-gray-700 rounded-full h-1">
      <div
        className="bg-blue-500 h-1 rounded-full transition-all duration-500"
        style={{ width: `${valor}%` }}
      />
    </div>
  );
}