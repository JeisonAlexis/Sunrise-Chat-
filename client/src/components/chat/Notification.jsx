import { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import { unreadNotificationsFunc } from "../../utils/unreadNotifications";
import moment from "moment";
import "../../Notification.css";

const Notification = () => {
  const [isOpen, setIsOpen] = useState(null);
  const { user } = useContext(AuthContext);
  const {
    notifications,
    userChats,
    allUsers,
    markAllAsRead,
    markNotificationAsRead,
    deleteNotification,
  } = useContext(ChatContext);

  const unreadNotifications = unreadNotificationsFunc(notifications);
  const modifiedNotifications = notifications.map((n) => {
    const sender = allUsers.find((user) => user._id === n.senderId);
    return {
      ...n,
      senderName: sender?.name,
    };
  });

  return (
    <div className="notif-wrapper">
      <div className="notif-icon" onClick={() => setIsOpen(!isOpen)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill="gold"
          viewBox="0 0 16 16"
        >
          <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793zm3.5 1a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zm0 2.5a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zm0 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1z" />
        </svg>
        {unreadNotifications?.length > 0 && (
          <span className="notif-badge">{unreadNotifications.length}</span>
        )}
      </div>

      {isOpen && (
        <div className="notif-dropdown">
          <div className="notif-header">
            <h4>Notificaciones</h4>
            <button
              className="notif-read-all"
              onClick={() => markAllAsRead(notifications)}
              disabled={unreadNotifications.length === 0}
              title={
                unreadNotifications.length === 0
                  ? "No hay notificaciones nuevas"
                  : "Marcar todas como leídas"
              }
              style={{
                opacity: unreadNotifications.length === 0 ? 0.5 : 1,
                cursor: unreadNotifications.length === 0 ? "not-allowed" : "pointer",
              }}
            >
              Marcar todas como leídas
            </button>
          </div>

          {modifiedNotifications.length === 0 ? (
            <div className="notif-empty">
              <p>No hay notificaciones en este momento</p>
            </div>
          ) : (
            modifiedNotifications.map((n, index) => (
              <div
                key={index}
                className={`notif-item ${n.isRead ? "read" : "unread"}`}
              >
                <div
                  className="notif-content"
                  onClick={() => {
                    markNotificationAsRead(n, userChats, user, notifications);
                    setIsOpen(false);
                  }}
                >
                  <p>
                    <strong>{n.senderName}</strong> te envió un mensaje:
                  </p>
                  <p className="notif-message-preview">"{n.text}"</p>
                  <span className="notif-time">
                    {moment(n.date).calendar(null, {
                      sameDay: "h:mm A",
                      lastDay: "[Ayer] h:mm A",
                      lastWeek: "dddd h:mm A",
                      sameElse: "DD/MM/YYYY h:mm A",
                    })}
                  </span>
                </div>
                <button
                  className="notif-delete"
                  onClick={() => deleteNotification(n._id)}
                  title="Eliminar notificación"
                >
                  ❌
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Notification;
