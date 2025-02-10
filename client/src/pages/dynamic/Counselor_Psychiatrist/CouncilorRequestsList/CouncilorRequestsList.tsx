import React, { useEffect, useState } from "react";
import GetDataService from "../../../../services/http/get-data-services";
import axios from "axios";
import Swal from "sweetalert2";
import NavCouncilor from "../../../../components/bootstrap/navbarCouncilor";

interface CounselorRequest {
  _id: string;
  userFullname: string;
  userEmail: string;
  status: number;
  counselorEmail?: string;
}

interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  connectionWithUser: string;
  guardianName: string;
  guardianPhoneNumber: string;
  nic: string;
  phoneNumber: string;
  status: number;
}

const CouncilorRequest: React.FC = () => {
  const [requests, setRequests] = useState<CounselorRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [report, setReport] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [showModal, setShowModal] = useState(false);
    const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRequests() {
      const email = localStorage.getItem("email");
      if (!email) {
        setError("Email not found in local storage.");
        return;
      }

      const headers = {
        "X-User-Email": email,
      };

      const result = await GetDataService("/requestsList", { headers });
      console.log(result);

      if (result.success) {
        setRequests(result.data);
        setError(null);
      } else {
        setError(result.message.message);
      }
    }

    fetchRequests();
  }, []);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (selectedUser?.email) {
        try {
          const response = await axios.get("http://127.0.0.1:5000/api/userpropic", {
            params: { email: selectedUser.email },
          });
          if (response.data.success) {
            setProfilePictureUrl(response.data.url);
          } else {
            setProfilePictureUrl(null);
          }
        } catch (error) {
          console.error("Error fetching profile picture:", error);
          setProfilePictureUrl(null);
        }
      } else {
        setProfilePictureUrl(null);
      }
    };
  
    fetchProfilePicture();
  }, [selectedUser]);
  

  const handleViewDetails = async (userEmail: string) => {
    try {
      const response = await axios.get(`/api/get-user`, {
        headers: { "X-User-Email": userEmail },
      });
      console.log("user data", response.data);

      if (response.data.response.success) {
        setSelectedUser(response.data.response.data);
        setShowModal(true);
      } else {
        Swal.fire("Error", "Failed to fetch user details.", "error");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      Swal.fire(
        "Error",
        "An error occurred while fetching user details.",
        "error"
      );
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleStatusChange = async (_id: string, status: number) => {
    try {
      const counselorEmail = localStorage.getItem("email");
      if (!counselorEmail) {
        console.error("Counselor email not found in local storage.");
        return;
      }

      const response = await axios.post(
        `/requestsList/${_id}/updateStatus`,
        {
          status,
          counselorEmail,
        },
        {
          headers: { "X-User-Email": counselorEmail },
        }
      );

      if (response.data.success) {
        setRequests((prevRequests) =>
          prevRequests.map((req) =>
            req._id === _id ? { ...req, status, counselorEmail } : req
          )
        );

        if (status === 1) {
          Swal.fire(
            "Accepted",
            "The request has been accepted successfully.",
            "success"
          );
        } else if (status === -1) {
          Swal.fire("Rejected", "The request has been rejected.", "error");
        }
      } else {
        console.error("Failed to update status:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire(
        "Error",
        "There was an error updating the status. Please try again.",
        "error"
      );
    }
  };

  const handleDownload = async (userEmail: string) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/api/downloadpdf`,
        {
          params: { email: userEmail },
          responseType: "blob",
        }
      );

      console.log("Response Headers:", response.headers); // Verify CORS headers

      if (
        response.status === 200 &&
        response.headers["content-type"].includes("application/pdf")
      ) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${userEmail}_counselor_details.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        Swal.fire("Success", "The PDF has been downloaded.", "success");
      } else {
        throw new Error("Invalid response format.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error downloading the PDF:", error.message);
      } else {
        console.error("Error downloading the PDF:", error);
      }
      Swal.fire("There are no files for this user.");
    }
  };

  return (
    <>
      <NavCouncilor />
      <div className="container mt-4">
        <h1 className="text-center mb-4">Counselor Requests</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        <ul className="list-group">
          {requests.map((request) => (
            <li
              key={request._id}
              className="list-group-item d-flex justify-content-between align-items-center"
              onClick={() => handleViewDetails(request.userEmail)} // Add click handler to row
              style={{ cursor: "pointer" }} // Add pointer cursor for better UX
            >
              <span>
                {request.userFullname} ({request.userEmail})
              </span>
              <div
                className="d-flex justify-content-between align-items-center gap-4 flex-grow-1"
                style={{ maxWidth: "50%" }}
              >
                <div className="d-flex flex-grow-1 gap-2">
                  {request.status === 1 ? (
                    <button className="btn btn-secondary w-100" disabled>
                      You can now chat with this patient
                    </button>
                  ) : request.status === -1 ? (
                    <button className="btn btn-danger w-100" disabled>
                      You rejected this patient
                    </button>
                  ) : (
                    <>
                      <button
                        className="btn btn-success w-100"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click from triggering
                          handleStatusChange(request._id, 1);
                        }}
                      >
                        Accept
                      </button>
                      <button
                        className="btn btn-danger w-100"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click from triggering
                          handleStatusChange(request._id, -1);
                        }}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
                <div className="ms-2" style={{ width: "25%" }}>
                  <button
                    className="btn btn-primary w-100"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click from triggering
                      handleDownload(request.userEmail);
                    }}
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* Modal for User Details */}
      {showModal && selectedUser && (
  <div
    className="modal show d-block"
    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
  >
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">User Details</h5>
          <button className="btn-close" onClick={closeModal}></button>
        </div>
        <div className="modal-body">
        <div className="d-flex justify-content-center mb-3">
          <div className="profile-picture">
            {profilePictureUrl ? (
              <img src={profilePictureUrl} alt="Profile" />
            ) : (
              <div className="default-placeholder">No Picture</div>
            )}
          </div>
        </div>
          <p>
            <strong>Name:</strong> {selectedUser.firstName}{" "}
            {selectedUser.lastName}
          </p>
          <p>
            <strong>NIC:</strong> {selectedUser.nic}
          </p>
          <p>
            <strong>Connection with User:</strong>{" "}
            {selectedUser.connectionWithUser}
          </p>
          <p>
            <strong>Guardian Name:</strong> {selectedUser.guardianName}
          </p>
          <p>
            <strong>Age:</strong> {selectedUser.age}
          </p>

          {/* Show these details only when the status is 1 */}
          {requests.find((req) => req.userEmail === selectedUser.email)?.status === 1 && (
            <>
              <p>
                <strong>Phone:</strong> {selectedUser.phoneNumber}
              </p>
              <p>
                <strong>Guardian Phone:</strong>{" "}
                {selectedUser.guardianPhoneNumber}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  </div>
)}

    </>
  );
};

export default CouncilorRequest;
