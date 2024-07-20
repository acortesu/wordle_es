import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

export function WordInput({ onSubmit, setAlertMessage, setAlertType }) {
    const [letters, setLetters] = useState(Array(5).fill(''));
    const [isSubmitting, setIsSubmitting] = useState(false);
    const inputsRef = useRef([]);

    const isWordValid = (candidate) => {
        const regex = /^[A-Za-z]{5}$/;
        return regex.test(candidate);
    };

    const handleChange = (index, value) => {
        if (value.length > 1) return;

        const newLetters = [...letters];
        newLetters[index] = value.toUpperCase();
        setLetters(newLetters);

        if (value && index < 4) {
            inputsRef.current[index + 1]?.focus();
        }

        if (!value && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !letters[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;

        setIsSubmitting(true);
        const candidate = letters.join('');
        if (candidate.length !== 5) {
            setAlertMessage('La palabra debe tener 5 letras');
            setAlertType('warning');
            setIsSubmitting(false);
            return;
        } else if (!isWordValid(candidate)) {
            setAlertMessage('Palabra inválida');
            setAlertType('warning');
            setIsSubmitting(false);
            return;
        } else {
            console.log('Palabra enviada')
            await onSubmit(candidate);
            setIsSubmitting(false);
            setTimeout(() => {
                setLetters(Array(5).fill(''));
                inputsRef.current[0]?.focus();
            }, 2000);
        }
    };

    return (
        <div className='text-center mt-20'>
            <div className='relative inline-block mb-4'>
                {/* container shadow layer */}
                <div className='absolute top-0 left-0 w-full h-full bg-black opacity-30 rounded-[15px] md:rounded-[30px] transform translate-x-3 translate-y-3 md:translate-x-8 md:translate-y-8 pointer-events-none'></div>
                {/* black container */}
                <div className='relative bg-black p-6 md:p-8 max-w-fit mx-auto rounded-xl md:rounded-[30px]'>
                    {/* input letters container */}
                    <div className='flex justify-center gap-x-4 md:gap-x-8'>
                        {letters.map((letter, index) => (
                            <input
                                key={index}
                                ref={el => inputsRef.current[index] = el}
                                type="text"
                                maxLength="1"
                                value={letter}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className='h-12 w-12 rounded-xl text-3xl md:h-28 md:w-28 bg-[#404040] md:rounded-2xl text-center text-white font-bold md:text-5xl font-custom outline-none transform transition duration-200 hover:scale-105'
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex justify-center mt-10">
                <button onClick={handleSubmit} className='bg-[#D5B406] w-40 h-12 md:w-60 md:h-16 md:text-xl rounded-lg text-white font-bold transform transition duration-200 hover:scale-105' type="submit">¡Enviar!</button>
            </div>
        </div>
    );
}

WordInput.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    setAlertMessage: PropTypes.func.isRequired,
    setAlertType: PropTypes.func.isRequired,
};