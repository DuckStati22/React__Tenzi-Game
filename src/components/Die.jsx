import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiceOne } from '@fortawesome/free-solid-svg-icons';
import { faDiceTwo } from '@fortawesome/free-solid-svg-icons';
import { faDiceThree } from '@fortawesome/free-solid-svg-icons';
import { faDiceFour } from '@fortawesome/free-solid-svg-icons';
import { faDiceFive } from '@fortawesome/free-solid-svg-icons';
import { faDiceSix } from '@fortawesome/free-solid-svg-icons';


function Die(props) {
  const styles = {
    color: props.isHeld ? "#59E391" : "",
  }

  function numToFaDice(number) {
    switch (number) {
      case 1:
        return faDiceOne
      case 2:
        return faDiceTwo
      case 3:
        return faDiceThree
      case 4:
        return faDiceFour
      case 5:
        return faDiceFive
      case 6:
        return faDiceSix
    }
  }

  return (
      <FontAwesomeIcon
        className="die"
        style={styles}
        icon={numToFaDice(props.value)}
        onClick={props.holdDie}
      />
  )
}

export default Die