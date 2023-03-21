import React, { useEffect, useRef, useState } from 'react';
import randomWords from 'random-words';
import './Typing.css';

const numOfWords = 200;
const seconds = 10;

const Typing = () => {
    const [words, setWords] = useState([]);
    const [countDown, setCountDown] = useState(seconds);
    const [currentInput, setCurrentInput] = useState('');
    const [currWordIdx, setCurrWordIdx] = useState(0);
    const [currCharIdx, setCurrCharIdx] = useState(-1);
    const [currChar, setCurrChar] = useState("");
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

    const handleInput = ({ keyCode, key }) => {
        if (keyCode === 32) {
            checkMatch();
            setCurrentInput('');
            setCurrWordIdx(currWordIdx + 1);
            setCurrCharIdx(-1);
        }
        else {
            setCurrCharIdx(currCharIdx + 1);
            setCurrChar(key);
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
    };

    const getCharClass = (wordIdx, charIdx, char) => {
        if (wordIdx === currWordIdx && charIdx === currCharIdx && currChar && status !== 'finished') {
            if (char === currChar) {
                return 'bg-emerald-500'
            } else {
                return 'bg-red-500'
            }
        }
        else {
            return ''
        }
    };

    return (
        <section className='section'>
            <div>
                <h1 className='text-center text-3xl font-semibold'>Check your typing skills in a minute</h1>
                <button className='p-5 rounded-md justify-center items-center' style={{ boxShadow: '2px 2px 3px' }}>Time left: {countDown}s</button>
                <div className='mt-10'>
                    <input ref={textInput} disabled={status !== 'started'} type="text" onKeyDown={handleInput} value={currentInput} onChange={(e) => setCurrentInput(e.target.value)} className='input input-bordered' />
                </div>
                <div>
                    <button onClick={timeStart} className='border-2 p-4 shadow-2xl'>Start Test</button>
                </div>

                {status === 'started' && (
                    <div>
                        {
                            words.map((word, i) => (
                                <span key={i}>
                                    <span>
                                        {word.split("").map((char, idx) => (
                                            <span className={getCharClass(i, idx, char)} key={idx}>{char}</span>
                                        ))}
                                    </span>
                                    <span> </span>
                                </span>
                            ))
                        }
                    </div>
                )}
            </div>
            {status === 'finished' && (
                <div>
                    <h1 className='border-2 p-1 shadow-2xl'>Words Per Minute:{correct}</h1>
                    <h1>Accuracy: {Math.round((correct / (correct + error)) * 100)}%</h1>
                </div>
            )}
        </section>
    );
};

export default Typing;