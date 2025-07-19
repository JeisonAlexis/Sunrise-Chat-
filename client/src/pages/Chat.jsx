import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import UserChat from "../components/chat/UserChat";
import PotentialChats from "../components/chat/PotentialChat";
import ChatBox from "../components/chat/ChatBox";
import NavBar from "../components/NavBar";
import "../Chat.css";

const Chat = () => {
  const { user } = useContext(AuthContext);
  const { userChats, isUserChatsLoading, updateCurrentChat } =
    useContext(ChatContext);

  return (
    <div className="chat-wrapper">
      {/* SIDEBAR IZQUIERDO */}
      <div className="chat-sidebar">
        <NavBar />

        <div className="chat-potential">
          <p>Busca a tus amigos</p>
          <PotentialChats />
        </div>

        <div className="chat-list">
          <p>Chats:</p>
          {isUserChatsLoading && <p>Cargando chats...</p>}
          {userChats?.map((chat, index) => (
            <div key={index} onClick={() => updateCurrentChat(chat)}>
              <UserChat chat={chat} user={user} />
            </div>
          ))}
        </div>
      </div>

      {/* COLUMNA DERECHA */}
      <div className="chat-main">
        <ChatBox />
      </div>
    </div>
  );
};

export default Chat;
