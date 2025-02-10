import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  Button,
  Table,
  Container,
  Row,
  Col,
  Modal,
  Form,
} from "react-bootstrap";
import GetDataService from "../../../../services/http/get-data-services";
import PostDataService from "../../../../services/http/post-data-services";
import "../request_approval/approval.css";
import NavBar from "../../../../components/bootstrap/navBar";
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
}

const ApprovalList = () => {
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(
    null
  );
  const [approvalData, setApprovalData] = useState<Counselor[]>([]);
  const [filteredData, setFilteredData] = useState<Counselor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCounselor, setSelectedCounselor] = useState<Counselor | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const tableHeaders = ["Full Name", "Email", "NIC", "Action"];

  // Function to fetch approved counselors
  const getApprovedCounselors = async () => {
    const response = await GetDataService("/approved_counselors");
    if (response.success && response.data) {
      setApprovalData(response.data);
      setFilteredData(response.data);
    } else {
      console.error("Error fetching approval data:", response.message.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    getApprovedCounselors();
  }, []);

  const handleApprovalSend = async (email: string, action: string) => {
    const status = action === "approve" ? 1 : -1;

    let reason = "";
    if (action === "reject") {
      const { value: inputReason } = await Swal.fire({
        title: "Rejection Reason",
        input: "textarea",
        inputPlaceholder: "Enter the reason for rejection...",
        inputAttributes: {
          "aria-label": "Enter the reason for rejection",
        },
        showCancelButton: true,
        confirmButtonText: "Submit",
        cancelButtonText: "Cancel",
      });

      if (inputReason === undefined || inputReason.trim() === "") {
        Swal.fire({
          title: "Error!",
          text: "You must provide a reason for rejection.",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }
      reason = inputReason;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text:
        action === "approve"
          ? "Do you want to approve this counselor?"
          : "Do you want to reject this counselor?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (result.isConfirmed) {
      try {
        const payload = action === "approve" ? { status } : { status, reason };
        const response = await PostDataService(
          `/approve_counselor/${email}`,
          payload
        );

        if (response && response.success) {
          Swal.fire({
            title: "Success!",
            text:
              action === "approve"
                ? "Counselor approved successfully."
                : "Counselor rejected successfully.",
            icon: "success",
            confirmButtonText: "OK",
          });

          // Update the state to remove the counselor
          setApprovalData((prevData) =>
            prevData.filter((counselor) => counselor.email !== email)
          );
          setFilteredData((prevData) =>
            prevData.filter((counselor) => counselor.email !== email)
          );
        } else {
          Swal.fire({
            title: response?.message?.title || "Error!",
            text: response?.message?.message || "An unknown error occurred.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "An error occurred while processing your request.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  const handleShowDetails = (counselor: Counselor) => {
    setSelectedCounselor(counselor);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    const filtered = approvalData.filter((counselor) =>
      counselor.nic.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filtered);
  };

  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (selectedCounselor?.email) {
        try {
          const response = await axios.get("http://127.0.0.1:5000/api/propic", {
            params: { email: selectedCounselor.email },
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
  }, [selectedCounselor]);

  return (
    <>
      <NavBar />
      <Container>
        <Row className="text-center">
          <Col>
            <h2 className="text-dark fw-bold mb-4">Counselor Requests</h2>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6} className="mx-auto">
            <Form.Control
              type="text"
              placeholder="Search by NIC"
              value={searchQuery}
              onChange={handleSearch}
              className="mb-3"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  {tableHeaders.map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={tableHeaders.length}
                      className="text-center py-3"
                    >
                      <h5>Loading ...</h5>
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={tableHeaders.length}
                      className="text-center py-3"
                    >
                      <h5>No Approvals Found</h5>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((counselor) => (
                    <tr key={counselor._id}>
                      <td>
                        <Button
                          variant="link"
                          onClick={() => handleShowDetails(counselor)}
                        >
                          {counselor.fullname || "N/A"}
                        </Button>
                      </td>
                      <td>{counselor.email}</td>
                      <td>{counselor.nic}</td>
                      <td>{counselor.counselorId}</td>
                      <td>
                        <Button
                          variant="success"
                          className="me-2"
                          onClick={() =>
                            handleApprovalSend(counselor.email, "approve")
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() =>
                            handleApprovalSend(counselor.email, "reject")
                          }
                        >
                          Reject
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Col>
        </Row>

        {/* Modal for displaying counselor details */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedCounselor?.fullname || "Counselor Details"}
            </Modal.Title>
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
                  <strong>Email:</strong> {selectedCounselor.email}
                </p>
                <p>
                  <strong>NIC:</strong> {selectedCounselor.nic}
                </p>
                <p>
                  <strong>Age:</strong> {selectedCounselor.age}
                </p>
                <p>
                  <strong>Phone Number:</strong> {selectedCounselor.phoneNumber}
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
          <Modal.Footer>
            {/* <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button> */}
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default ApprovalList;
