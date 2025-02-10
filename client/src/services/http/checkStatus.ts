import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000'; // Adjust this to your Flask backend address

type Status = 0 | 1 | -1;

export async function getCounselorStatus(email: string): Promise<Status | null> {
    try {
        const response = await axios.get(`/api/counselor/status?email=${email}`);
        console.log('Counselor status:', response.data.status);
        return +response.data.status as Status; // Convert to number and cast as Status
    } catch (error) {
        console.error('Error fetching counselor status:', error);
        return null;
    }
}