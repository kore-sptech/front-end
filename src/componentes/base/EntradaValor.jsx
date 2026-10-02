export default function EntradaValor({ valor, aoAlterar }) {
  return (
    <input
      type="text"
      inputMode="numeric"
      placeholder="R$ 0,00"
      className="w-full rounded-lg border border-gray-800 bg-[#000C24] px-4 py-3 text-sm text-white focus:border-cyan-400 focus:outline-none"
      value={valor}
      onChange={aoAlterar}
    />
  );
}
