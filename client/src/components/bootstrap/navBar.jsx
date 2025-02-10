import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Logo from '../../pictures/logo_counciling.jpg'

const NavBar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  console.log(token);

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
        {/* Brand Name aligned to left */}
        <Navbar.Brand href="#" className="ms-3">Counseling Platform</Navbar.Brand>
        {/* <Navbar.Brand href="#" className="ms-3">
          <img src={Logo}/>
        </Navbar.Brand> */}

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Navbar links centered */}
        <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mx-auto">
            <Nav.Link as={Link} to="/approval-list" className="text-white mx-4">Counselor Requests</Nav.Link>
            <Nav.Link as={Link} to="/approvalDelete-list" className="text-white mx-4">Delete Counselors</Nav.Link>
            <Nav.Link as={Link} to="/approvedPerson-list" className="text-white mx-4">Approved Counselors</Nav.Link>
            <Nav.Link as={Link} to="/user-list" className="text-white mx-4">User List</Nav.Link>
          </Nav>

          {/* Logout Button aligned to the left with space from others */}
          <Nav>
            <Nav.Link onClick={handleLogout} className="text-white ms-5">Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
