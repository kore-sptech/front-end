import { useState } from "react";

export function Login() {
  const [formLogin, setFormLogin] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formLogin);
  };

  return (
    <>
      <main>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formLogin.email}
            onChange={(e) => {
              setFormLogin({ ...formLogin, email: e.target.value });
            }}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={formLogin.password}
            onChange={(e) => {
              setFormLogin({ ...formLogin, password: e.target.value });
            }}
          />

          <button type="submit">Entrar</button>
        </form>
      </main>
    </>
  );
}
