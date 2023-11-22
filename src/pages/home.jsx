import React, { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './home.scss'
import { useNavigate } from 'react-router-dom';

export let getvalue;

function home() {
    localStorage.clear();

    const [picked, setpicked] = useState("");
    const [copied, setCopied] = useState(false);

    const pickUser = (event) => {
        getvalue = event.currentTarget.value
        if (getvalue !== undefined) {
            setpicked(getvalue)
        }
    }

    const navigate = useNavigate();

    const nav = () => {
        if (getvalue !== undefined) {
            navigate('/game')
        }
        else
            alert("Please pick user first!!");
    }

    function copy() {
        const el = document.createElement("input");
        el.value = window.location.href;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        setCopied(true);
        toast.success("Invite link copied", {
            position: toast.POSITION.TOP_RIGHT,
            className: 'toast',
        });
    }

    let [quote, setquote] = useState('It is better to fail in originality than to succeed in imitation');
    let [count, setcount] = useState(1);

    const MINUTE = 60000;

    useEffect(() => {
        const interval = setInterval(() => {
            fetch("https://api.adviceslip.com/advice")
                .then(response => response.json())
                .then(data => {
                    setcount(data.slip.id)
                    setquote(data.slip.advice)

                })
                .catch((error) => {
                    setquote(error)
                    console.error('Error:', error);
                });
        }, MINUTE);

        return () => clearInterval(interval);
    }, [])

    return (
        <>
            <div className='main-container'>
                <div className='mob-view'>
                    <div className='logo'>
                        <img src="\src\assets\cross.png" alt="" />
                        <img src="\src\assets\circle.png" alt="" />
                    </div>
                    <div className='head'>
                        <div className='pick-container'>
                            <h1>PICK PLAYER</h1>
                            <div className='pick'>
                                <button value="cross" onClick={pickUser}>
                                    <img src="src\assets\white_cross.png" alt="" /></button>

                                <button value="circle" id='circle' onClick={pickUser}>
                                    <img src="\src\assets\black_circle.png" alt="" /></button>
                            </div>
                        </div>

                        <div className='cpu-btn'>
                            <button id='cpu' onClick={() => nav()}>NEW GAME ( VS CPU )</button>
                        </div>

                        <div className='human-btn'>
                            <button id='human'>NEW GAME ( VS HUMAN ) Coming soon</button>
                        </div>

                        <div className='invite-btn'>
                            <button id='invite' onClick={copy}>Invite your friend</button>
                            <ToastContainer />
                        </div>
                    </div>
                </div>
            </div>
            <div className='quote-container'>
                <div className='quotes'>
                    <h1>Quote #{count}</h1>
                    <p>“{quote}”</p>
                    <button id='btn-quote' disabled><img src="\src\assets\Ellipse.png" alt="" /></button>
                </div>
            </div>
        </>

    )
}

export default home