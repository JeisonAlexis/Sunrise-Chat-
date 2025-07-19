import { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import "../../PotentialChat.css";

const UserSearch = () => {
  const { user } = useContext(AuthContext);
  const { potentialChats, createChat, onlineUsers } = useContext(ChatContext);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = Array.isArray(potentialChats)
    ? potentialChats.filter((u) =>
        u?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="user-search-wrapper">
      <input
        type="text"
        placeholder="Buscar un usuario..."
        className="user-search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="all-users">
        {searchTerm &&
          filteredUsers.map((u, index) =>
            u ? (
              <div
                className="single-user"
                key={index}
                onClick={() => createChat(user._id, u._id)}
              >
                <img
                  src={u.profilePic || "/avatar.svg"}
                  alt={u.name}
                  className="user-avatar"
                  onError={(e) => {
                    e.target.src = "/avatar.svg";
                  }}
                />
                <span className="user-name">{u.name}</span>
                <span
                  className={
                    onlineUsers?.some((ou) => ou?.userId === u._id)
                      ? "user-online"
                      : ""
                  }
                ></span>
              </div>
            ) : null
          )}
      </div>
    </div>
  );
};

export default UserSearch;
