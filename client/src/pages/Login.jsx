import { useContext, useState } from "react";
import { Alert, Button, Form, Stack } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { Eye, EyeSlash } from "react-bootstrap-icons";

import "../Login.css";

const Login = () => {
  const { loginUser, loginError, isLoginLoading, updateLoginInfo, loginInfo } =
    useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-background">
      <div className="login-container">
        <img
          src="/logo.png"
          alt="Logo"
          style={{ width: 240, marginBottom: 20 }}
        />
        <h2 className="login-title">Inicio de Sesión</h2>
        <Form onSubmit={loginUser} className="login-form">
          <Stack gap={3}>
            <Form.Group controlId="formEmail">
              <Form.Label className="retro-label">
                Correo Electrónico
              </Form.Label>
              <Form.Control
                className="retro-input"
                type="email"
                placeholder="Correo Electrónico"
                onChange={(e) =>
                  updateLoginInfo({ ...loginInfo, email: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group
              controlId="formPassword"
              style={{ position: "relative" }}
            >
              <Form.Label className="retro-label">Contraseña</Form.Label>
              <div style={{ position: "relative" }}>
                <Form.Control
                  className="retro-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  onChange={(e) =>
                    updateLoginInfo({ ...loginInfo, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="position-absolute top-50 end-0 translate-middle-y me-2 p-0"
                  style={{
                    background: "transparent",
                    border: "none",
                    boxShadow: "none",
                    color: "#000",
                  }}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </Form.Group>

            <Button className="retro-button" type="submit">
              {isLoginLoading ? "Iniciando..." : "Iniciar Sesión"}
            </Button>

            {loginError?.error && (
              <Alert variant="danger" className="retro-alert">
                <p>{loginError?.message}</p>
              </Alert>
            )}

            <div className="login-register-link">
              ¿No tienes una cuenta creada? <a href="/register">Regístrate</a>
            </div>
          </Stack>
        </Form>
      </div>
    </div>
  );
};

export default Login;
