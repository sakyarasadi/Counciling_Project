import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  Container,
  Row,
  Col,
  Modal,
  Form,
} from "react-bootstrap";
import NavBar from "../../../../components/bootstrap/navBar";
import GetDataService from "../../../../services/http/get-data-services";
import PostDataService from "../../../../services/http/post-data-services";
import "./approvedPerson.css";
import Swal from "sweetalert2";
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

const ApprovedPersonList = () => {
  const [approvedPersonData, setApprovedPersonData] = useState<Counselor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCounselor, setSelectedCounselor] = useState<Counselor | null>(
    null
  );
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const [searchNIC, setSearchNIC] = useState("");

  const tableHeaders = ["Full Name", "Email", "NIC", "Action"];

  useEffect(() => {
    const fetchapprovedPersonData = async () => {
      try {
        const result = await GetDataService("/approvedPerson_counselors");
        if (result.success) {
          setApprovedPersonData(result.data);
        } else {
          console.error("Error fetching approval data:", result.message);
        }
      } catch (error) {
        console.error("Error fetching approval data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchapprovedPersonData();
  }, []);

  const handleShowModal = (counselor: Counselor) => {
    setSelectedCounselor(counselor);
  };

  const handleCloseModal = () => {
    setSelectedCounselor(null);
  };

  const filteredData = approvedPersonData.filter((counselor) =>
    counselor.nic.toLowerCase().includes(searchNIC.toLowerCase())
  );

  const handleDelete = async (email: string) => {
    const status = -1;
    try {
      const confirmDelete = await Swal.fire({
        title: "Are you sure?",
        text: "This action will delete the counselor and cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });

      if (confirmDelete.isConfirmed) {
        const result = await PostDataService(
          "/update_counselor_status_delete",
          { email, status }
        );
        if (result.success) {
          Swal.fire("Deleted!", "The counselor has been deleted.", "success");
          setApprovedPersonData((prev) =>
            prev.filter((counselor) => counselor.email !== email)
          );
        } else {
          Swal.fire(
            "Error!",
            `${result.message.title}: ${result.message.message}`,
            "error"
          );
        }
      }
    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire(
        "Error!",
        "An error occurred while updating the status.",
        "error"
      );
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
            <h2 className="text-dark fw-bold mb-4">Approved Councillors</h2>
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
                      <h5>No Counselors Found</h5>
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
                      <td>
                        <Button
                          variant="danger"
                          onClick={() => handleDelete(counselor.email)}
                        >
                          Delete
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

export default ApprovedPersonList;
