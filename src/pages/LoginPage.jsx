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
    if (email !== "") {
      setErrorMessage((prev) => ({ ...prev, email: "" }));
    }

    if (password !== "") {
      setErrorMessage((prev) => ({ ...prev, password: "" }));
    }
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
      
      
      body: JSON.stringify({ email, senha: password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data != null) {
          localStorage.setItem("auth", JSON.stringify(data));
          navigate("/dashboard");
        } else {
          toast.error("Email ou senha incorretos.");
        }
      })
      .catch(() => {
        toast.error("Erro ao fazer login.");
      });
  };

  return (
    <div className="bg-[#021134] text-white min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-contain opacity-60"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVAHwfWG3ofPpCanodGmTWi4xuywGG2XIhrHwKHoyHFvZqwkbUJqrP89Wwdmp3rMOb6D93qtMEFwjxuXtO-JgPMo9jkg4LC7hVXegAC2EWgYOpDqUKjsdW-FkOcLJsPzYr_lVcx3Tb_2Ohqg9yeAO_8v2k8dIfWrC7PXVkbwEmO2kEP_4mETXxgODJ8F85S0PNVjUAXxKBWlZM869T7XjGb-Ijg9CPIvK1NxO3h951I0ZP5O2jEtK-oMzS3FXF829hwWATZNv3uGUK"
          alt="background"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/80"></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full px-12 py-8 z-50">
        <h1 className="text-2xl font-bold text-cyan-400">Kore</h1>
      </header>

      <main className="relative z-10 grid grid-cols-12 min-h-screen">
        {/* Left side */}
        <div className="hidden lg:flex col-span-7 flex-col justify-end p-12">
          <div>
            <h1 className="text-6xl font-bold mb-4">
              Precision in <span className="text-cyan-400">Ink</span>
            </h1>
            <p className="text-gray-300">
              Plataforma premium para gestão de estúdios de tatuagem.
            </p>
          </div>
        </div>

        {/* Login */}
        <div className="col-span-12 lg:col-span-5 flex items-center justify-center px-6">
          <div className="w-full max-w-md p-10 rounded-xl bg-[#0a1f4b]/80 backdrop-blur-lg border border-cyan-500/10 shadow-2xl">
            <h2 className="text-3xl font-bold mb-6">Bem-vindo</h2>

            <form onSubmit={onSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="text-xs uppercase text-cyan-400">
                  Email
                </label>
                <input
                  type="text"
                  placeholder="exemplo@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    verifyErrors();
                  }}
                  className={`w-full mt-2 p-3 rounded-lg bg-[#0f1e41] border ${
                    errorMessage.email
                      ? "border-red-500"
                      : "border-gray-600"
                  }`}
                />
                {errorMessage.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errorMessage.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="text-xs uppercase text-cyan-400">
                  Senha
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    verifyErrors();
                  }}
                  className={`w-full mt-2 p-3 rounded-lg bg-[#0f1e41] border ${
                    errorMessage.password
                      ? "border-red-500"
                      : "border-gray-600"
                  }`}
                />
                {errorMessage.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errorMessage.password}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg font-semibold hover:brightness-110"
              >
                ENTRAR
              </button>
            </form>

            {/* Footer */}
            <p className="text-sm text-center mt-6 text-gray-400">
              Não tem conta?{" "}
              <a href="/signup" className="text-cyan-400">
                Cadastre-se
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full text-center text-sm text-gray-500 py-6">
        © {new Date().getFullYear()} Kore Studio
      </footer>
    </div>
  );
}