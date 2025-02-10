import data from '../../../data/dummy-data/dummy-que';

interface Question {
    Queid: string;
    question: string;
  }
  
  interface CompData {
    [key: string]: Question[];
  }
  
  function getRandomQuestions(data: CompData, numQuestions: number): Question[] {
    const keys = Object.keys(data);
    let selectedQuestions: Question[] = [];
    keys.forEach(key => {
      const questions = data[key];
      const shuffled = questions.sort(() => 0.5 - Math.random());
      selectedQuestions = [...selectedQuestions, ...shuffled.slice(0, numQuestions)];
    });
    return selectedQuestions;
  }
  
  const selectedQuestions: Question[] = getRandomQuestions(data, 2);
  export { selectedQuestions };
  