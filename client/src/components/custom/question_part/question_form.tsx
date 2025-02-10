import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import SpeechToText from '../sounds/stt'; 
import './QuestionFormBody.css'; 

interface QuestionProps {
  questionData: { question: string };
  onAnswerSubmit: (answer: string) => void;
  initialAnswer: string;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  showPrevious: boolean;
  showNext: boolean;
}

const QuestionFormBody: React.FC<QuestionProps> = ({
  questionData, 
  onAnswerSubmit, 
  initialAnswer,
  onPrevious,
  onNext,
  onSubmit,
  showPrevious,
  showNext,
}) => {
  const [answer, setAnswer] = useState(initialAnswer);

  useEffect(() => {
    setAnswer(initialAnswer); 
  }, [initialAnswer]);

  const handleTranscript = (text: string) => {
    setAnswer(text);
  };

  const validateAnswer = () => {
    const trimmedAnswer = answer.trim();
    const wordCount = trimmedAnswer.split(/\s+/).length;

    if (trimmedAnswer === "") {
      Swal.fire({
        icon: 'warning',
        title: 'No Answer',
        text: 'Please enter an answer.',
      });
      return false;
    } else if (wordCount > 100) {
      Swal.fire({
        icon: 'warning',
        title: 'Word Limit Exceeded',
        text: 'You can only enter up to 100 words.',
      });
      return false;
    }

    onAnswerSubmit(answer); 
    return true;
  };

  const handleNext = () => {
    if (validateAnswer()) {
      setAnswer(''); 
      onNext(); 
    }
  };

  const handleSubmitAll = () => {
    if (validateAnswer()) {
      onSubmit(); 
    }
  };

  return (
    <div className="form-container">
      <h1 className="text-center">{questionData.question}</h1>
      <SpeechToText onTranscript={handleTranscript} />
      <div className="form-group">
        <textarea
          className="form-control input-lg"
          id="question"
          placeholder="Enter your answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={7} 
        />
      </div>
      <div className="button-row">
        {showPrevious && (
          <button className="btn btn-secondary back-btn" onClick={onPrevious}>
            Back
          </button>
        )}
        {showNext && (
          <button className="btn btn-primary next-btn" onClick={handleNext}>
            Next Question
          </button>
        )}
        {!showNext && (
          <button className="btn btn-success submit-btn" onClick={handleSubmitAll}>
            Submit all the answers
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionFormBody;
