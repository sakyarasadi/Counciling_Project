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
import NavBar from "../../../../components/bootstrap/navBar";
import "./approvalDelete.css";
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

const ApprovalDeleteList = () => {
  const [approvalDeleteData, setApprovalDeleteData] = useState<Counselor[]>([]);
  const [loading, setLoading] = useState(true);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(
    null
  );
  const [selectedCounselor, setSelectedCounselor] = useState<Counselor | null>(
    null
  );
  const [searchNIC, setSearchNIC] = useState("");

  const tableHeaders = ["Full Name", "Email", "NIC", "Counselor ID", "Action"];

  useEffect(() => {
    const fetchApprovalDeleteData = async () => {
      try {
        const response = await GetDataService("/approveddelete_counselors");
        if (response?.success) {
          setApprovalDeleteData(response.data);
        } else {
          console.error("Failed to fetch data:", response.message);
        }
      } catch (error) {
        console.error("Error fetching approval delete data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovalDeleteData();
  }, []);

  const handleShowModal = (counselor: Counselor) => {
    setSelectedCounselor(counselor);
  };

  const handleCloseModal = () => {
    setSelectedCounselor(null);
  };

  const filteredData = approvalDeleteData.filter((counselor) =>
    counselor.nic.toLowerCase().includes(searchNIC.toLowerCase())
  );

  const handleRestore = async (email: string) => {
    try {
      const response = await PostDataService(
        "/update_counselor_status_restore",
        { email, status: 0 }
      );

      if (response?.success) {
        Swal.fire("Success", "Counselor restored successfully!", "success");
        // Optionally refresh the table data
        setApprovalDeleteData((prevData) =>
          prevData.filter((counselor) => counselor.email !== email)
        );
      } else {
        Swal.fire(
          "Error",
          response.message?.message || "Failed to restore counselor",
          "error"
        );
      }
    } catch (error) {
      Swal.fire(
        "Error",
        "Something went wrong while restoring counselor",
        "error"
      );
      console.error(error);
    }
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
            <h2 className="text-dark fw-bold mb-4">Delete Counselors</h2>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={{ span: 6, offset: 3 }}>
            <Form.Control
              type="text"
              placeholder="Search by NIC"
              value={searchNIC}
              onChange={(e) => setSearchNIC(e.target.value)}
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
                          onClick={() => handleShowModal(counselor)}
                        >
                          {counselor.fullname || "N/A"}
                        </Button>
                      </td>
                      <td>{counselor.email}</td>
                      <td>{counselor.nic}</td>
                      <td>{counselor.counselorId}</td>
                      <td>
                        <Button
                          variant="primary"
                          onClick={() => handleRestore(counselor.email)}
                        >
                          Restore
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
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

export default ApprovalDeleteList;
