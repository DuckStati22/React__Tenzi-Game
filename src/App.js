import React from 'react';
import Die from './components/Die';
import { nanoid } from 'nanoid';
import Confetti from 'react-confetti';

function App() {
  const [diceArray, setDiceArray] = React.useState(allNewDice());
  const [tenzi, setTenzi] = React.useState(false);


  React.useEffect(() => {
    const allHeld = diceArray.every(die => die.isHeld)
    const firstValue = diceArray[0].value
    const allSameValue = diceArray.every(die => die.value === firstValue)
    if (allHeld && allSameValue) {
      setTenzi(true)
    }
  }, [diceArray])


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
    } else {
      setTenzi(false);
      setDiceArray(allNewDice());
    }
  }

  function holdDie(id) {
    setDiceArray(oldDiceArray => oldDiceArray.map(die => {
      return die.id === id ?
          {...die, isHeld: !die.isHeld} :
          die
    }))
  }

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
      <div className="dice-container">
        {diceElements}
      </div>
      <button className="btn" onClick={rollDice}>{tenzi ? 'Play Again' : 'Roll'}</button>
    </main>
  );
}

export default App;