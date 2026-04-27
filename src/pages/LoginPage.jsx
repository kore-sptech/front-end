import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, senha: password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data != null) {
          localStorage.setItem("auth", JSON.stringify(data));
          localStorage.setItem("token", data.token);

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
    <div className="relative min-h-screen overflow-hidden bg-[#021134] text-white">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          className="h-full w-full object-cover opacity-60"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVAHwfWG3ofPpCanodGmTWi4xuywGG2XIhrHwKHoyHFvZqwkbUJqrP89Wwdmp3rMOb6D93qtMEFwjxuXtO-JgPMo9jkg4LC7hVXegAC2EWgYOpDqUKjsdW-FkOcLJsPzYr_lVcx3Tb_2Ohqg9yeAO_8v2k8dIfWrC7PXVkbwEmO2kEP_4mETXxgODJ8F85S0PNVjUAXxKBWlZM869T7XjGb-Ijg9CPIvK1NxO3h951I0ZP5O2jEtK-oMzS3FXF829hwWATZNv3uGUK"
          alt="background"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/80"></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 z-50 w-full px-12 py-8">
        <h1 className="text-2xl font-bold text-cyan-400">Kore</h1>
      </header>

      <main className="relative z-10 grid min-h-screen grid-cols-12">
        {/* Left side */}
        <div className="col-span-7 hidden flex-col justify-end p-12 lg:flex">
          <div>
            <h1 className="mb-4 text-6xl font-bold">
              Precision in <span className="text-cyan-400">Ink</span>
            </h1>
            <p className="text-gray-300">
              Plataforma premium para gestão de estúdios de tatuagem.
            </p>
          </div>
        </div>

        {/* Login */}
        <div className="col-span-12 flex items-center justify-center px-6 lg:col-span-5">
          <div className="w-full max-w-md rounded-xl border border-cyan-500/10 bg-[#0a1f4b]/80 p-10 shadow-2xl backdrop-blur-lg">
            <h2 className="mb-6 text-3xl font-bold">Bem-vindo</h2>

            <form onSubmit={onSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="text-xs text-cyan-400 uppercase">Email</label>
                <input
                  type="text"
                  placeholder="exemplo@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    verifyErrors();
                  }}
                  className={`mt-2 w-full rounded-lg border bg-[#0f1e41] p-3 ${
                    errorMessage.email ? "border-red-500" : "border-gray-600"
                  }`}
                />
                {errorMessage.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errorMessage.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="text-xs text-cyan-400 uppercase">Senha</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    verifyErrors();
                  }}
                  className={`mt-2 w-full rounded-lg border bg-[#0f1e41] p-3 ${
                    errorMessage.password ? "border-red-500" : "border-gray-600"
                  }`}
                />
                {errorMessage.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errorMessage.password}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 py-4 font-semibold hover:brightness-110"
              >
                ENTRAR
              </button>
            </form>

            {/* Footer */}
            <p className="mt-6 text-center text-sm text-gray-400">
              Não tem conta?{" "}
              <a href="/signup" className="text-cyan-400">
                Cadastre-se
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Kore Studio
      </footer>
    </div>
  );
}
