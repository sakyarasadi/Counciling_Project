import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import NavbarUser from '../../../../components/bootstrap/user_navBar';
import 'bootstrap/dist/css/bootstrap.min.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate('/question-check');
  };

  return (
    <>
      <NavbarUser />
      <Container fluid className="vh-100 d-flex align-items-center justify-content-center bg-light">
        <Row className="w-100 justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <Card 
              className="text-center shadow-lg border-0 rounded-4 hover-effect" 
              onClick={handleCardClick} 
              style={{ cursor: 'pointer' }}
            >
              <Card.Body className="p-5">
                <Card.Title className="mb-4 text-primary fs-3 fw-bold">
                  Start Answering Questions
                </Card.Title>
                <Card.Text className="text-muted mb-4">
                  Click below to begin answering the questionnaire and unlock insights.
                </Card.Text>
                <Button variant="primary" size="lg" className="rounded-pill">
                  Start
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default LandingPage;
