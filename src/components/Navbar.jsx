import Usuario from "../assets/Usuario.png";

export default function Navbar(){

    return (
        
        <nav className="w-full text-white border-b border-white/5 p-6 bg-[#0A1A3D] flex justify-between">
            
            <p>Dashboard Geral</p>
            
            <img src={Usuario} alt="Imagem Usuario" className="mr-5"/>
        </nav>

    )

}