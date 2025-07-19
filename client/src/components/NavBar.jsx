import { useContext } from "react";
import { Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Notification from "./chat/Notification";
import "../NavBar.css";

const NavBar = () => {
  const { user, logoutUser } = useContext(AuthContext);

  return (
    <div style={{ padding: "0 2rem", marginTop: "1rem" }}>
      <Navbar className="navbar-container">
        <div className="navbar-inner w-100 d-flex justify-content-between align-items-center">
          {/* Lado izquierdo */}
          <div className="d-flex align-items-center gap-3">
            <img src="/logo.png" alt="Logo" style={{ height: "50px" }} />
          </div>

          {/* Lado derecho */}
          <div className="d-flex align-items-center gap-4">
            {user && (
              <>
                <div className="d-flex align-items-center gap-2">
                  <img
                    src={user?.profilePic || "/avatar.svg"}
                    alt={user?.name}
                    className="user-navbar-avatar"
                    onError={(e) => {
                      e.target.src = "/avatar.svg";
                    }}
                  />
                  <span className="fw-semibold text-white">{user?.name}</span>
                </div>

                <Notification />
                <Link
                  onClick={() => logoutUser()}
                  to="/login"
                  className="text-decoration-none"
                  style={{
                    background: "linear-gradient(to right, #ffb347, #ffcc33)",
                    padding: "0.4rem 0.8rem",
                    borderRadius: "0.5rem",
                    color: "#222",
                    fontWeight: "600",
                    border: "none",
                    boxShadow: "0px 0px 5px rgba(255, 200, 0, 0.6)",
                  }}
                >
                  Cerrar sesión
                </Link>
              </>
            )}
          </div>
        </div>
      </Navbar>
    </div>
  );
};

export default NavBar;
