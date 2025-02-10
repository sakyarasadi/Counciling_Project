import React from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Logo from '../../pictures/logo_counciling.jpg'

const NavbarUser = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log me out!",
      cancelButtonText: "No, stay here",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    });
  };

  const navigateToLogin = () => {
    navigate("/login");
  };

  const navigateToUserRegister = () => {
    navigate("/register");
  };

  const navigateToCounselorPsychiatristRegister = () => {
    navigate("/approval");
  };

  return (
    <Navbar bg="light" expand="lg" className="p-3 shadow-sm border-bottom">
      <Navbar.Brand as={Link} to="/" className="fw-bold text-primary">
        Counseling Platform
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
          <Nav.Link as={Link} to="/depression" className="">
            Diseases
          </Nav.Link>
          {token ? (
            <>
              <Nav.Link as={Link} to="/question-check" className="btn me-2">
                Start
              </Nav.Link>
              <Nav.Link as={Link} to="/report" className="btn me-2">
                Report
              </Nav.Link>
              <Nav.Link as={Link} to="/councilorRequest" className="btn me-2">
                Councilors
              </Nav.Link>
              <Nav.Link as={Link} to="/Userchat" className="btn me-2">
                Chat
              </Nav.Link>
              <Nav.Link as={Link} to="/AppointmentUser" className="btn me-2">
              Appointment
              </Nav.Link>
              <Nav.Link onClick={handleLogout} className="btn">
                Logout
              </Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link onClick={navigateToLogin} className="btn me-2">
                Login
              </Nav.Link>
              <NavDropdown title="Register" id="registerDropdown">
                <NavDropdown.Item onClick={navigateToUserRegister}>
                  User
                </NavDropdown.Item>
                <NavDropdown.Item onClick={navigateToCounselorPsychiatristRegister}>
                  Counselor/Psychiatrist
                </NavDropdown.Item>
              </NavDropdown>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavbarUser;
