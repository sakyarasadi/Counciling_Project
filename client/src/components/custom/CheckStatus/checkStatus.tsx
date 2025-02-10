import React, { useEffect, useState } from 'react';
import { ProgressBar, Container, Row, Col, Alert } from 'react-bootstrap';
import { getCounselorStatus } from '../../../services/http/checkStatus';
import GetDataService from '../../../services/http/get-data-services';
import { useNavigate } from 'react-router-dom';
import './checkStatus.css';

type Status = 0 | 1 | -1;

const StatusBar: React.FC<{ email: string }> = ({ email }) => {
    const [status, setStatus] = useState<Status | null>(null);
    const [rejectionReason, setRejectionReason] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStatusAndReason = async () => {
            try {
                // Fetch the counselor status
                const statusResult = await getCounselorStatus(email);
                console.log('Status Result:', statusResult);

                // Set the status if valid
                if (statusResult === 0 || statusResult === 1 || statusResult === -1) {
                    setStatus(statusResult);

                    // If status is -1, fetch the profile to get rejection_reason
                    if (statusResult === -1) {
                        const emailFromLocalStorage = localStorage.getItem('email');
                        if (!emailFromLocalStorage) {
                            setError('Email not found in local storage.');
                            return;
                        }

                        const headers = {
                            'X-User-Email': emailFromLocalStorage,
                        };

                        const profileResult = await GetDataService('/counselor', { headers });
                        console.log('Profile Result:', profileResult);

                        if (profileResult.success) {
                            setRejectionReason(profileResult.data.rejection_reason || 'No reason provided');
                            setError(null);
                        } else {
                            setError(profileResult.message.message || 'Failed to fetch profile data.');
                        }
                    }
                } else {
                    setError('Invalid status value received.');
                }
            } catch (err) {
                console.error('Error in fetchStatusAndReason:', err);
                setError('An error occurred while fetching data.');
            }
        };

        fetchStatusAndReason();
    }, [email]);

    const renderBar = () => {
        if (status === null) return null;

        const pieColor = status === 0 ? 'info' : status === 1 ? 'success' : 'danger';
        const pieLabel = status === 0 ? 'Approval Pending' : status === 1 ? 'Approved Accepted' : 'Approval Rejected';

        return (
            <ProgressBar>
                <ProgressBar variant={pieColor} now={100} key={1} label={pieLabel} />
            </ProgressBar>
        );
    };

    return (
        <Container className="status-bar-container">
            <Row>
                <Col>
                    {error && <Alert variant="danger">{error}</Alert>}

                    {status === null ? (
                        <p>Loading...</p>
                    ) : (
                        <>
                            {renderBar()}
                            {status === -1 && rejectionReason && (
                                <Alert variant="danger" className="mt-3 rejection-reason">
                                    <strong>Rejection Reason:</strong> {rejectionReason}
                                </Alert>
                            )}
                        </>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default StatusBar;
