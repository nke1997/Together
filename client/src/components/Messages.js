import { useMessages, useMessagesDispatch } from "./context/MessagesContext";
import { useState, useEffect } from "react";

import { useUser } from "./context/UserContext";
import { useSelectedUser } from "./context/SelectedUserContext";

import ReactTimeAgo from "react-time-ago";

function Messages() {
  const dispatch = useMessagesDispatch();
  const messages = useMessages().messages;

  const selectedUser = useSelectedUser().selectedUser;
  const currentUser = useUser().id;

  const [errors, setErrors] = useState([]);

  useEffect(() => {
    fetch(`/user/${currentUser}/dm/${selectedUser}`).then((response) => {
      if (response.ok) {
        response.json().then((messages) =>
          dispatch({
            type: "mount",
            messages: messages,
          })
        );
      } else {
        response.json().then((errors) => setErrors(errors));
      }
    });
  }, []);

  const renderMessages = messages ? (
    messages.map((message) => {
      if (message.sender_id == selectedUser) {
        return (
          <div className="received-message-container">
            <div className="received-message-bubble">
              <p className="message-text">{message.body}</p>
            </div>
            <ReactTimeAgo
              date={message.created_at}
              locale="en-US"
              timeStyle="round"
              className="post-time"
            />
          </div>
        );
      } else {
        return (
          <div className="sent-message-container">
            <div className="sent-message-bubble">
              <p className="message-text">{message.body}</p>
            </div>
            <ReactTimeAgo
              date={message.created_at}
              locale="en-US"
              timeStyle="round"
              className="post-time"
            />
          </div>
        );
      }
    })
  ) : (
    <></>
  );

  return <>{renderMessages}</>;
}

export default Messages;
