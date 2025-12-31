import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { esAlphabet } from '../assets/data/lettersData.js';

export function GuessResult({
  correctLetters,
  presentLetters,
  incorrectLetters,
  candidate,
  gameOver,
  userTries,
  setAlertMessage,
  setAlertType,
  reset,
  wordToGuess,
  isValidWord
}) {
  const [rows, setRows] = useState([Array(5).fill('')]);
  const [colors, setColors] = useState([Array(5).fill('bg-[#AAAAAA]')]);
  const [keyboard, setKeyboard] = useState([]);

  // Inicializar teclado
  useEffect(() => {
    const keyboardInit = Array(4).fill().map((_, r) =>
      Array(7).fill().map((_, c) => {
        const letter = esAlphabet[r * 7 + c] || '';
        return {
          letter,
          color: letter ? 'bg-[#AAAAAA]' : 'bg-black'
        };
      })
    );
    setKeyboard(keyboardInit);
  }, [reset]);

  // ACTUALIZACIÓN CORRECTA DEL TABLERO
  useEffect(() => {
    if (userTries === 0) return;

    // Filas
    setRows(prevRows => {
      const newRows = [...prevRows];
      if (newRows.length < userTries) {
        newRows.push(Array(5).fill(''));
      }

      [...correctLetters, ...presentLetters, ...incorrectLetters].forEach(({ index, letter }) => {
        newRows[userTries - 1][index] = letter;
      });

      return newRows;
    });

    // Colores
    setColors(prevColors => {
      const newColors = [...prevColors];
      if (newColors.length < userTries) {
        newColors.push(Array(5).fill('bg-[#AAAAAA]'));
      }

      correctLetters.forEach(({ index }) => {
        newColors[userTries - 1][index] = 'bg-[#139449]';
      });
      presentLetters.forEach(({ index }) => {
        newColors[userTries - 1][index] = 'bg-[#D5B406]';
      });
      incorrectLetters.forEach(({ index }) => {
        newColors[userTries - 1][index] = 'bg-[#404040]';
      });

      return newColors;
    });

    // Teclado
    setKeyboard(prevKeyboard => {
      const newKeyboard = prevKeyboard.map(row =>
        row.map(key => ({ ...key }))
      );

      [...correctLetters, ...presentLetters, ...incorrectLetters].forEach(l => {
        const key = newKeyboard.flat().find(k => k.letter === l.letter.toUpperCase());
        if (key) {
          key.color = correctLetters.includes(l)
            ? 'bg-[#139449]'
            : presentLetters.includes(l)
            ? 'bg-[#D5B406]'
            : 'bg-[#404040]';
        }
      });

      return newKeyboard;
    });

    // Alertas
    if (isValidWord === false) {
      setAlertMessage('La palabra no existe en nuestro diccionario');
      setAlertType('warning');
      setTimeout(() => {
        setAlertMessage('');
        setAlertType('');
      }, 3000);
    }

    if (gameOver && correctLetters.length === 5) {
      setAlertMessage('¡Felicidades! Inténtalo otra vez');
      setAlertType('success');
    } else if (gameOver && userTries === 6) {
      setAlertMessage(`Mejor suerte para la próxima. La palabra era ${wordToGuess.toUpperCase()}`);
      setAlertType('gameover');
    }

  }, [
    correctLetters,
    presentLetters,
    incorrectLetters,
    userTries,
    gameOver,
    isValidWord,
    wordToGuess
  ]);

  // Reset visual
  useEffect(() => {
    setRows([Array(5).fill('')]);
    setColors([Array(5).fill('bg-[#AAAAAA]')]);
  }, [reset]);

  return (
    <div className='text-center mt-7'>
      <div className='relative inline-block mb-4'>
        <div className='absolute top-0 left-0 w-full h-full bg-black opacity-30 rounded-[15px] md:rounded-[30px] transform translate-x-3 translate-y-3 md:translate-x-8 md:translate-y-8 pointer-events-none'></div>
        <div className='relative bg-black p-6 max-w-fit mx-auto rounded-xl md:rounded-[30px]'>
          <div className="flex flex-row-reverse items-center gap-x-8">
            <div className="flex flex-col gap-y-1 justify-center">
              {rows.map((row, r) => (
                <div key={r} className="flex gap-x-1 justify-center">
                  {row.map((l, c) => (
                    <div
                      key={c}
                      className={`h-[18px] w-[18px] md:h-[25px] md:w-[25px] text-white font-bold flex items-center justify-center rounded-md ${colors[r][c]}`}
                    >
                      {l.toUpperCase()}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-y-1 justify-center">
              {keyboard.map((row, r) => (
                <div key={r} className="flex gap-x-1 justify-center">
                  {row.map((k, c) => (
                    <div
                      key={c}
                      className={`h-[18px] w-[18px] md:h-[25px] md:w-[25px] ${k.color} flex items-center justify-center rounded-md text-white font-bold`}
                    >
                      {k.letter}
                    </div>
                  ))}
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

GuessResult.propTypes = {
  correctLetters: PropTypes.array.isRequired,
  presentLetters: PropTypes.array.isRequired,
  incorrectLetters: PropTypes.array.isRequired,
  candidate: PropTypes.string.isRequired,
  wordToGuess: PropTypes.string.isRequired,
  gameOver: PropTypes.bool.isRequired,
  isValidWord: PropTypes.bool.isRequired,
  userTries: PropTypes.number.isRequired,
  setAlertMessage: PropTypes.func.isRequired,
  setAlertType: PropTypes.func.isRequired,
  reset: PropTypes.bool.isRequired
};