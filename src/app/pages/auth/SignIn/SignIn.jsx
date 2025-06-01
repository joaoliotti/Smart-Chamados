import { useState, useContext } from "react";
import "./SignIn.css";
import logo from "../../../../assets/logo.png";
import { AuthContext } from "../../../../context/auth";
import Version from "../../../components/Version/Version";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn, loadingAuth } = useContext(AuthContext);

  async function handleSubmit(e) {
    e.preventDefault();

    if (email !== "" && password !== "") {
      try {
        const response = await signIn(email, password);
      } catch (error) {}
    }
  }

  return (
    <div className="container-center">
      <div className="login">
        <div className="login-area">
          <img src={logo} alt="Logo do sistema de chamados" />
        </div>

        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="current-email"
            name="email"
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            name="password"
          />

          <button type="submit">
            {loadingAuth ? "Carregando..." : "Acessar"}
          </button>
        </form>
        <Version color="white" />
      </div>
    </div>
  );
}
