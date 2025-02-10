import React, { useEffect, useState } from "react";
import GetDataService from "../../services/http/get-data-services"; 
import { Container, Spinner, Card } from "react-bootstrap"; 

const PdfComponent: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const email = localStorage.getItem("email");
      if (!email) {
        setError("Email not found in local storage.");
        return;
      }

      const headers = {
        "X-User-Email": email,
      };

      try {
        const userResult = await GetDataService("/api/get-user", { headers });
        if (userResult.success) {
          setUser(userResult.data);
        } else {
          setError("Failed to fetch user data.");
        }

        const reportResult = await GetDataService("/api/get-report", { headers });
        if (reportResult.success) {
          setReport(reportResult.data);
        } else {
          setError("Failed to fetch report data.");
        }

        setError(null);
      } catch (err) {
        setError("An error occurred while fetching data.");
        console.error("Fetch data error:", err);
      }
    }

    fetchData();
  }, []);


  return (
    <Container className="py-4">
      {error && <p className="text-danger">{error}</p>}

      {user ? (
        <Card className="mb-4">
          <Card.Body>
            <h4>User Information</h4>
            <p><strong>Full Name:</strong> {user.firstName} {user.lastName}</p>
            <p><strong>Age:</strong> {user.age}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>NIC:</strong> {user.nic}</p>
          </Card.Body>
        </Card>
      ) : (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading user information...</span>
        </Spinner>
      )}

      {report ? (
        <>
          <Card className="mb-4">
            <Card.Body>
              <h5 className="text-secondary">Questions and Answers</h5>
              {report.questions.map((q: { question: string }, index: number) => (
                <div key={index} className="mb-2">
                  <strong>{q.question}</strong>
                  <p>{report.answers[index]}</p>
                </div>
              ))}
              <p><strong>Updated at:</strong> {report.created_at}</p>
            </Card.Body>
          </Card>
        </>
      ) : (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading report information...</span>
        </Spinner>
      )}
    </Container>
  );
};

export default PdfComponent;
