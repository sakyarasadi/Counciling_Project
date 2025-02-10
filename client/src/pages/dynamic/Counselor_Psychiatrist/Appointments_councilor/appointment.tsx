// import React, { useEffect, useState } from "react";
// import Swal from "sweetalert2";
// import NavCouncilor from "../../../../components/bootstrap/navbarCouncilor";
// import GetDataService from "../../../../services/http/get-data-services";
// import PostDataService from "../../../../services/http/post-data-services";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Button,
//   Form,
//   Spinner,
//   Alert,
// } from "react-bootstrap";

// function Appointment() {
//   interface Appointment {
//     id: string;
//     user_fullname: string;
//     user_email: string;
//     status: number;
//     meeting_link?: string;
//     date: string;
//   }

//   const [appointments, setAppointments] = useState<Appointment[]>([]);
//   const [selectedAppointment, setSelectedAppointment] = useState<any | null>(
//     null
//   );
//   const [link, setLink] = useState("");
//   const counselorEmail = localStorage.getItem("email");

//   useEffect(() => {
//     async function fetchAppointments() {
//       if (counselorEmail) {
//         const result = await GetDataService(
//           `/appointments_coun?counselor_email=${counselorEmail}`
//         );
//         if (result.success) {
//           console.log(result.data); 
//           setAppointments(result.data); 
//         } else {
//           Swal.fire("Error", result.message.message, "error");
//         }
//       }
//     }
//     fetchAppointments();
//   }, [counselorEmail]);

//   const handleAccept = (appointment: any) => {
//     setSelectedAppointment(appointment);
//   };

//   const handleSubmitLink = async () => {
//     if (selectedAppointment && link) {
//       const data = {
//         appointmentId: selectedAppointment.id,
//         status: 1,
//         meetingLink: link,
//       };
//       const data2 = {
//         counselor_email: selectedAppointment.counselor_email,
//         counselor_fullname: selectedAppointment.counselor_fullname,
//         user_fullname: selectedAppointment.user_fullname,
//         user_email: selectedAppointment.user_email,
//         date: selectedAppointment.date,
//       };
//       console.log("data2",data2);
  
//       try {
//         // First API call to update appointment
//         const result = await PostDataService("/appointments/update", data);
  
//         if (result.success) {
//           // Second API call to send appointment email
//           const emailResult = await PostDataService("/sendAppointmentEmail", data2);
//           console.log("emailResult",emailResult);
  
//           if (emailResult.success) {
//             Swal.fire(
//               "Success",
//               "Appointment accepted and link added successfully!",
//               "success"
//             );
  
//             // Update appointments list
//             setAppointments(
//               appointments.map((app) =>
//                 app.id === selectedAppointment.id
//                   ? { ...app, status: 1, meetingLink: link }
//                   : app
//               )
//             );
//             setSelectedAppointment(null);
//             setLink("");
//           } else {
//             Swal.fire("Error", emailResult.message.message, "error");
//           }
//         } else {
//           Swal.fire("Error", result.message.message, "error");
//         }
//       } catch (error) {
//         Swal.fire("Error", "Something went wrong. Please try again later.", "error");
//       }
//     }
//   };
  
//   const handleReject = async (appointmentId: string) => {
//     const data = {
//       appointmentId,
//       status: -1,
//     };
//     const result = await PostDataService("/appointments/update", data);
//     if (result.success) {
//       Swal.fire("Success", "Appointment rejected successfully!", "success");
//       setAppointments(
//         appointments.map((app) =>
//           app.id === appointmentId ? { ...app, status: -1 } : app
//         )
//       );
//     } else {
//       Swal.fire("Error", result.message.message, "error");
//     }
//   };

