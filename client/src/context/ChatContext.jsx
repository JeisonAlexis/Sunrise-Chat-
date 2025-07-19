import React, {
  createContext,
  useCallback,
  useEffect,
  useState,
  useContext,
} from "react";
import { getRequest, postRequest, baseUrl } from "../utils/services";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [userChats, setUserChats] = useState(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [sendTextMessageError, setSendTextMessageError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [newMessage, setNewMessage] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  // Reinicia el chat actual cuando cambia el usuario
  useEffect(() => {
    setCurrentChat(null);
  }, [user]);

  // Configura el socket
  useEffect(() => {
    const SOCKET_URL =
      import.meta.env.VITE_SOCKET_URL || "http://localhost:5001";

    const newSocket = io(SOCKET_URL, {
      transports: ["polling"], // evita handshake por websocket
    });

    newSocket.on("connect", () =>
      console.log("🔗 socket conectado:", newSocket.id)
    );
    newSocket.on("connect_error", (err) =>
      console.error("🔌 socket error", err)
    );

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [user]);

  // Registrar usuario conectado
  useEffect(() => {
    if (!socket) return;
    socket.emit("addNewUser", user?._id);
    socket.on("getOnlineUsers", setOnlineUsers);
    return () => socket.off("getOnlineUsers");
  }, [socket, user]);

  // Enviar mensaje por socket
  useEffect(() => {
    if (!socket || !newMessage) return;
    const recipientId = currentChat?.members?.find((id) => id !== user?._id);
    socket.emit("sendMessage", { ...newMessage, recipientId });
  }, [socket, newMessage, currentChat, user]);

  // Escuchar mensajes y notificaciones
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (res) => {
      if (res.chatId === currentChat?._id) {
        setMessages((prev) => (prev ? [...prev, res] : [res]));
      }
    };

    const handleNotification = (res) => {
      setNotifications((prev) => [{ ...res, isRead: false }, ...prev]);
    };

    socket.on("getMessage", handleMessage);
    socket.on("getNotification", handleNotification);

    return () => {
      socket.off("getMessage", handleMessage);
      socket.off("getNotification", handleNotification);
    };
  }, [socket, currentChat]);

  // Obtener usuarios
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await getRequest(`${baseUrl}/users`);
      if (response.error) return;
      setAllUsers(response);
      const p = response.filter((u) => {
        if (u._id === user?._id) return false;
        return !userChats?.some((chat) => chat.members.includes(u._id));
      });
      setPotentialChats(p);
    };
    fetchUsers();
  }, [userChats, user]);

  // Obtener chats del usuario
  useEffect(() => {
    const fetchChats = async () => {
      if (!user?._id) return;
      setIsUserChatsLoading(true);
      setUserChatsError(null);
      const resp = await getRequest(`${baseUrl}/chats/${user._id}`);
      setIsUserChatsLoading(false);
      if (resp.error) setUserChatsError(resp.error);
      else setUserChats(resp);
    };
    fetchChats();
  }, [user, notifications]);

  // Obtener mensajes del chat actual
  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentChat?._id) return;
      setIsMessagesLoading(true);
      setMessagesError(null);
      setMessages(null);
      const resp = await getRequest(`${baseUrl}/messages/${currentChat._id}`);
      setIsMessagesLoading(false);
      if (resp.error) setMessagesError(resp.error);
      else setMessages(resp);
    };
    fetchMessages();
  }, [currentChat]);

  // Enviar mensaje de texto
  const sendTextMessage = useCallback(async (text, sender, chatId, reset) => {
    if (!text) return;
    const resp = await postRequest(
      `${baseUrl}/messages`,
      JSON.stringify({ chatId, senderId: sender._id, text })
    );
    if (resp.error) setSendTextMessageError(resp.error);
    else {
      setNewMessage(resp);
      setMessages((prev) => (prev ? [...prev, resp] : [resp]));
      reset("");
    }
  }, []);

  const createChat = useCallback(async (id1, id2) => {
    const resp = await postRequest(
      `${baseUrl}/chats`,
      JSON.stringify({ firstId: id1, secondId: id2 })
    );
    if (!resp.error) setUserChats((prev) => [...(prev || []), resp]);
  }, []);

  const updateCurrentChat = useCallback((chat) => setCurrentChat(chat), []);

  const markAllAsRead = useCallback(
    () => setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true }))),
    []
  );

  const markNotificationAsRead = useCallback(
    (notif) => {
      setNotifications((prev) =>
        prev.map((n) =>
          n.senderId === notif.senderId ? { ...n, isRead: true } : n
        )
      );
      const match = userChats?.find((c) => c.members.includes(notif.senderId));
      if (match) setCurrentChat(match);
    },
    [userChats]
  );

  const deleteNotification = useCallback((notifId) => {
    setNotifications((prev) =>
      prev.filter((n) => n._id !== notifId)
    );
  }, []);

  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatsLoading,
        userChatsError,
        potentialChats,
        createChat,
        updateCurrentChat,
        currentChat,
        messages,
        isMessagesLoading,
        messagesError,
        sendTextMessage,
        onlineUsers,
        notifications,
        allUsers,
        markAllAsRead,
        markNotificationAsRead,
        deleteNotification, // <-- ✅ AÑADIDO AQUÍ
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
