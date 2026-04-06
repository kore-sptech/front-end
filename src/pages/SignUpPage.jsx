import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function SignUpPage() {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [name, setName] = useState("");

  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  function verifyErrors() {
    if (email != "")
      setErrorMessage((prev) => ({
        ...prev,
        email: "",
      }));

    if (password != "")
      setErrorMessage((prev) => ({
        ...prev,
        password: "",
      }));

    if (name != "")
      setErrorMessage((prev) => ({
        ...prev,
        name: "",
      }));

    if (confirmPassword != "")
      setErrorMessage((prev) => ({
        ...prev,
        confirmPassword: "",
      }));
  }

  const onSubmit = (event) => {
    event.preventDefault();

    if (!name) {
      toast.error("O campo de nome é obrigatório.");
      setErrorMessage((prev) => ({
        ...prev,
        name: "O campo de nome é obrigatório.",
      }));
      return;
    }

    if (!email) {
      toast.error("O campo de email é obrigatório.");
      setErrorMessage((prev) => ({
        ...prev,
        email: "O campo de email é obrigatório.",
      }));
      return;
    }

    if (!password) {
      toast.error("O campo de senha é obrigatório.");
      setErrorMessage((prev) => ({
        ...prev,
        password: "O campo de senha é obrigatório.",
      }));
      return;
    }

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem. Tente novamente.");
      setErrorMessage((prev) => ({
        ...prev,
        confirmPassword: "As senhas não coincidem. Tente novamente.",
        password: "As senhas não coincidem. Tente novamente.",
      }));
      return;
    }

    fetch("http://localhost:8080/usuarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, nome: name, senha: password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          toast.success(
            "Cadastro realizado com sucesso! Faça login para continuar.",
          );

          setEmail("");
          setPassword("");
          setConfirmPassword("");
          setName("");

          navigate("/login");
        } else {
          toast.error("Já existe um usuário cadastrado com esse email!");
        }
      })
      .catch((error) => {
        console.error("Erro ao fazer cadastro:", error);
      });
  };

  return (
    <section className="w-full h-screen grid grid-cols-2 items-center justify-items-center">
      <form
        onSubmit={onSubmit}
        className="flex flex-col justify-stretch bg-[#061639] px-32 py-20 w-2/3 text-white rounded-lg gap-5 shadow"
      >
        <h2 className="text-4xl font-semibold">Cadastro</h2>

        <div className="flex flex-col gap-3">
          <label htmlFor="password">Nome:</label>
          <input
            className={`border-2 px-4 py-3 bg-white rounded-lg text-[#061639] focus:outline-none focus:ring-2 focus:ring-[#061639] ${errorMessage.name ? "border border-red-500" : ""}`}
            type="text"
            name="name"
            id="name"
            placeholder=" ..."
            onChange={(event) => {
              setName(event.target.value);
              verifyErrors();
            }}
          />
          {errorMessage.name && (
            <span>
              <p className="text-red-500 text-sm mt-1">{errorMessage.name}</p>
            </span>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <label htmlFor="email">Email:</label>
          <input
            className={`border-2 px-4 py-3 bg-white rounded-lg text-[#061639] focus:outline-none focus:ring-2 focus:ring-[#061639] ${errorMessage.email ? "border border-red-500" : ""}`}
            type="email"
            name="email"
            id="email"
            placeholder=" exemplo@gmail.com"
            onChange={(event) => {
              setEmail(event.target.value);
              verifyErrors();
            }}
          />
          {errorMessage.email && (
            <span>
              <p className="text-red-500 text-sm mt-1">{errorMessage.email}</p>
            </span>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <label htmlFor="password">Senha:</label>
          <input
            className={`border-2 px-4 py-3 bg-white rounded-lg text-[#061639] focus:outline-none focus:ring-2 focus:ring-[#061639] ${errorMessage.password ? "border border-red-500" : ""}`}
            type="password"
            name="password"
            id="password"
            placeholder=" ..."
            onChange={(event) => {
              setPassword(event.target.value);
              verifyErrors();
            }}
          />

          {errorMessage.password && (
            <span>
              <p className="text-red-500 text-sm mt-1">
                {errorMessage.password}
              </p>
            </span>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <label htmlFor="password">Confirmar Senha:</label>
          <input
            className={`border-2 px-4 py-3 bg-white rounded-lg text-[#061639] focus:outline-none focus:ring-2 focus:ring-[#061639] ${errorMessage.confirmPassword ? "border border-red-500" : ""}`}
            type="password"
            name="confirm-password"
            id="confirm-password"
            placeholder=" ..."
            onChange={(event) => {
              setConfirmPassword(event.target.value);
              verifyErrors();
            }}
          />

          {errorMessage.confirmPassword && (
            <span>
              <p className="text-red-500 text-sm mt-1">
                {errorMessage.confirmPassword}
              </p>
            </span>
          )}
        </div>

        <div className="flex flex-col justify-center items-center">
          <p id="p_message"></p>
          <p>
            Já tem uma conta?
            <a href="/login"> Faça login aqui</a>.
          </p>
          <button
            type="submit"
            className="py-2.5 px-10 text-xl font-semibold m-auto bg-white text-[#061639] rounded cursor-pointer hover:bg-gray-200 transition-colors"
          >
            Cadastrar
          </button>
        </div>
      </form>

      {/* back ground  */}
      <div className="relative h-full w-full bg-[#061639] text-white flex flex-col items-center justify-center">
        <h1 className="text-6xl font-normal text-center">
          Jefferson <br />
          Pimentel <br />
          <span className="text-7xl font-bold">Tattoo</span>
        </h1>

        <h2 className="absolute bottom-10 left-1/2 right-1/2 transform -translate-x-1/2 w-40 text-sm">
          Desenvolvido por: <br /> KORE © {new Date().getFullYear()}
        </h2>
      </div>
    </section>
  );
}