//   return (
//     <>
//       <NavCouncilor />
//       <Container className="my-5">
//         <h1 className="text-center mb-4">Appointments</h1>
//         <Row>
//           {appointments.length ? (
//             appointments.map((appointment) => (
//               <Col key={appointment.id} md={6} className="mb-4">
//                 <Card>
//                   <Card.Body>
//                     <Card.Title>{appointment.user_fullname}</Card.Title>
//                     <Card.Text>Email: {appointment.user_email}</Card.Text>
//                     <Card.Text>Date : {appointment.date}</Card.Text>
//                     {appointment.status === 1 ? (
//                       <Alert variant="success">
//                         Accepted - Link:{" "}
//                         <a
//                           href={appointment.meeting_link}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                         >
//                           {appointment.meeting_link}
//                         </a>
//                       </Alert>
//                     ) : appointment.status === 0 ? (
//                       <>
//                         <Button
//                           variant="success"
//                           onClick={() => handleAccept(appointment)}
//                         >
//                           Accept
//                         </Button>{" "}
//                         <Button
//                           variant="danger"
//                           onClick={() => handleReject(appointment.id)}
//                         >
//                           Reject
//                         </Button>
//                       </>
//                     ) : (
//                       <Alert variant="danger">Rejected</Alert>
//                     )}
//                   </Card.Body>
//                 </Card>
//               </Col>
//             ))
//           ) : (
//             <Alert variant="info">No appointments available.</Alert>
//           )}
//         </Row>
//         {selectedAppointment && (
//           <Form>
//             <Form.Group controlId="meetingLink">
//               <Form.Label>Add Meeting Link</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={link}
//                 onChange={(e) => setLink(e.target.value)}
//               />
//             </Form.Group>
//             <Button
//               variant="primary"
//               className="mt-3"
//               onClick={handleSubmitLink}
//             >
//               Submit Link
//             </Button>
//           </Form>
//         )}
//       </Container>
//     </>
//   );
// }

// export default Appointment;


import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import NavCouncilor from "../../../../components/bootstrap/navbarCouncilor";
import GetDataService from "../../../../services/http/get-data-services";
import PostDataService from "../../../../services/http/post-data-services";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Modal,
  Form,
} from "react-bootstrap";

