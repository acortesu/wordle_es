import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { esAlphabet } from '../assets/data/lettersData.js';

export function GuessResult({ correctLetters, presentLetters, incorrectLetters, candidate, gameOver, userTries, setAlertMessage, setAlertType, reset, wordToGuess, isValidWord }) {
    const [rows, setRows] = useState([Array(5).fill('')]);
    const [colors, setColors] = useState([Array(5).fill('bg-[#AAAAAA]')]);
    const [keyboard, setKeyboard] = useState(Array(4).fill().map(() => Array(7).fill({ letter: '', color: 'bg-[#AAAAAA]' })));

    useEffect(() => {
        const alphabet = esAlphabet;
        const initialKeyboard = Array(4).fill().map((_, rowIndex) =>
            Array(7).fill().map((_, colIndex) => ({
                letter: alphabet[rowIndex * 7 + colIndex] || '',
                color: alphabet[rowIndex * 7 + colIndex] ? 'bg-[#AAAAAA]' : 'bg-black'
            }))
        );
        setKeyboard(initialKeyboard);
    }, [reset]);

    useEffect(() => {
        if (userTries > 0 && (correctLetters.length > 0 || presentLetters.length > 0 || incorrectLetters.length > 0)) {
            const newRows = [...rows];
            const newColors = [...colors];
            const newKeyboard = keyboard.map(row => row.map(key => ({ ...key })));

            if (newRows.length < userTries) {
                newRows.push(Array(5).fill(''));
                newColors.push(Array(5).fill('bg-[#AAAAAA]'));
            }

            correctLetters.forEach(letter => {
                const { index, letter: char } = letter;
                const rowIndex = userTries - 1;
                newRows[rowIndex][index] = char;
                newColors[rowIndex][index] = 'bg-[#139449]';
            });

            presentLetters.forEach(letter => {
                const { index, letter: char } = letter;
                const rowIndex = userTries - 1;
                newRows[rowIndex][index] = char;
                newColors[rowIndex][index] = 'bg-[#D5B406]';
            });

            incorrectLetters.forEach(letter => {
                const { index, letter: char } = letter;
                const rowIndex = userTries - 1;
                newRows[rowIndex][index] = char;
                newColors[rowIndex][index] = 'bg-[#404040]';
            });

            setRows(newRows);
            setColors(newColors);

            const allLetters = [
                ...correctLetters.map(letter => ({ ...letter, correct: true, present: false, incorrect: false })),
                ...presentLetters.map(letter => ({ ...letter, correct: false, present: true, incorrect: false })),
                ...incorrectLetters.map(letter => ({ ...letter, correct: false, present: false, incorrect: true }))
            ];

            allLetters.forEach(letter => {
                const foundKey = newKeyboard.flat().find(key => key.letter === letter.letter.toUpperCase());
                if (foundKey) {
                    foundKey.color = letter.correct ? 'bg-[#139449]' : letter.present ? 'bg-[#D5B406]' : 'bg-[#404040]';
                }
            });

            setKeyboard(newKeyboard);
        }

        if (isValidWord === false) {
            setAlertMessage('La palabra no existe en nuestro diccionario');
            setAlertType('warning');
            setTimeout(() => {
                setAlertMessage('');
                setAlertType('');
            }, 3000); // Ajusta el tiempo según tus necesidades
        }

        if (gameOver && correctLetters.length === 5) {
            setAlertMessage('¡Felicidades! Inténtalo otra vez');
            setAlertType('success');
        } else if (gameOver && userTries === 6) {
            setAlertMessage(`Mejor suerte para la próxima. La palabra era ${wordToGuess.toUpperCase()}`);
            setAlertType('gameover');
        }
    }, [correctLetters, presentLetters, incorrectLetters, candidate, gameOver, userTries, setAlertMessage, setAlertType, wordToGuess, isValidWord]);

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
                            {rows.map((row, rowIndex) => (
                                <div key={rowIndex} className="flex gap-x-1 justify-center">
                                    {row.map((letter, colIndex) => (
                                        <div
                                            key={colIndex}
                                            className={`h-[18px] w-[18px] md:h-[25px] md:w-[25px] text-[12px] md:text-[16px] text-white font-bold flex items-center justify-center rounded-md ${colors[rowIndex][colIndex]}`}
                                        >
                                            {letter.toUpperCase()}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col gap-y-1 justify-center">
                            {keyboard.map((row, rowIndex) => (
                                <div key={rowIndex} className="flex gap-x-1 justify-center">
                                    {row.map((key, colIndex) => (
                                        <div key={colIndex} className={`h-[18px] w-[18px] md:h-[25px] md:w-[25px] ${key.color} flex items-center justify-center rounded-md text-[10px] md:text-sm text-white font-bold`}>
                                            {key.letter}
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
    correctLetters: PropTypes.arrayOf(PropTypes.shape({
        index: PropTypes.number.isRequired,
        letter: PropTypes.string.isRequired
    })).isRequired,
    presentLetters: PropTypes.arrayOf(PropTypes.shape({
        index: PropTypes.number.isRequired,
        letter: PropTypes.string.isRequired
    })).isRequired,
    incorrectLetters: PropTypes.arrayOf(PropTypes.shape({
        index: PropTypes.number.isRequired,
        letter: PropTypes.string.isRequired
    })).isRequired,
    candidate: PropTypes.string.isRequired,
    wordToGuess: PropTypes.string.isRequired,
    gameOver: PropTypes.bool.isRequired,
    isValidWord: PropTypes.bool.isRequired,
    userTries: PropTypes.number.isRequired,
    setAlertMessage: PropTypes.func.isRequired,
    setAlertType: PropTypes.func.isRequired,
    reset: PropTypes.bool.isRequired
};