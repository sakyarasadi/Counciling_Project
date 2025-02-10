import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import NavbarUser from "../../../../components/bootstrap/user_navBar";
import GetDataService from "../../../../services/http/get-data-services";
import PostDataService from "../../../../services/http/post-data-services";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Spinner,
  Alert,
  Badge,
  Modal,
} from "react-bootstrap";

interface RequestData {
  id: string;
  counselorFullname: string;
  counselorEmail: string;
  userFullname: string;
  userEmail: string;
  status: number;
}

interface Appointment {
  id: string;
  userFullname: string;
  userEmail: string;
  counselorFullname: string;
  counselorEmail: string;
  date: string;
  status: number;
  meeting_link?: string;
  reject_reason?: string;
  counselor_fullname?: string;
}

function Appointment() {
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [selectedCounselor, setSelectedCounselor] =
    useState<RequestData | null>(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showModal, setShowModal] = useState(false);

  const user_email = localStorage.getItem("email");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const email = localStorage.getItem("email");
        if (email) {
          const headers = { "X-User-Email": email };
          const response = await GetDataService("/requests", { headers });
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
    async function fetchAppointments() {
      if (user_email) {
        const result = await GetDataService(
          `/appointments?user_email=${user_email}`
        );
        if (result.success) {
          setAppointments(result.data);
        } else {
          Swal.fire("Error", result.message.message, "error");
        }
      }
    }
    fetchAppointments();
  }, [user_email]);

  const handleSelectCounselor = (counselor: RequestData) => {
    setSelectedCounselor(counselor);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!selectedCounselor || !appointmentDate) {
      Swal.fire(
        "Incomplete Information",
        "Please select a counselor and date",
        "warning"
      );
      return;
    }
  
    const today = new Date();
    const selectedDate = new Date(appointmentDate);
    if (selectedDate <= today) {
      Swal.fire(
        "Invalid Date",
        "You can only select dates from tomorrow onward.",
        "error"
      );
      return;
    }
  
    const appointmentData = {
      userFullname: selectedCounselor.userFullname,
      userEmail: selectedCounselor.userEmail,
      counselorFullname: selectedCounselor.counselorFullname,
      counselorEmail: selectedCounselor.counselorEmail,
      date: appointmentDate,
      status: 0,
    };
  
    const response = await PostDataService(
      "/appointmentsUser",
      appointmentData
    );
  
    if (response.success) {
      Swal.fire("Success", "Appointment scheduled successfully!", "success");
      setShowModal(false);
      setAppointmentDate("");
      setSelectedCounselor(null);
  
      // Fetch updated appointments list
      if (user_email) {
        const result = await GetDataService(
          `/appointments?user_email=${user_email}`
        );
        if (result.success) {
          setAppointments(result.data);
        }
      }
    } else {
      Swal.fire("Error", "Error scheduling appointment", "error");
    }
  };
  

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" />
        <p>Loading...</p>
      </Container>
    );
  }

  return (
    <>
      <NavbarUser />
      <Container className="my-5">
        <h1 className="text-center mb-4">Schedule an Appointment</h1>

        <Row>
          {/* Appointments on the Left */}
          <Col md={6}>
            <h3 className="mb-4">Your Appointments</h3>
            {appointments.length ? (
              appointments.map((appointment) => (
                <Card key={appointment.id} className="my-2">
                  <Card.Body>
                    <Card.Title>
                      Appointment with {appointment.counselor_fullname}
                    </Card.Title>
                    <Card.Text>
                      <strong>Date:</strong> {appointment.date}
                    </Card.Text>
                    <Card.Text>
                      <Badge
                        bg={
                          appointment.status === -1
                            ? "danger"
                            : appointment.status === 1
                            ? "success"
                            : "warning"
                        }
                      >
                        {appointment.status === -1 && "Rejected"}
                        {appointment.status === 1 && "Approved"}
                        {appointment.status === 0 && "Pending"}
                      </Badge>
                    </Card.Text>
                    {appointment.status === 1 && appointment.meeting_link && (
                      <Card.Text>
                        <strong>Meeting Link:</strong>{" "}
                        <a
                          href={appointment.meeting_link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {appointment.meeting_link}
                        </a>
                      </Card.Text>
                    )}
                    {appointment.status === -1 && appointment.reject_reason && (
                      <Card.Text>
                        <strong>Rejected Reason:</strong>{" "}
                        {appointment.reject_reason}
                      </Card.Text>
                    )}
                  </Card.Body>
                </Card>
              ))
            ) : (
              <Alert variant="info">No appointments found.</Alert>
            )}
          </Col>

          {/* Counselor Selection on the Right */}
          <Col md={6}>
            <h2>Select a Counselor</h2>
            {requests.length ? (
              requests.map((counselor) => (
                <Card
                  key={counselor.id}
                  className="my-2"
                  onClick={() => handleSelectCounselor(counselor)}
                  style={{ cursor: "pointer" }}
                >
                  <Card.Body>
                    <Card.Title>{counselor.counselorFullname}</Card.Title>
                    <Card.Text>{counselor.counselorEmail}</Card.Text>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <Alert variant="info">
                No available counselors at the moment.
              </Alert>
            )}
          </Col>
        </Row>

        {/* Modal for Scheduling */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Schedule Appointment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedCounselor && (
              <>
                <h4>Counselor: {selectedCounselor.counselorFullname}</h4>
                <Form>
                  <Form.Group controlId="appointmentDate">
                    <Form.Label>Select Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]} // Set min to today's date
                    />
                  </Form.Group>
                  <Button
                    variant="primary"
                    className="mt-3"
                    onClick={handleSubmit}
                    disabled={!appointmentDate}
                  >
                    Submit Appointment
                  </Button>
                </Form>
              </>
            )}
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
}

export default Appointment;
