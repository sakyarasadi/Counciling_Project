import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { selectedQuestions } from '../../../../components/custom/question_part/randomQuestions';
import axios from 'axios';
import QuestionFormBody from '../../../../components/custom/question_part/question_form';
import './QuestionCheck.css'; 
import PostDataService from '../../../../services/http/post-data-services'; 
import NavbarUser from "../../../../components/bootstrap/user_navBar";

const QuestionCheck: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(selectedQuestions.length).fill(''));
  const navigate = useNavigate();

  const handleAnswerSubmit = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const handleSubmit = async () => {
    const email = localStorage.getItem('email');
    if (!email) {
        Swal.fire({
            title: 'Not Logged In',
            text: 'Please log in to submit your answers.',
            icon: 'warning',
            confirmButtonText: 'Login'
        }).then(() => {
            navigate('/login');
        });
        return;
    }

    Swal.fire({
        title: 'Processing your answers...',
        text: 'Please wait a moment.',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });

    try {
        console.log('Submitting answers:', answers);
        const response = await axios.post(
            'http://127.0.0.1:5001/analyze',
            { answers },
            {
                headers: {
                    Authorization: `Bearer ${email}`
                }
            }
        );

        console.log('Response:', response);

        if (response && response.data) {
            // Assuming response.data contains the processed results
            const processedData = response.data;

            // Now send this data along with questions and answers to another backend endpoint
            const result = await PostDataService('/save-results', {
                processedData,
                questions: selectedQuestions,
                answers,
                email
            }, {
                headers: {
                    Authorization: `Bearer ${email}`
                }
            });

            if (result.success) {
                Swal.close();
                navigate('/report');
            } else {
                throw new Error(result.message.message);
            }
        } else {
            throw new Error(response.data ? response.data.error : 'Unknown error');
        }
    } catch (error) {
        console.error('Error submitting answers', error);

        // Check if error is an instance of Error
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';

        Swal.close();
        Swal.fire({
            title: 'Error',
            text: errorMessage,
            icon: 'error',
            confirmButtonText: 'Okay'
        });
    }
};

  useEffect(() => {
    if (currentQuestionIndex < selectedQuestions.length) {
      const msg = new SpeechSynthesisUtterance(selectedQuestions[currentQuestionIndex].question);
      window.speechSynthesis.speak(msg);
    }
  }, [currentQuestionIndex]);

  return (
    <>
     <NavbarUser />
    <div className="question-check-container">
      <div className="card">
        <div className="card-body">
          {currentQuestionIndex < selectedQuestions.length ? (
            <QuestionFormBody
              questionData={selectedQuestions[currentQuestionIndex]}
              onAnswerSubmit={handleAnswerSubmit}
              initialAnswer={answers[currentQuestionIndex]}
              onPrevious={handlePreviousQuestion}
              onNext={handleNextQuestion}
              onSubmit={handleSubmit}
              showPrevious={currentQuestionIndex > 0}
              showNext={currentQuestionIndex < selectedQuestions.length - 1}
            />
          ) : (
            <h1>No more questions</h1>
          )}
        </div>
      </div>
    </div>
    </>
  );

};

export default QuestionCheck;
