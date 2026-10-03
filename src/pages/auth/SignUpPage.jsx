import { Link, useNavigate } from "react-router-dom";

import AuthCard from "../../ui/molecules/AuthCard";
import AuthLayout from "../../ui/templates/AuthLayout";
import Button from "../../ui/atoms/Button";
import Control from "../../ui/atoms/Control";
import Field from "../../ui/atoms/Field";
import { signUp } from "../../features/auth/signUp";
import { toast } from "sonner";
import { useState } from "react";

const EMPTY_VALUES = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

/**
 * Valida o formulário de cadastro antes de chamar a API.
 *
 * @param {{name: string, email: string, password: string, confirmPassword: string}} values
 * @returns {Record<string, string>} Erros por campo.
 */
function validateSignUp(values) {
  const errors = {};

  if (!values.name) errors.name = "O campo de nome é obrigatório.";
  if (!values.email) errors.email = "O campo de email é obrigatório.";
  else if (!values.email.includes("@"))
    errors.email = "Por favor, insira um email válido.";

  if (!values.password) errors.password = "O campo de senha é obrigatório.";
  else if (values.password !== values.confirmPassword)
    errors.confirmPassword = "As senhas não coincidem. Tente novamente.";

  return errors;
}

/**
 * Page: cadastro de novo usuário.
 *
 * @returns {React.ReactElement}
 */
export default function SignUpPage() {
  const [values, setValues] = useState(EMPTY_VALUES);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const change = (field, value) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateSignUp(values);
    setErrors(validationErrors);

    const firstError = Object.values(validationErrors)[0];

    if (firstError) {
      toast.error(firstError);
      return;
    }

    setIsLoading(true);

    try {
      const created = await signUp({
        email: values.email,
        nome: values.name,
        senha: values.password,
      });

      if (!created?.id) {
        throw new Error("Cadastro sem confirmação do servidor.");
      }

      toast.success(
        "Cadastro realizado com sucesso! Faça login para continuar.",
      );
      setValues(EMPTY_VALUES);
      navigate("/login");
    } catch {
      return;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Jefferson"
      highlight="Pimentel"
      subtitle="Plataforma premium para gestão de estúdios de tatuagem."
    >
      <AuthCard
        title="Cadastro"
        footer={
          <>
            Já tem conta?{" "}
            <Link to="/login" className="text-cyan-400">
              Entre
            </Link>
          </>
        }
      >
        <form onSubmit={onSubmit} className="flex flex-col gap-6">
          <Field
            label="Nome"
            controlId="signup-name"
            error={errors.name}
            labelClassName="text-cyan-400"
          >
            <Control
              id="signup-name"
              tone="auth"
              type="text"
              placeholder="Seu nome"
              value={values.name}
              invalid={Boolean(errors.name)}
              onChange={(event) => change("name", event.target.value)}
            />
          </Field>

          <Field
            label="Email"
            controlId="signup-email"
            error={errors.email}
            labelClassName="text-cyan-400"
          >
            <Control
              id="signup-email"
              tone="auth"
              type="text"
              placeholder="exemplo@email.com"
              value={values.email}
              invalid={Boolean(errors.email)}
              onChange={(event) => change("email", event.target.value)}
            />
          </Field>

          <Field
            label="Senha"
            controlId="signup-password"
            error={errors.password}
            labelClassName="text-cyan-400"
          >
            <Control
              id="signup-password"
              tone="auth"
              type="password"
              placeholder="••••••••"
              value={values.password}
              invalid={Boolean(errors.password)}
              onChange={(event) => change("password", event.target.value)}
            />
          </Field>

          <Field
            label="Confirmar senha"
            controlId="signup-confirm"
            error={errors.confirmPassword}
            labelClassName="text-cyan-400"
          >
            <Control
              id="signup-confirm"
              tone="auth"
              type="password"
              placeholder="••••••••"
              value={values.confirmPassword}
              invalid={Boolean(errors.confirmPassword)}
              onChange={(event) =>
                change("confirmPassword", event.target.value)
              }
            />
          </Field>

          <Button
            type="submit"
            size="block"
            loading={isLoading}
            loadingLabel="Cadastrando..."
          >
            Cadastrar
          </Button>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
