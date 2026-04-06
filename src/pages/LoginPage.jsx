import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState({
    email: "",
    password: "",
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
  }

  const onSubmit = (event) => {
    event.preventDefault();

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

    fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, senha: password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data != null) {
          localStorage.setItem("auth", JSON.stringify(data));
          navigate("/dashboard");
        } else {
          toast.error("Email ou senha incorretos. Tente novamente.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error(
          "Ocorreu um erro ao tentar fazer login. Tente novamente mais tarde.",
        );
      });
  };

  return (
    <section className="w-full h-screen grid grid-cols-2 items-center justify-items-center shadow">
      <form
        onSubmit={onSubmit}
        className="flex flex-col justify-stretch bg-[#061639] w-2/3 px-32 py-20 text-white rounded-lg gap-5"
      >
        <h2 className="text-4xl font-semibold">Login</h2>
        <div className="flex flex-col gap-3">
          <label htmlFor="email">Email:</label>
          <input
            className=" px-4 py-3 bg-white rounded-lg text-[#061639]"
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
            className=" px-4 py-3 bg-white rounded-lg text-[#061639]"
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

        <div className="flex flex-col justify-center items-center">
          <p id="p_message"></p>
          <p>
            Não tem uma conta? <a href="/signup">Cadastre-se aqui</a>.
          </p>
          <button
            type="submit"
            className="py-2.5 px-10 text-xl font-semibold m-auto bg-white text-[#061639] rounded cursor-pointer hover:bg-gray-200 transition-colors"
          >
            Entrar
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
