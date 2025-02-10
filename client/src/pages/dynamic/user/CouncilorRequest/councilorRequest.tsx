import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Row,
  Col,
  Modal,
  Form,
  ListGroup,
} from "react-bootstrap";
import Swal from "sweetalert2";
import NavbarUser from "../../../../components/bootstrap/user_navBar";
import GetDataService from "../../../../services/http/get-data-services";
import PostDataService from "../../../../services/http/post-data-services";
import jsPDF from "jspdf";
import axios from "axios";

interface Counselor {
  _id: string;
  fullname?: string;
  email: string;
  nic: string;
  age: number;
  phoneNumber: string;
  counselorId: string;
  experience: string;
  educationInstitute: string;
  degreeOrDiploma: string;
  requestPending?: boolean;
}

interface Report {
  firstName: string;
  lastName: string;
  email: string;
  nic: string;
  age: string;
  phoneNumber: string;
}

const ApprovedPersonList = () => {
  const [approvedPersonData, setApprovedPersonData] = useState<Counselor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCounselor, setSelectedCounselor] = useState<Counselor | null>(
    null
  );
  const [searchName, setSearchName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [statusMap, setStatusMap] = useState<{ [email: string]: number }>({});
  const [user, setUser] = useState<Report | null>(null);
  const [report, setReport] = useState<any | null>(null);
   const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchapprovedPersonData = async () => {
      const userEmail = localStorage.getItem("email");
      if (!userEmail) {
        setError("Email not found in local storage.");
        return;
      }

      const headers = { "X-User-Email": userEmail };

      try {
        const result = await GetDataService("/approvedPerson_counselors");
        if (result.success) {
          setApprovedPersonData(result.data);
        } else {
          console.error("Error fetching approval data:", result.message);
        }

        const userResult = await GetDataService("/requests", { headers });
        if (userResult.success) {
          const statusMapping = userResult.data.reduce(
            (map: any, request: any) => {
              map[request.counselorEmail] = request.status;
              return map;
            },
            {}
          );
          setStatusMap(statusMapping);
        } else {
          setError("Failed to fetch user data.");
        }
      } catch (error) {
        console.error("Error fetching approval data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchapprovedPersonData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const email = localStorage.getItem("email");
      if (!email) {
        setError("Email not found in local storage.");
        return;
      }

      const headers = {
        "X-User-Email": email,
      };

      try {
        const userResult = await GetDataService("/api/get-user", { headers });
        console.log(userResult);
        if (userResult.success) {
          setUser(userResult.data);
        } else {
          setError("Failed to fetch user data.");
        }

        const reportResult = await GetDataService("/api/get-report", {
          headers,
        });
        console.log(reportResult);
        if (reportResult.success) {
          setReport(reportResult.data);
        } else {
          setError("Failed to fetch report data.");
        }

        setError(null);
      } catch (err) {
        setError("An error occurred while fetching data.");
        console.error("Fetch data error:", err);
      }
    }

    fetchData();
  }, []);

  const handleShowModal = async (counselor: Counselor) => {
    setSelectedCounselor(counselor);
  
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/propic", {
        params: { email: counselor.email },
      });
      if (response.data.success) {
        setProfilePictureUrl(response.data.url);
      } else {
        setProfilePictureUrl(null);
      }
    } catch {
      setProfilePictureUrl(null);
    }
  };
  

  const handleCloseModal = () => {
    setSelectedCounselor(null);
  };

  const handleRequest = async (counselor: Counselor) => {
    const userFullname = localStorage.getItem("fullname");
    const userEmail = localStorage.getItem("email");
    const requestData = {
      counselorFullname: counselor.fullname,
      counselorEmail: counselor.email,
      userFullname,
      userEmail,
      status: 0,
    };

    const result = await PostDataService("/createRequest", requestData);
    if (result.success) {
      Swal.fire({
        icon: "success",
        title: "Successfully requested",
        text: "Your request has been submitted.",
        confirmButtonText: "OK",
      });
      setApprovedPersonData((prevData) =>
        prevData.map((item) =>
          item._id === counselor._id ? { ...item, requestPending: true } : item
        )
      );
      setStatusMap((prevMap) => ({ ...prevMap, [counselor.email]: 0 }));
    } else {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: result.message.message,
        confirmButtonText: "OK",
      });
    }
  };

  const getStatusLabel = (email: string) => {
    switch (statusMap[email]) {
      case 0:
        return { label: "Pending", variant: "info" }; // Light blue
      case 1:
        return { label: "Accepted", variant: "success" }; // Green
      case -1:
        return { label: "Rejected", variant: "danger" }; // Red
      default:
        return { label: "Request", variant: "primary" }; // Current blue
    }
  };

  const isButtonDisabled = (email: string) => {
    const status = statusMap[email];
    // Disable the button for "Pending", "Accepted", or "Rejected" statuses
    return status === 0 || status === 1 || status === -1;
  };

  const filteredData = approvedPersonData.filter((counselor) =>
    (counselor.fullname || "").toLowerCase().includes(searchName.toLowerCase())
  );

  return (
    <>
      <NavbarUser />
      <Container>
        <Row className="mb-3">
          <Col md={{ span: 6, offset: 3 }}>
            <Form.Control
              type="text"
              placeholder="Search by Name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            {loading ? (
              <div className="text-center py-3">
                <h5>Loading ...</h5>
              </div>
            ) : filteredData.length === 0 ? (
              <div className="text-center py-3">
                <h5>No Counselors Found</h5>
              </div>
            ) : (
              <ListGroup>
                {filteredData.map((counselor) => (
                  <ListGroup.Item
                    key={counselor._id}
                    action
                    onClick={() => handleShowModal(counselor)}
                  >
                    {counselor.fullname || "N/A"}
                    <Button
                      variant={getStatusLabel(counselor.email).variant}
                      className="btn-status w-25 text-center float-end"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRequest(counselor);
                      }}
                      disabled={isButtonDisabled(counselor.email)}
                    >
                      {getStatusLabel(counselor.email).label}
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Col>
        </Row>

        <Modal show={!!selectedCounselor} onHide={handleCloseModal} centered>
  <Modal.Header closeButton>
    <Modal.Title>Counselor Details</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {selectedCounselor && (
      <>
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
          <strong>Full Name:</strong> {selectedCounselor.fullname}
        </p>
        {statusMap[selectedCounselor.email] === 1 && (
          <>
            <p>
              <strong>Email:</strong> {selectedCounselor.email}
            </p>
            <p>
              <strong>Phone Number:</strong> {selectedCounselor.phoneNumber}
            </p>
          </>
        )}
        <p>
          <strong>NIC:</strong> {selectedCounselor.nic}
        </p>
        <p>
          <strong>Age:</strong> {selectedCounselor.age}
        </p>
        <p>
          <strong>Counselor ID:</strong> {selectedCounselor.counselorId}
        </p>
        <p>
          <strong>Experience:</strong> {selectedCounselor.experience}
        </p>
        <p>
          <strong>Education Institute:</strong>{" "}
          {selectedCounselor.educationInstitute}
        </p>
        <p>
          <strong>Degree/Diploma:</strong>{" "}
          {selectedCounselor.degreeOrDiploma}
        </p>
      </>
    )}
  </Modal.Body>
</Modal>


      </Container>
    </>
  );
};

export default ApprovedPersonList;
