import { Link, useNavigate } from "react-router-dom";

import AuthCard from "../../ui/molecules/AuthCard";
import AuthLayout from "../../ui/templates/AuthLayout";
import Button from "../../ui/atoms/Button";
import Control from "../../ui/atoms/Control";
import Field from "../../ui/atoms/Field";
import { login } from "../../features/auth/login";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const change = (field, value) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));

    if (field === "email") setEmail(value);
    else setPassword(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const emailError = email ? "" : "O campo de email é obrigatório.";
    const passwordError = password ? "" : "O campo de senha é obrigatório.";

    setErrors({ email: emailError, password: passwordError });

    if (emailError || passwordError) {
      return;
    }

    setIsLoading(true);

    try {
      await login({ email, senha: password });

      navigate("/dashboard");
    } catch {
      setErrors((prev) => ({ ...prev, email: "Email ou senha incorretos." }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="O Essencial"
      highlight="Importa"
      subtitle="Plataforma premium para gestão de estúdios de tatuagem."
    >
      <AuthCard
        title="Bem-vindo"
        footer={
          <>
            Não tem conta?{" "}
            <Link to="/signup" className="text-cyan-400">
              Cadastre-se
            </Link>
          </>
        }
      >
        <form onSubmit={onSubmit} className="flex flex-col gap-6">
          <Field
            label="Email"
            controlId="login-email"
            error={errors.email}
            labelClassName="text-cyan-400"
          >
            <Control
              id="login-email"
              tone="auth"
              type="text"
              placeholder="exemplo@email.com"
              value={email}
              invalid={Boolean(errors.email)}
              onChange={(event) => change("email", event.target.value)}
            />
          </Field>

          <Field
            label="Senha"
            controlId="login-password"
            error={errors.password}
            labelClassName="text-cyan-400"
          >
            <Control
              id="login-password"
              tone="auth"
              type="password"
              placeholder="••••••••"
              value={password}
              invalid={Boolean(errors.password)}
              onChange={(event) => change("password", event.target.value)}
            />
          </Field>

          <Button
            type="submit"
            size="block"
            loading={isLoading}
            loadingLabel="Entrando..."
          >
            ENTRAR
          </Button>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
