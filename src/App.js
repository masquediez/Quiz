import React, { useEffect, useState } from "react";
import "./styles.css";

// Archivos JSON con textos estáticos en diferentes idiomas
import textosES from "./textos-es.json";
import textosEN from "./textos-en.json";
import textosDE from "./textos-de.json";

// Importar los archivos JSON de preguntas desde public
import questionsES from "./questions-es.json";
import questionsEN from "./questions-en.json";
import questionsDE from "./questions-de.json";

const shuffleArray = (array) => {
  let currentIndex = array.length;
  let temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [answerMessage, setAnswerMessage] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [language, setLanguage] = useState("es");
  const [selectedLanguage, setSelectedLanguage] = useState("es");
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentPercentage, setCurrentPercentage] = useState(0);

  useEffect(() => {
    const fetchedQuestions = loadQuestionsByLanguage(language);
    if (fetchedQuestions.length > 0) {
      const shuffledQuestions = shuffleArray(fetchedQuestions);
      setQuestions(shuffledQuestions);
    }
  }, [language]);

  useEffect(() => {
    let timer;

    const tick = () => {
      setTimeLeft((prevTime) => prevTime - 1);
    };

    if (timeLeft > 0) {
      timer = setInterval(tick, 1000);
    } else {
      handleNextQuestion();
    }

    // Función de limpieza para detener el temporizador
    return () => {
      clearInterval(timer);
    };
  }, [timeLeft]);

  const loadQuestionsByLanguage = (lang) => {
    switch (lang) {
      case "es":
        return questionsES;
      case "en":
        return questionsEN;
      case "de":
        return questionsDE;
      default:
        return [];
    }
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    setShowCorrectAnswer(false);
  };

  const checkAnswer = () => {
    if (selectedOption === selectedQuestions[currentQuestionIndex]?.answer) {
      setScore((prevScore) => prevScore + 0);
      setAnswerMessage(textos[language].respuestaCorrecta);
    } else {
      setAnswerMessage(textos[language].respuestaIncorrecta);
    }
    setShowCorrectAnswer(true);
  };

  const handleNextQuestion = () => {
    if (selectedOption === selectedQuestions[currentQuestionIndex]?.answer) {
      setScore((prevScore) => prevScore + 1);
      setAnswerMessage(textos[language].respuestaCorrecta);
    } else {
      setAnswerMessage(textos[language].respuestaIncorrecta);
    }

    const nextPercentage = ((score + 1) / (currentQuestionIndex + 1)) * 100;

    setTimeout(() => {
      setShowCorrectAnswer(false);
      setAnswerMessage("");

      if (currentQuestionIndex < selectedQuestions.length - 1) {
        setCurrentPercentage(nextPercentage);
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setSelectedOption("");
        setTimeLeft(60);
      } else {
        setShowScore(true);
      }
    });
  };

  const handleResetQuiz = () => {
    setShowScore(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizStarted(false);
    setSelectedQuestions([]);
    setTimeLeft(60);
    setCurrentPercentage(0);
  };

  const handleNumQuestionsChange = (e) => {
    setNumQuestions(Number(e.target.value));
  };

  const startQuiz = () => {
    if (questions.length === 0) {
      console.error("No questions loaded");
      return;
    }
    setSelectedQuestions(shuffleArray(questions).slice(0, numQuestions));
    setShowScore(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(60);
    setQuizStarted(true);
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    setSelectedLanguage(lang);
  };

  const textos = {
    es: textosES,
    en: textosEN,
    de: textosDE,
  };

  const getProgressColor = (percentage) => {
    return percentage >= 70 ? "green" : "red";
  };

  return (
    <div className="App">
      <h1>Quiz Azure AZ900</h1>
      <div className="language-buttons">
        <button
          className={selectedLanguage === "es" ? "selected" : ""}
          onClick={() => changeLanguage("es")}
        >
          ES
        </button>
        <button
          className={selectedLanguage === "en" ? "selected" : ""}
          onClick={() => changeLanguage("en")}
        >
          EN
        </button>
        <button
          className={selectedLanguage === "de" ? "selected" : ""}
          onClick={() => changeLanguage("de")}
        >
          DE
        </button>
      </div>
      <div className="container">
        {!quizStarted && !showScore && (
          <div className="start-quiz">
            <label>
              {textos[language].elegirCantidadPreguntas}
              <input
                type="number"
                min="1"
                max={questions.length}
                value={numQuestions}
                onChange={handleNumQuestionsChange}
              />
            </label>
            <button className="start-quiz-button" onClick={startQuiz}>
              {textos[language].iniciarQuiz}
            </button>
          </div>
        )}
        {quizStarted && !showScore && selectedQuestions.length > 0 && (
          <div>
            <div className="timer">
              {textos[language].tiempoRestante}: {timeLeft}s
            </div>
            <h2>{selectedQuestions[currentQuestionIndex]?.question}</h2>
            <div>
              {selectedQuestions[currentQuestionIndex]?.options.map(
                (option, index) => (
                  <div
                    key={index}
                    className={`option ${
                      showCorrectAnswer &&
                      option === selectedQuestions[currentQuestionIndex]?.answer
                        ? "correct"
                        : showCorrectAnswer &&
                          option !==
                            selectedQuestions[currentQuestionIndex]?.answer
                        ? "incorrect"
                        : selectedOption === option
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => handleOptionChange(option)}
                  >
                    <input
                      type="radio"
                      name="option"
                      value={option}
                      checked={selectedOption === option}
                      onChange={() => handleOptionChange(option)}
                      disabled={showCorrectAnswer}
                    />
                    {option}
                  </div>
                )
              )}
            </div>
            <div className="button-container">
              <button
                className="verificar"
                onClick={checkAnswer}
                disabled={showCorrectAnswer}
              >
                {textos[language].verificarRespuesta}
              </button>
              {showCorrectAnswer && <p>{answerMessage}</p>}
              <button
                className="siguientePregunta"
                onClick={handleNextQuestion}
              >
                {textos[language].siguientePregunta}
              </button>
            </div>
            <div className="question-info">
              <p>
                {textos[language].pregunta} {currentQuestionIndex + 1}{" "}
                {textos[language].de} {numQuestions}
              </p>
              <p>
                {textos[language].porcentajeAciertosActual}
                <div className="progress-bar-container">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${
                        currentQuestionIndex === 0
                          ? 0
                          : ((score / currentQuestionIndex) * 100).toFixed(2)
                      }%`,
                      backgroundColor: getProgressColor(
                        currentQuestionIndex === 0
                          ? 0
                          : (score / currentQuestionIndex) * 100
                      ),
                    }}
                  ></div>
                </div>
                <span>
                  {currentQuestionIndex === 0
                    ? "0%"
                    : `${((score / currentQuestionIndex) * 100).toFixed(2)}%`}
                </span>
              </p>
            </div>
          </div>
        )}
        {showScore && (
          <div>
            <p>
              {textos[language].puntuacion}: {score} / {numQuestions}
            </p>
            <p>
              {textos[language].porcentajeAciertos}
              {((score / selectedQuestions.length) * 100).toFixed(2)}%
            </p>
            <div className="button-container">
              <button className="siguientePregunta" onClick={handleResetQuiz}>
                {textos[language].reiniciarQuiz}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
