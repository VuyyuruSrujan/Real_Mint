import React, { useState } from 'react';

export default function GiftBoxMultiplier() {
  const [showModal, setShowModal] = useState(false);
  const [finalResult, setFinalResult] = useState(null);
  const [selectedGiftBox, setSelectedGiftBox] = useState(null);
  const [calculation, setCalculation] = useState('');
  const baseNumber = 15;
  const multipliers = [1, 1.5, 2, 2.5, 10];
  const selectedMultipliers = [];

  while (selectedMultipliers.length < 3) {
    const randomIndex = Math.floor(Math.random() * multipliers.length);
    const randomMultiplier = multipliers[randomIndex];
    if (!selectedMultipliers.includes(randomMultiplier)) {
      selectedMultipliers.push(randomMultiplier);
    }
  }

  const handleClick = (multiplier, index) => {
    const result = baseNumber * multiplier;
    setFinalResult(result);
    setCalculation(`${baseNumber} * ${multiplier} = ${result}`);
    setSelectedGiftBox(index);
    console.log(`Result: ${baseNumber} * ${multiplier} = ${result}`);
  };

  const handleShowModal = () => {
    setShowModal(true);
    setFinalResult(null);
    setSelectedGiftBox(null);
    setCalculation('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <button onClick={handleShowModal}>Show Gift Box Multiplier</button>
      {showModal && (
        <div className="overlay">
          <div className="modal">
            <h1>Choose a Gift Box</h1>
            {calculation && <h2>{calculation}</h2>}
            <div className="gift-boxes">
              {selectedMultipliers.map((multiplier, index) => (
                <div
                  key={index}
                  className={`gift-box ${selectedGiftBox !== null && selectedGiftBox !== index ? 'disabled' : ''}`}
                  onClick={() => selectedGiftBox === null && handleClick(multiplier, index)}
                >
                  ?
                </div>
              ))}
            </div>
            {finalResult !== null && (
              <button className="close-button" onClick={handleCloseModal}>
                Close
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
