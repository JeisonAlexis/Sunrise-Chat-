import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import { Stack } from "react-bootstrap";
import moment from "moment";
import "moment/locale/es"; 
moment.locale("es");       

import InputEmoji from "react-input-emoji";
import "../../ChatBox.css";

const ChatBox = () => {
  const lastMessageRef = useRef(null);
  const { user } = useContext(AuthContext);
  const {
    currentChat,
    messages,
    isMessagesLoading,
    sendTextMessage,
    newMessage,
  } = useContext(ChatContext);

  const { recipientUser } = useFetchRecipientUser(currentChat, user);
  const [textMessage, setTextMessage] = useState("");

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!recipientUser)
    return (
      <p
        style={{
          textAlign: "center",
          width: "100%",
          height: "100vh",
          paddingTop: "20vh",
          fontSize: "1.5rem",
        }}
      >
        Aqui no hay nada que ver, al menos hasta que seleccione un chat 😁
      </p>
    );

  if (!messages && isMessagesLoading)
    return (
      <p
        style={{
          textAlign: "center",
          width: "100%",
          height: "100vh",
          paddingTop: "20vh",
          fontSize: "1.5rem",
        }}
      >
        Cargando mensajes...
      </p>
    );

  return (
    <Stack style={{ paddingTop: "1rem" }}>
      <Stack gap={4} className="chat-box">
        <div className="chat-header d-flex align-items-center gap-3">
          <img
            src={recipientUser?.profilePic || "/avatar.svg"}
            alt={recipientUser?.name}
            className="chat-avatar"
          />
          <strong>{recipientUser?.name}</strong>
        </div>

        <Stack gap={3} className="messages">
          {messages &&
            messages.map((msg, index) => (
              <Stack
                key={index}
                className={`${
                  msg?.senderId === user?._id
                    ? "message self align-self-end flex-grow-0"
                    : "message align-self-start flex-grow-0"
                }`}
                ref={index === messages.length - 1 ? lastMessageRef : null}
              >
                <span>{msg.text}</span>
                <span className="message-footer">
                  {moment(msg.createdAt).calendar(null, {
                    sameDay: "[Hoy] DD/MM/YYYY h:mm a",
                    nextDay: "[Mañana] DD/MM/YYYY h:mm a",
                    nextWeek: "dddd DD/MM/YYYY h:mm a",
                    lastDay: "[Ayer] DD/MM/YYYY h:mm a",
                    lastWeek: "dddd DD/MM/YYYY h:mm a",
                    sameElse: "dddd DD/MM/YYYY h:mm a",
                  })}
                </span>
              </Stack>
            ))}
        </Stack>

        <Stack direction="horizontal" gap={3} className="chat-input flex-grow-0">
          <InputEmoji
            value={textMessage}
            onChange={setTextMessage}
            onEnter={() =>
              sendTextMessage(
                textMessage,
                user,
                currentChat._id,
                setTextMessage
              )
            }
            fontFamily="Oswald"
            borderColor="rgba(10, 200, 10, 0.5)"
            placeholder="Escribe tu mensaje aquí..."
          />

          <button
            className="send-btn"
            onClick={() =>
              sendTextMessage(
                textMessage,
                user,
                currentChat._id,
                setTextMessage
              )
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="currentColor"
              className="bi bi-send-fill"
              viewBox="0 0 16 16"
            >
              <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
            </svg>
          </button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ChatBox;
