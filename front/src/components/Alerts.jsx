import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export function Alert({ message, type, onRestart }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (message) {
            setVisible(true);
            if (type === 'warning') {
                const timer = setTimeout(() => {
                    setVisible(false);
                }, 3000);
                return () => clearTimeout(timer);
            }
        }
    }, [message, type]);

    if (!message || !visible) return null; // No renderizar nada si no hay mensaje o no es visible

    let alertClass = '';
    let isPopup = false;

    if (type === 'success' || type === 'gameover') {
        alertClass = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-70';
        isPopup = true;
    } else if (type === 'warning') {
        alertClass = 'absolute top-44 left-1/2 transform -translate-x-1/2 mt-4 p-2 pr-11 pl-11 rounded bg-yellow-500 text-white md:text-sm text-[10px] transition-opacity duration-1000 ease-out';
    } else {
        alertClass = 'absolute top-44 left-1/2 transform -translate-x-1/2 mt-4 p-2 pr-11 pl-11 rounded bg-red-500 text-white md:text-sm text-[10px]';
    }

    return (
        <div className={`${alertClass}`}>
            {isPopup ? (
                <div className="bg-white p-12 rounded-md shadow-md text-center">
                    <p className="font-bold mb-14">{message}</p>
                    <button
                        onClick={onRestart}
                        className="bg-yellow-500 px-4 py-2 rounded text-white font-bold"
                    >
                        Jugar de nuevo
                    </button>
                </div>
            ) : (
                <div>{message}</div>
            )}
        </div>
    );
}

Alert.propTypes = {
    message: PropTypes.string,
    type: PropTypes.string,
    onRestart: PropTypes.func.isRequired
};