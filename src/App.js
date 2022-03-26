import React from 'react';
import Die from './components/Die';
import { nanoid } from 'nanoid';
import Confetti from 'react-confetti';

function App() {
  const [isStarted, setIsStarted] = React.useState(false);
  const [statistics, setStatistics] = React.useState(
    {
      time: {minutes: 0, seconds: 0},
      rolls: 1
    }
  );
  const time = statistics.time;
  const [diceArray, setDiceArray] = React.useState(allNewDice());
  const [tenzi, setTenzi] = React.useState(false);

  function startGame() {
    setIsStarted(prevIsStarted => !prevIsStarted)
  }

  function generateNewDie() {
    const randomNum = Math.ceil(Math.random() * 6);
    return {
      value: randomNum,
      isHeld: false,
      id: nanoid()
    }
  }

  function allNewDice() {
    const newDices = [];
    for (let i = 0; i < 10; i++) {
        newDices.push(generateNewDie())
    }
    return newDices
  }

  function rollDice() {
    if (!tenzi) {
      setDiceArray(oldDiceArray => oldDiceArray.map(die => {
        return die.isHeld ?
            die :
            generateNewDie()
      }))

      setStatistics(prevStatistics => {
        return {
          ...prevStatistics,
          rolls: prevStatistics.rolls + 1,
        }
      })
    } else {
      setTenzi(false);
      setDiceArray(allNewDice());
      setStatistics(
        {
          time: {minutes: 0, seconds: 0},
          rolls: 1
        }
      )
    }
  }

  function holdDie(id) {
    setDiceArray(oldDiceArray => oldDiceArray.map(die => {
      return die.id === id ?
          {...die, isHeld: !die.isHeld} :
          die
    }))
  }

  function getBestScore() {
    return JSON.parse(localStorage.getItem('statistics')) || statistics;
  }
  const bestMinutes = getBestScore().time.minutes;
  const bestSeconds = getBestScore().time.seconds;

  function setBestScore() {
    const bestScore = getBestScore();
      localStorage.setItem('statistics', JSON.stringify
        ({
          time: time.minutes * 60 + time.seconds < bestMinutes * 60 + bestSeconds ? 
                time : bestScore.time,
          rolls: statistics.rolls < bestScore.rolls ?
                 statistics.rolls : bestScore.rolls
        }))
  }

  React.useEffect(() => {
    const allHeld = diceArray.every(die => die.isHeld)
    const firstValue = diceArray[0].value
    const allSameValue = diceArray.every(die => die.value === firstValue)
    if (allHeld && allSameValue) {
      setTenzi(true)
      setBestScore()
    }
  }, [diceArray])

  React.useEffect(() => {
    let timer;
    if (isStarted && !tenzi) {
      timer = setInterval(() => {
        setStatistics(prevStatistics => {
          const {minutes, seconds} = prevStatistics.time
          return {
            ...prevStatistics,
            time:
              {
                minutes: seconds === 59 ? minutes + 1 : minutes,
                seconds: seconds === 59 ? 0 : seconds + 1,
              },
          }
        })
      }, 1000);
    }
    return () => clearInterval(timer)
  }, [isStarted, tenzi])

  const diceElements = diceArray.map(die => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDie={() => holdDie(die.id)}
      />
  ));

  return (
    <main>
      {tenzi && <Confetti />}
      <div className="description">
        <h1 className="description__title">Tenzie</h1>
        <p className="description__para">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      </div>
      {isStarted ?
      <>
        <div className="dice-container">
          {diceElements}
        </div> 
        <button className="btn" onClick={rollDice}>{tenzi ? 'Play Again' : 'Roll'}</button>
        <div className="statistics">
          <div className="statistics__time">
            <h2>
              Time: {time.minutes < 10 ? '0' + time.minutes : time.minutes}:
                    {time.seconds < 10 ? '0' + time.seconds : time.seconds}
            </h2>
            <h2>
              (Best: {bestMinutes < 10 ? '0' + bestMinutes : bestMinutes}:
                     {bestSeconds < 10 ? '0' + bestSeconds : bestSeconds})
            </h2>
          </div>
          <div className="statistics__rerolls">
            <h2>Rolls: {statistics.rolls}</h2>
            <h2>
              (Best: {getBestScore().rolls})
            </h2>
          </div>
        </div>
      </> :
      <button className="btn" onClick={startGame}>Play Game</button>
      }
    </main>
  );
}

export default App;