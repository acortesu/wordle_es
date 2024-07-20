import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Header } from "./components/Header.jsx";
import { WordInput } from "./components/WordInput.jsx";
import { GuessResult } from "./components/GuessResult.jsx";
import { Alert } from './components/Alerts.jsx';

export function App() {
  const [wordToGuess, setWordToGuess] = useState('');
  const [userTries, setUserTries] = useState(0);
  const [gameOver, setGameOver] = useState(true); // Inicializar gameOver en true
  const [correctLetters, setCorrectLetters] = useState([]);
  const [presentLetters, setPresentLetters] = useState([]);
  const [incorrectLetters, setIncorrectLetters] = useState([]);
  const [candidate, setCandidate] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [reset, setReset] = useState(false); // Para rastrear el reinicio del juego

  const fetchAPI = async (candidate) => {
    try {
      const res = await axios.post('http://localhost:8080/api/guess', {
        candidate: candidate,
        word_to_guess: wordToGuess,
        user_tries: userTries,
        game_over: gameOver
      });
      console.log("Backend Response:", res.data); // Verificar los datos recibidos del backend
      setWordToGuess(res.data.word_to_guess);
      setUserTries(res.data.user_tries);
      setGameOver(res.data.game_over);
      setCorrectLetters(res.data.correct_letter_and_index);
      setPresentLetters(res.data.correct_letter_wrong_index);
      setIncorrectLetters(res.data.incorrect_letter);
      setCandidate(candidate);
    } catch (error) {
      console.error("Error fetching data:", error);
      setAlertMessage('Algo anda mal... intenta jugar en unos minutos.');
      setAlertType('error');
    }
  };

  useEffect(() => {
    console.log("Result updated:", {
      correctLetters,
      presentLetters,
      incorrectLetters,
      candidate
    });
  }, [correctLetters, presentLetters, incorrectLetters, candidate]);

  const handleRestart = async () => {
    try {
      // Reiniciar el estado del juego en el backend
      const res = await axios.post('http://localhost:8080/api/guess', {
        candidate: '',
        word_to_guess: '',
        user_tries: 0,
        game_over: true
      });
      setWordToGuess(res.data.word_to_guess);
      setUserTries(res.data.user_tries);
      setGameOver(false);
      setCorrectLetters([]);
      setPresentLetters([]);
      setIncorrectLetters([]);
      setCandidate('');
      setAlertMessage('');
      setAlertType('');
      setReset(!reset); // Alternar el valor de reset para desencadenar el reinicio
    } catch (error) {
      console.error("Error restarting the game:", error);
      setAlertMessage('Error reiniciando el juego. Intenta de nuevo.');
      setAlertType('error');
    }
  };

  return (
    <div className='bg-[#139449] min-h-screen relative'>
      <Header />
      <WordInput
        onSubmit={fetchAPI}
        setAlertMessage={setAlertMessage}
        setAlertType={setAlertType}
      />
      <GuessResult
        wordToGuess={wordToGuess}
        correctLetters={correctLetters}
        presentLetters={presentLetters}
        incorrectLetters={incorrectLetters}
        candidate={candidate}
        gameOver={gameOver}
        userTries={userTries}
        setAlertMessage={setAlertMessage}
        setAlertType={setAlertType}
        reset={reset}
      />
      <Alert
        message={alertMessage}
        type={alertType}
        onRestart={handleRestart}
      />
    </div>
  );
}
