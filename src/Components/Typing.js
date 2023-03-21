import React, { useEffect, useRef, useState } from 'react';
import randomWords from 'random-words';
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip';

const numOfWords = 200;
const seconds = 60;

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
        <section className='section py-10'>
            <div>
                <h1 className='text-center text-3xl font-semibold italic'>Check your typing skills in a minute</h1>
                <div className='card-actions justify-center mt-12'>
                    <button className=' p-5 rounded-md' style={{ boxShadow: '2px 2px 3px' }} data-tooltip-id="my-tooltip" data-tooltip-content="Time left on the Clock">Time left: {countDown}s</button>
                    <Tooltip id="my-tooltip" />
                </div>
                <div className='my-10 card-actions justify-center'>
                    <input ref={textInput} disabled={status !== 'started'} type="text" onKeyDown={handleInput} value={currentInput} onChange={(e) => setCurrentInput(e.target.value)} className='input' />
                </div>
                <div className='card-actions justify-center'>
                    <button onClick={timeStart} className='rounded-md p-4 shadow-2xl font-medium hov hover:text-red-500'>Click To Start Test</button>
                </div>

                {status === 'started' && (
                    <div className='m-12 lg:m-20'>
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
                <div className='my-10 space-x-4 card-actions justify-center'>
                    <button data-tooltip-id="my-tooltip" data-tooltip-content="Words Per Minute" className=' p-5 rounded-md' style={{ boxShadow: '2px 2px 3px' }}>Speed: {correct} WPM</button>
                    <button className=' p-5 rounded-md' style={{ boxShadow: '2px 2px 3px' }}>Accuracy: {Math.round((correct / (correct + error)) * 100)}%</button>
                </div>
            )}
        </section>
    );
};

export default Typing;