function Appointment() {
  interface Appointment {
    id: string;
    user_fullname: string;
    user_email: string;
    status: number;
    meeting_link?: string;
    date: string;
  }

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(
    null
  );
  const [modalType, setModalType] = useState<"accept" | "reject" | null>(null);
  const [link, setLink] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const counselorEmail = localStorage.getItem("email");

  useEffect(() => {
    async function fetchAppointments() {
      if (counselorEmail) {
        const result = await GetDataService(
          `/appointments_coun?counselor_email=${counselorEmail}`
        );
        if (result.success) {
          setAppointments(result.data);
        } else {
          Swal.fire("Error", result.message.message, "error");
        }
      }
    }
    fetchAppointments();
  }, [counselorEmail]);

  const handleAccept = (appointment: any) => {
    setSelectedAppointment(appointment);
    setModalType("accept");
  };

  const handleReject = (appointment: any) => {
    setSelectedAppointment(appointment);
    setModalType("reject");
  };

  // const handleSubmitLink = async () => {
  //   if (!selectedAppointment || !link) return;

  //   const data = {
  //     appointmentId: selectedAppointment.id,
  //     status: 1,
  //     meetingLink: link,
  //   };

  //   try {
  //     const result = await PostDataService("/appointments/update", data);
  //     if (result.success) {
  //       Swal.fire("Success", "Appointment accepted successfully!", "success");
  //       setAppointments(
  //         appointments.map((app) =>
  //           app.id === selectedAppointment.id
  //             ? { ...app, status: 1, meeting_link: link }
  //             : app
  //         )
  //       );
  //       setModalType(null);
  //       setSelectedAppointment(null);
  //       setLink("");
  //     } else {
  //       Swal.fire("Error", result.message.message, "error");
  //     }
  //   } catch (error) {
  //     Swal.fire("Error", "Something went wrong. Please try again.", "error");
  //   }
  // };

    const handleSubmitLink = async () => {
    if (selectedAppointment && link) {
      const data = {
        appointmentId: selectedAppointment.id,
        status: 1,
        meetingLink: link,
      };
      const data2 = {
        counselor_email: selectedAppointment.counselor_email,
        counselor_fullname: selectedAppointment.counselor_fullname,
        user_fullname: selectedAppointment.user_fullname,
        user_email: selectedAppointment.user_email,
        date: selectedAppointment.date,
      };
      console.log("data2",data2);
  
      try {
        // First API call to update appointment
        const result = await PostDataService("/appointments/update", data);
  
        if (result.success) {
          // Second API call to send appointment email
          const emailResult = await PostDataService("/sendAppointmentEmail", data2);
          console.log("emailResult",emailResult);
  
          if (emailResult.success) {
            Swal.fire(
              "Success",
              "Appointment accepted and link added successfully!",
              "success"
            );
  
            // Update appointments list
            setAppointments(
              appointments.map((app) =>
                app.id === selectedAppointment.id
                  ? { ...app, status: 1, meetingLink: link }
                  : app
              )
            );
            setAppointments(
              appointments.map((app) =>
                app.id === selectedAppointment.id
                  ? { ...app, status: 1, meeting_link: link }
                  : app
              )
            );
            setModalType(null);
            setSelectedAppointment(null);
            setLink("");
          } else {
            Swal.fire("Error", emailResult.message.message, "error");
          }
        } else {
          Swal.fire("Error", result.message.message, "error");
        }
      } catch (error) {
        Swal.fire("Error", "Something went wrong. Please try again later.", "error");
      }
    }
  };

  const handleRejectAppointment = async () => {
    if (!selectedAppointment || !rejectReason) return;

    const data = {
      appointmentId: selectedAppointment.id,
      status: -1,
      rejectReason,
    };

    try {
      const result = await PostDataService("/appointments/update", data);
      if (result.success) {
        Swal.fire("Success", "Appointment rejected successfully!", "success");
        setAppointments(
          appointments.map((app) =>
            app.id === selectedAppointment.id ? { ...app, status: -1 } : app
          )
        );
        setModalType(null);
        setSelectedAppointment(null);
        setRejectReason("");
      } else {
        Swal.fire("Error", result.message.message, "error");
      }
    } catch (error) {
      Swal.fire("Error", "Something went wrong. Please try again.", "error");
    }
  };

  return (
    <>
      <NavCouncilor />
      <Container className="my-5">
        <h1 className="text-center mb-4">Appointments</h1>
        <Row>
          {appointments.length ? (
            appointments.map((appointment) => (
              <Col key={appointment.id} md={6} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title>{appointment.user_fullname}</Card.Title>
                    <Card.Text>Email: {appointment.user_email}</Card.Text>
                    <Card.Text>Date: {appointment.date}</Card.Text>
                    {appointment.status === 1 ? (
                      <Alert variant="success">
                        Accepted - Link:{" "}
                        <a
                          href={appointment.meeting_link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {appointment.meeting_link}
                        </a>
                      </Alert>
                    ) : appointment.status === 0 ? (
                      <>
                        <Button
                          variant="success"
                          onClick={() => handleAccept(appointment)}
                        >
                          Accept
                        </Button>{" "}
                        <Button
                          variant="danger"
                          onClick={() => handleReject(appointment)}
                        >
                          Reject
                        </Button>
                      </>
                    ) : (
                      <Alert variant="danger">Rejected</Alert>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Alert variant="info">No appointments available.</Alert>
          )}
        </Row>

        {/* Accept Modal */}
        <Modal
          show={modalType === "accept"}
          onHide={() => setModalType(null)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Submit Meeting Link</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="meetingLink">
              <Form.Label>Meeting Link</Form.Label>
              <Form.Control
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setModalType(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmitLink}>
              Submit Link
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Reject Modal */}
        <Modal
          show={modalType === "reject"}
          onHide={() => setModalType(null)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Reject Appointment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="rejectReason">
              <Form.Label>Reason for Rejection</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setModalType(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleRejectAppointment}>
              Reject
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}

export default Appointment;
