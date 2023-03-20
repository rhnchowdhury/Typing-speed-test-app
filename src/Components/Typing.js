import React, { useEffect, useState } from 'react';
import randomWords from 'random-words';

const numOfWords = 200;
const seconds = 10;

const Typing = () => {
    const [words, setWords] = useState([]);
    const [countDown, setCountDown] = useState(seconds);

    useEffect(() => {
        setWords(generateWords())
    }, []);

    function generateWords() {
        return new Array(numOfWords).fill(null).map(() => randomWords())
    };

    const timeStart = () => {
        let interval = setInterval(() => {
            setCountDown((preCountDown) => {
                if (preCountDown === 0) {
                    clearInterval(interval);
                }
                else {
                    return preCountDown - 1;
                }
            })
        }, 1000)
    }

    return (
        <section>
            <div>
                <h1>Check your typing skills in a minute</h1>
                <h1>{countDown}</h1>
                <div>
                    <input type="text" className='input' />
                </div>
                <div>
                    <button onClick={timeStart}>Start Test</button>
                </div>
                <div>
                    {words.map((word, i) => (
                        <>
                            <span>
                                {word}
                            </span>
                            <span> </span>
                        </>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Typing;