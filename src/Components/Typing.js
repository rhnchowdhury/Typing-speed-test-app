import React, { useEffect, useRef, useState } from 'react';
import randomWords from 'random-words';

const numOfWords = 200;
const seconds = 10;

const Typing = () => {
    const [words, setWords] = useState([]);
    const [countDown, setCountDown] = useState(seconds);
    const [currentInput, setCurrentInput] = useState('');
    const [currWordIdx, setCurrWordIdx] = useState(0);
    const [correct, setCorrect] = useState(0);
    const [error, setError] = useState(0);
    const [status, setStatus] = useState('waiting');
    const textInput = useRef(null);

    useEffect(() => {
        setWords(generateWords())
    }, []);

    useEffect(() => {
        if (status === 'started') {
            textInput.current.focus()
        }
    }, [status])

    function generateWords() {
        return new Array(numOfWords).fill(null).map(() => randomWords())
    };

    const timeStart = () => {
        if (status === 'finished') {
            setWords(generateWords())
            setCurrWordIdx(0);
            setCorrect(0);
            setError(0);
        }
        if (status !== 'started') {
            setStatus('started')
            let interval = setInterval(() => {
                setCountDown((preCountDown) => {
                    if (preCountDown === 0) {
                        clearInterval(interval);
                        setStatus('finished');
                        setCurrentInput('');
                        return seconds;
                    }
                    else {
                        return preCountDown - 1;
                    }
                })
            }, 1000)
        }
    };

    const handleInput = ({ keyCode }) => {
        if (keyCode === 32) {
            checkMatch();
            setCurrentInput('');
            setCurrWordIdx(currWordIdx + 1);
        }
    };

    const checkMatch = () => {
        const wordToCompare = words[currWordIdx];
        const itMatch = wordToCompare === currentInput.trim();
        if (itMatch) {
            setCorrect(correct + 1);
        }
        else {
            setError(error + 1)
        }
    }

    return (
        <section>
            <div>
                <h1>Check your typing skills in a minute</h1>
                <h1>{countDown}</h1>
                <div>
                    <input ref={textInput} disabled={status !== 'started'} type="text" onKeyDown={handleInput} value={currentInput} onChange={(e) => setCurrentInput(e.target.value)} className='input' />
                </div>
                <div>
                    <button onClick={timeStart}>Start Test</button>
                </div>
                {status === 'started' && (
                    <div>
                        {words.map((word, i) => (
                            <span key={i}>
                                <span>
                                    {word.split("").map((char, idx) => (
                                        <span key={idx}>{char}</span>
                                    ))}
                                </span>
                                <span> </span>
                            </span>
                        ))}
                    </div>
                )}

            </div>
            {status === 'finished' && (
                <div>
                    <h1>Words Per Minute:{correct}</h1>
                    <h1>Accuracy: {Math.round((correct / (correct + error)) * 100)}%</h1>
                </div>
            )}
        </section>
    );
};

export default Typing;