import { useContext, useState } from "react";
import { Alert, Button, Form, Stack, InputGroup } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { Eye, EyeSlash } from "react-bootstrap-icons"; // Asegúrate de tener estos íconos disponibles
import "../Register.css";

const Register = () => {
  const {
    registerInfo,
    updateRegisterInfo,
    registerUser,
    registerError,
    isRegisterLoading,
  } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="register-background">
      <div className="register-container">
        <Form onSubmit={registerUser}>
          <Stack gap={3}>
            <img src="/logo.png" alt="Sunrise Chat" className="logo" />
            <h2 className="title">Regístrate</h2>

            <Form.Group controlId="formName">
              <Form.Label className="retro-label">Nombre Completo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa tu nombre"
                onChange={(e) =>
                  updateRegisterInfo({ ...registerInfo, name: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label className="retro-label">
                Correo Electrónico
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingresa tu correo"
                onChange={(e) =>
                  updateRegisterInfo({ ...registerInfo, email: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label className="retro-label">Contraseña</Form.Label>
              <div className="input-with-icon">
                <Form.Control
                  className="retro-input with-icon"
                  type={showPassword ? "text" : "password"}
                  placeholder="Crea una contraseña"
                  onChange={(e) =>
                    updateRegisterInfo({
                      ...registerInfo,
                      password: e.target.value,
                    })
                  }
                  required
                />
                <span
                  className="password-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                </span>
              </div>
            </Form.Group>

            <Button className="retro-button" type="submit">
              {isRegisterLoading ? "Creando tu cuenta..." : "Registrarse"}
            </Button>

            {registerError?.error && (
              <Alert variant="danger" className="retro-alert">
                <p>{registerError?.message}</p>
              </Alert>
            )}

            <p className="login-link">
              ¿Ya tienes una cuenta? <a href="/login">Iniciar sesión</a>
            </p>
          </Stack>
        </Form>
      </div>
    </div>
  );
};

export default Register;
