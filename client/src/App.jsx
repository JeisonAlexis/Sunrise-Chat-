import { Routes, Route, Navigate } from "react-router-dom";
import Chat from "./pages/Chat";
import Register from "./pages/Register";
import Login from "./pages/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "./components/NavBar";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { ChatContextProvider } from "./context/ChatContext";
import './index.css';
function App() {
  const { user } = useContext(AuthContext);
  return (
    <ChatContextProvider user={user}>
      
      <Routes>
        <Route path="/" element={user ? <Chat /> : <Login />} />
        <Route path="/register" element={user ? <Chat /> : <Register />} />
        <Route path="/login" element={user ? <Chat /> : <Login />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </ChatContextProvider>
  );
} 

export default App;
