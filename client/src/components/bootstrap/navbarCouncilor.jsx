import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getCounselorStatus } from '../../services/http/checkStatus';
import Logo from '../../pictures/logo_counciling.jpg';

const NavBar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const email = localStorage.getItem('email');

  const [status, setStatus] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const result = await getCounselorStatus(email);
        if ([0, 1, -1].includes(result)) {
          setStatus(result);
        } else {
          setStatus(null);
        }
      } catch (error) {
        console.error('Error in fetchStatus:', error);
      }
    };
    fetchStatus();
  }, [email]);

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log me out!',
      cancelButtonText: 'No, stay here',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        window.location.reload();
      }
    });
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="custom-navbar">
      <Container fluid>
        {/* Logo in the left corner */}
        {/* <Navbar.Brand href="#" className="ms-3">
          <img src={Logo} alt="Counseling Platform Logo" height="40" />
        </Navbar.Brand> */}
        <Navbar.Brand href="#" className="ms-3">Counseling Platform</Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Navbar Links */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto fw-bold">
            <Nav.Link as={Link} to="/profile_cp" className="text-white mx-4">Profile</Nav.Link>
            {status === 1 && (
              <>
                <Nav.Link as={Link} to="/CouncilorRequestList" className="text-white mx-4">User Requests</Nav.Link>
                <Nav.Link as={Link} to="/ChatCouncilor" className="text-white mx-4">Chat</Nav.Link>
                <Nav.Link as={Link} to="/AppointmentCouncilor" className="text-white mx-4">Appointment</Nav.Link>
              </>
            )}
          </Nav>

          {/* Logout in the right corner */}
          <Nav>
            <Nav.Link onClick={handleLogout} className="text-white fw-bold ms-5">Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
