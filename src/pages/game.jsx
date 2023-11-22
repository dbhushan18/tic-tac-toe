import { useRef, useState, useEffect } from 'react';
import './game.scss';
import { getvalue } from './home';
import cross from "../assets/cross.png";
import circle from "../assets/circle.png";
import smallcross from '../assets/cross_small.png';
import smallcircle from '../assets/circle_small.svg';
import refresh from "../assets/refresh.png"
import Board from "./game_area";
import Square from "./Square";
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function game() {
  ///// ** main game ** //////
  // const [flag, setflag] = useState(false);
  let pickvalue = getvalue;
  let symboluser, symbolcpu;
  let othervalue;
  if (pickvalue == 'circle' ) {
    pickvalue = <view><img src={smallcircle} /></view>
    symboluser = 'O'
    symbolcpu = 'X'
    othervalue = <view><img src={smallcross} /></view>
  }
  else {
    pickvalue = <view><img src={smallcross} /></view>
    symboluser = 'X'
    symbolcpu = 'O'
    othervalue = <view><img src={smallcircle} /></view>
  }

  const [lock, setlock] = useState(false);

  const [usercnt] = useState(localStorage.getItem("usercount"))
  let [usercount, setusercount] = useState(
    usercnt ? JSON.parse(usercnt) : 0
  )
  const [cpucnt] = useState(localStorage.getItem("cpucount"))

  let [cpucount, setcpucount] = useState(
    cpucnt ? JSON.parse(cpucnt) : 0
  )

  const [tiecnt] = useState(localStorage.getItem("tiecount"))
  let [tiecount, settiecount] = useState(
    tiecnt ? JSON.parse(tiecnt) : 0
  )

  const InitialSquares = () => (new Array(9)).fill(null);

  const winlines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

  const [squares, setSquares] = useState(InitialSquares());
  const [winner, setWinner] = useState(null);
  const sleep = ms =>
    new Promise(resolve => setTimeout(resolve, ms));

  const initialized = useRef(false);

  // const changeturnimage = () => {
  //   if (flag === false)
  //     return pickvalue;
  //   else
  //     return othervalue;
  // }

  useEffect(() => {

    if (lock) {
      return () => {
        initialized.current = true
      }
    }
    sleep(500).then(() => {
      const isComputerTurn = squares.filter(square => square !== null).length % 2 === 1;
      const linesThatAre = (a, b, c) => {
        return winlines.filter(squareIndexes => {
          const squareValues = squareIndexes.map(index => squares[index]);
          return JSON.stringify([a, b, c].sort()) === JSON.stringify(squareValues.sort());
        });
      };
      const emptyIndexes = squares
        .map((square, index) => square === null ? index : null)
        .filter(val => val !== null);
      const playerWon = linesThatAre(symboluser, symboluser, symboluser).length > 0;
      const computerWon = linesThatAre(symbolcpu, symbolcpu, symbolcpu).length > 0;
      if (playerWon) {
        setWinner(symboluser)
        won(symboluser);
      }
      if (computerWon) {
        setWinner(symbolcpu)
        won(symbolcpu);
      }
      if (squares.flat().every((cell) => cell !== null)) {
        setWinner("tie");
        won("tie")
      }

      const putComputerAt = index => {
        let newSquares = squares;
        newSquares[index] = symbolcpu;
        setSquares([...newSquares]);
      };
      if (isComputerTurn) {
        // setflag(true)
        const winingLines = linesThatAre('O', 'O', null);
        if (winingLines.length > 0) {
          const winIndex = winingLines[0].filter(index => squares[index] === null)[0];
          putComputerAt(winIndex);
          return;
        }

        const linesToBlock = linesThatAre('X', 'X', null);
        if (linesToBlock.length > 0) {
          const blockIndex = linesToBlock[0].filter(index => squares[index] === null)[0];
          putComputerAt(blockIndex);
          return;
        }

        const linesToContinue = linesThatAre('O', null, null);
        if (linesToContinue.length > 0) {
          putComputerAt(linesToContinue[0].filter(index => squares[index] === null)[0]);
          return;
        }

        const randomIndex = emptyIndexes[Math.ceil(Math.random() * emptyIndexes.length)];
        putComputerAt(randomIndex);
      }
      // setflag(false)
    })
  }, [squares]);


  function SquareClick(index) {
    if (squares[index] !== null) {
      return 0;
    }
    if (lock) {
      return 0;
    }
    const isPlayerTurn = squares.filter(square => square !== null).length % 2 === 0;
    if (isPlayerTurn) {
      let newSquares = squares;
      newSquares[index] = symboluser;
      setSquares([...newSquares]);
    }
  }

  useEffect(() => {
    localStorage.setItem("usercount", JSON.stringify(usercount))
  }, [usercount])

  useEffect(() => {
    localStorage.setItem("cpucount", JSON.stringify(cpucount))
  }, [cpucount])

  useEffect(() => {
    localStorage.setItem("tiecount", JSON.stringify(tiecount))
  }, [tiecount])

  const won = (winner) => {
    setlock(true);
    // setflag(false);
    if (winner === symboluser) {
      setusercount(++usercount)
      winModal();
    }
    if (winner === symbolcpu) {
      setcpucount(++cpucount)
      winModal();
    }
    if (winner === "tie") {
      settiecount(++tiecount);
      winModal();
    }

  }

  //////////////////////win modal/////////////////////////////////

  const [winmodal, setWinmodal] = useState(false);

  const winModal = () => {
    setWinmodal(!winmodal);
  };

  if (winmodal) {
    document.body.classList.add('winactive-modal')
  } else {
    document.body.classList.remove('winactive-modal')
  }


  ////////////////////////Go-back modal////////////////////////////////

  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };

  if (modal) {
    document.body.classList.add('active-modal')
  } else {
    document.body.classList.remove('active-modal')
  }


  //////////   ***Quote***  ///////////////////
  let [quote, setquote] = useState('It is better to fail in originality than to succeed in imitation');
  let [countq, setcountq] = useState(1);

  const MINUTE = 60000;

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("https://api.adviceslip.com/advice")
        .then(response => response.json())
        .then(data => {
          setcountq(data.slip.id)
          setquote(data.slip.advice)

        })
        .catch((error) => {
          setquote(error)
          console.error('Error:', error);
        });
    }, MINUTE);

    return () => clearInterval(interval);
  }, [])


  ////*** navigate ***//////
  const navigate = useNavigate();

  function refreshPage() {
    window.location.reload(false);
  }

  const reset = () => {
    setlock(false);
    squares.fill(null)
    refreshPage();
  }

  const resetCnt = () => {
    localStorage.clear();
    setlock(false);
    squares.fill(null)
    refreshPage();
  }

  return (
    <>
      <div className='main-container1'>
        <div className='mob-view1'>
          <div className='header'>
            <div className="logo1">
              <div><img src={cross} alt="" /></div>
              <div><img src={circle} alt="" /></div>
            </div>
            <div className="pick">
              <div className='turn'>{pickvalue}<span>&nbsp;TURN</span> </div>
            </div>
            <div className="refresh">
              <div>
                <button id='refr' onClick={() => { toggleModal() }}><img src={refresh} alt="" /></button>
              </div>
            </div>
          </div>
          <div className='game-area'>
            <Board>
              {squares.map((item, index) =>
                <Square
                  cross={item === 'X' ? 1 : 0}
                  circle={item === 'O' ? 1 : 0}
                  onClick={() => SquareClick(index)} />
              )}
            </Board>

          </div>
          <div className="footer">
            <div className="you foot">{symboluser}(YOU)<br />{usercount}</div>
            <div className="tie foot">TIES<br />{tiecount}</div>
            <div className="cpu foot">{symbolcpu}(CPU)<br />{cpucount}</div>
          </div>
        </div>
      </div>
      <div className='quote-container'>
        <div className='quotes'>
          <h1>Quote #{countq}</h1>
          <p>“{quote}”</p>
          <button id='btn-quote' disabled><img src="\src\assets\Ellipse.png" alt="" /></button>
        </div>
      </div>

      {modal && (
        <div className="modal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content">
            <h2 id='confirmation'>Do you want to quit?</h2>
            <div className='btn'>
              <button className='play-agn' onClick={() => resetCnt()}>PLAY AGAIN</button>
              <button className='qt' onClick={() => navigate('/')}>QUIT</button>
            </div>
          </div>
        </div>
      )}

      {winmodal && (
        <div className="winmodal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="winmodal-content">
            {!!winner && winner === symboluser && (
              <>
                <h2 className='result-text'>YOU WON!</h2>
                <div className='result-box'>{pickvalue}<span className='round'>&nbsp;TAKES THE ROUND</span></div>
              </>
            )}
            {!!winner && winner === symbolcpu && (
              <>
                <h2 className='result-text'>YOU LOST!</h2>
                <div className='result-box'>{othervalue}<span className='round'>&nbsp;TAKES THE ROUND</span></div>
              </>
            )}
            {winner == "tie" && (
              <h2 className='result-text'>TIE!</h2>
            )
            }
            <div className='btn'>
              <button className='qt1' onClick={() => navigate('/')}>QUIT</button>
              <button className='next-round' onClick={() => reset()}>NEXT ROUND</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default game
