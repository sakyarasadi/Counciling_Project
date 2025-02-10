import React, { useEffect, useState } from "react";
import { Button, Table, Container, Row, Col, Modal, Form } from "react-bootstrap";
import NavBar from "../../../../components/bootstrap/navBar";
import GetDataService from "../../../../services/http/get-data-services";
import "./userList.css"; // Custom CSS
import axios from "axios";

interface User {
  _id: string;
  firstName?: string;
  lastName: string;
  email: string;
  nic: number;
  phoneNumber: string;
  guardianName: string;
  guardianPhoneNumber: string;
  connectionWithUser: string;
}

const UserList = () => {
  const [UsersData, setUsersData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchNIC, setSearchNIC] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);

  const tableHeaders = ["First Name", "Last Name", "NIC", "Email"];

  // Function to fetch users from the backend
  const getUsers = async () => {
    const result = await GetDataService("/users_counselors");
    if (result.success) {
      setUsersData(result.data); // Assuming the data returned matches the User type
    } else {
      console.error("Error fetching users:", result.message.message);
    }
  };

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        setLoading(true);
        await getUsers();
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersData();
  }, []);

  const handleShowModal = (user: User) => {
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  const filteredData = UsersData.filter((user) =>
    user.nic.toString().includes(searchNIC)
  );

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

  return (
    <>
      <NavBar />
      <Container>
      <Row className="text-center">
          <Col>
            <h2 className="text-dark fw-bold mb-4">User List</h2>
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
                    <td colSpan={tableHeaders.length} className="text-center py-3">
                      <h5>Loading ...</h5>
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={tableHeaders.length} className="text-center py-3">
                      <h5>No Users Found</h5>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <Button
                          variant="link"
                          onClick={() => handleShowModal(user)}
                        >
                          {user.firstName || "N/A"}
                        </Button>
                      </td>
                      <td>{user.lastName}</td>
                      <td>{user.nic}</td>
                      <td>{user.email}</td>
                      {/* <td>
                        <Button
                          variant="primary"
                          onClick={() => alert("More Action")}
                        >
                          Update
                        </Button>
                      </td> */}
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Col>
        </Row>

        {/* Modal for showing user details */}
        <Modal show={!!selectedUser} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>User Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedUser && (
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
                <p><strong>Full Name:</strong> {selectedUser.firstName} {selectedUser.lastName}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>NIC:</strong> {selectedUser.nic}</p>
                <p><strong>Phone Number:</strong> {selectedUser.phoneNumber}</p>
                <p><strong>Guardian Name:</strong> {selectedUser.guardianName}</p>
                <p><strong>Guardian Phone Number:</strong> {selectedUser.guardianPhoneNumber}</p>
                <p><strong>Connection with User:</strong> {selectedUser.connectionWithUser}</p>
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

export default UserList;
