import { Principal } from '@dfinity/principal';
import { useLocation } from "react-router-dom";
import { NftCert_backend } from 'declarations/NftCert_backend';
import {useEffect } from 'react';
import React, { useState } from 'react';
import confetti from 'canvas-confetti';

export default function RealAssets() {
  const [imageBlob, setImageBlob] = useState(null);
  const location = useLocation();
  const { principal } = location.state || {};

  const [showModal, setShowModal] = useState(false);
  const [finalResult, setFinalResult] = useState(null);
  const [selectedGiftBox, setSelectedGiftBox] = useState(null);
  const [calculation, setCalculation] = useState('');
  const [isLoading, setIsLoading] = useState(false); // New loading state
  const baseNumber = 15;
  const multipliers = [1,2,3,5,10];
  const selectedMultipliers = [];

  while (selectedMultipliers.length < 3) {
      const randomIndex = Math.floor(Math.random() * multipliers.length);
      const randomMultiplier = multipliers[randomIndex];
      if (!selectedMultipliers.includes(randomMultiplier)) {
          selectedMultipliers.push(randomMultiplier);
      }
  }


  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const blob = new Blob([reader.result], { type: file.type });
        setImageBlob(blob);
      };
      reader.readAsArrayBuffer(file);
    }
  };
  async function MintingAssests(){
    setIsLoading(true); 
    var Nm = document.getElementById("assetUserName").value;
    var AssetType  =document.getElementById("AssetName").value;
    var AssetId  = document.getElementById("AssetId").value;
    var custoPrin = Principal.fromText(principal);
    var UserPrin = Principal.fromText(document.getElementById("OwnerPrin").value);
    var RegDate = document.getElementById("RegDate").value;
    // var MetadataKeyValAsset = {
    //     AuserName:Nm,
    //     AssetName:AssetType,
    //     AssetId:AssetId,
    //     Image:new Uint8Array(imageBlob)
    //   };
    var MetadataKeyVal = {
      Name:Nm,
      RollNo:AssetId,
      Branch:AssetType,
      Creator_Principal:custoPrin,
      Owner:UserPrin,
      Starting:RegDate,
      Ending:RegDate
    };
      console.log(MetadataKeyVal);
      var MetadataPart = {
        key_val_data: [MetadataKeyVal]
    };
    var MetadataDesc = [MetadataPart];

     var minting = await NftCert_backend.mintDip721(UserPrin,MetadataDesc)
     console.log(" asset minting",minting);
     if(minting){
        alert("minted");
        handleShowModal();
     }
     setIsLoading(false);
  }

  const handleClick = async (multiplier, index) => {
    const result = baseNumber * multiplier;
    setFinalResult(result);
    setCalculation(`${baseNumber} * ${multiplier} = ${result}`);
    setSelectedGiftBox(index);
    console.log(`Result: ${baseNumber} * ${multiplier} = ${result}`);
    
    triggerConfetti(); 

    try {
        // Await the minting function from your backend
        const mintingcoins = await NftCert_backend.mint(Principal.fromText(principal),result);
        console.log("mintingcoins",mintingcoins);
    } catch (error) {
        console.error("Error minting coins:", error);
    }
};


const triggerConfetti = () => {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
    });
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
    <>
      <div id="RealBody">
        <center>
          <div>
            Make your assets ON CHAIN
          </div>
        </center>
        {/* <div>
          <button id="MintAssetBtn"> My assets </button>
        </div> */}
        <div>
          <u>Fill yor asset Details:</u>
        </div><br /><br />
        <div id="AssetInput">
          <label>Enter your Name:</label>
          <input type="text" id="assetUserName" /><br /><br />
          <label>Enter the type of Asset:</label>
          <input type="text" id="AssetName" /><br /><br />
          <label>Enter the asset id:</label>
          <input type="Text" id="AssetId" /><br /><br />
          <label>Custodian:</label>
          <input type="Text" id="custoPrin" value={principal} readOnly /><br /><br />
          <label>Owner:</label>
          <input type="OwnPrin" id="OwnerPrin" /><br /><br />
          <label>Upload Asset Image:</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} id="ImgScan"/><br /><br />
          <label>Enter date:</label>
          <input type="date" id="RegDate" /><br /><br />
          <button id="MintassestBtn" onClick={MintingAssests}>Mint Asset</button>
        </div>
      </div>

      {isLoading && (
                <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                </div>
            )}
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
                            <>
                                <h2>Congratulations! You have earned {finalResult} Assetcert's!</h2>
                                <button className="close-button" onClick={handleCloseModal}>
                                    Close
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
    </>
  );
}

