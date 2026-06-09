export default function CardProdutoIntegracao(props) {
    const handleClick = () => {
        if (props.onSelect) {
            props.onSelect(props.id, props.nome);
        }
    };

    return (
        <div 
            className="card h-65 rounded-2xl bg-[#0A1A3D] w-80 shadow-sm mb-6 hover:cursor-pointer hover:shadow-cyan-300 hover:transition-all transition-all"
            onClick={handleClick}
        >
            <figure className="w-full h-50">
                <img
                    src="https://tattoounleashed.com/cdn/shop/articles/the-pros-and-cons-of-different-tattoo-machines-198448.jpg?v=1715856207"
                    alt="Produto"
                    className="rounded-xl w-full h-50 object-cover" 
                />
            </figure>
            <div className="card-body h-auto flex-col justify-between items-center text-center">
                <h2 className="card-title text-sm">{props.nome}</h2>
                <div className="card-actions justify-end">

                </div>
            </div>
        </div>
    );
}