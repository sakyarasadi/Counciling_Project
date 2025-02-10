import React, { useEffect, useState } from "react";
import GetDataService from "../../../../services/http/get-data-services";
import PostDataService from "../../../../services/http/post-data-services";
import NavbarUser from "../../../../components/bootstrap/user_navBar";
import "bootstrap/dist/css/bootstrap.min.css";

interface RequestData {
  id: string;
  counselorFullname: string;
  counselorEmail: string;
  userFullname: string;
  userEmail: string;
  status: number;
}

interface ChatMessage {
  sender: string;
  message: string;
  timestamp: string;
}

function ChatList() {
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCounselor, setSelectedCounselor] =
    useState<RequestData | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const email = localStorage.getItem("email");
        if (email) {
          const headers = { "X-User-Email": email };
          const response = await GetDataService("/requests", { headers });
          console.log("Response from server:", response);

          if (response.success) {
            const filteredRequests = response.data.filter(
              (item: RequestData) => item.status === 1
            );
            setRequests(filteredRequests);
          }
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedCounselor) {
        handleCounselorClick(selectedCounselor);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedCounselor]);

  const handleCounselorClick = async (counselor: RequestData) => {
    setSelectedCounselor(counselor);
    try {
      const response = await GetDataService(
        `/chat-history?userEmail=${counselor.userEmail}&counselorEmail=${counselor.counselorEmail}`
      );
      if (response.success) {
        setChatHistory(response.data);
      } else {
        console.error("Error fetching chat history:", response.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSendMessage = async () => {
    if (selectedCounselor && newMessage.trim()) {
      const messageData = {
        message: newMessage,
        sender: "user",
        timestamp: new Date().toISOString(),
      };

      const chatData = {
        userFullname: selectedCounselor.userFullname,
        userEmail: selectedCounselor.userEmail,
        counselorFullname: selectedCounselor.counselorFullname,
        counselorEmail: selectedCounselor.counselorEmail,
        messageData,
      };

      try {
        const response = await PostDataService("/create-chat", chatData);
        console.log("Response from server:", response);

        if (response && response.success) {
          setChatHistory((prev) => {
            const updatedHistory = [...prev, messageData];
            console.log("Updated chat history:", updatedHistory);
            return updatedHistory;
          });

          setNewMessage("");
          console.log("New message state cleared:", newMessage);
        } else {
          console.error(
            "Error sending message:",
            response ? response.message : "Unknown error"
          );
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <>
      <NavbarUser />
      <div className="container-fluid mt-4">
        <div className="row">
          {/* Left side: Counselors list */}
          <div className="col-md-4 border-right">
            {/* <h4 className="mb-3">Approved Counselors</h4> */}
            {loading ? (
              <p>Loading...</p>
            ) : (
              <ul className="list-group">
                {requests.length > 0 ? (
                  requests.map((request) => (
                    <li
                      key={request.id}
                      className="list-group-item list-group-item-action"
                      onClick={() => handleCounselorClick(request)}
                    >
                      {request.counselorFullname}
                    </li>
                  ))
                ) : (
                  <p>No approved counselors found.</p>
                )}
              </ul>
            )}
          </div>

          {/* Right side: Chat box */}
          <div className="col-md-8">
            {selectedCounselor ? (
              <>
                <h4 className="mb-3">
                  Chat with {selectedCounselor.counselorFullname}
                </h4>
                <div
  className="chat-history border p-3 mb-3"
  style={{
    height: "400px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
  }}
>
{chatHistory.length > 0 ? (
                    chatHistory.map((chat, index) => (
                      <div
                        key={index}
                        className={`mb-2 d-flex ${
                          chat.sender === "Councilor"
                            ? "justify-content-start"
                            : "justify-content-end"
                        }`}
                      >
                        <div
                          className={`p-2 rounded`}
                          style={{
                            backgroundColor:
                              chat.sender === "user"
                                ? "#0d6efd"
                                : "#f8f9fa",
                            color:
                              chat.sender === "user" ? "white" : "black",
                            maxWidth: "75%",
                            display: "inline-block",
                            wordWrap: "break-word",
                          }}
                        >
                          <p className="mb-1">{chat.message}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No chat history available.</p>
                  )}
                </div>


                <div className="input-group">
                  <textarea
                    className="form-control"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    style={{ resize: "none" }} // Prevents resizing if needed
                  ></textarea>
                  <button
                    className="btn btn-primary"
                    onClick={handleSendMessage}
                    style={{ height: "70px", marginTop: "20px", width: "80px" }}
                  >
                    Send
                  </button>
                </div>
              </>
            ) : (
              <p></p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatList;
