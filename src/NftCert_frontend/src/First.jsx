import { useState, useEffect, useRef } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { useNavigate } from 'react-router-dom';
import { NftCert_backend } from 'declarations/NftCert_backend';
import { Principal } from '@dfinity/principal';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti'; // Import confetti

export default function First() {
    const [identity, setIdentity] = useState(null);
    const navigate = useNavigate();
    const [mintedData, setMintedData] = useState("");
    const [tokenId, setTokenId] = useState("");
    const [isMinted, setIsMinted] = useState(false);
    const inputSectionRef = useRef(null);

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

    async function handleConnect() {
        const authClient = await AuthClient.create();
        authClient.login({
            maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
            identityProvider: "https://identity.ic0.app/#authorize",
            onSuccess: async () => {
                const identity = await authClient.getIdentity();
                setIdentity(identity);
            },
        });
    }

    useEffect(() => {
        async function init() {
            const authClient = await AuthClient.create();
            if (await authClient.isAuthenticated()) {
                const identity = await authClient.getIdentity();
                setIdentity(identity);
            }
        }
        init();
    }, []);

    function ProfileFunc() {
        if (identity != null) {
            navigate('/Profile', { state: { principal: identity.getPrincipal().toText() } });
        } else {
            alert("connect to internet identity");
        }
    }

    async function MintingStudentDetails() {
        setIsLoading(true); // Start loading
        var Name = document.getElementById('NameOfStu').value;
        var RollNo = document.getElementById("StudentId").value;
        var Branch = document.getElementById("StuBrance").value;
        var Creator = identity.getPrincipal();
        var owner = Principal.fromText(document.getElementById("StuPrincipal").value);
        var start = document.getElementById('startdate').value;
        var EndDate = document.getElementById("EndDate").value;

        var MetadataKeyVal = {
            Name: Name,
            RollNo: RollNo,
            Branch: Branch,
            Creator_Principal: Creator,
            Owner: owner,
            Starting: start,
            Ending: EndDate
        }
        var MetadataPart = {
            key_val_data: [MetadataKeyVal]
        };
        var MetadataDesc = [MetadataPart];

        var minting = await NftCert_backend.mintDip721(owner,MetadataDesc);
        if (minting.Ok) {
            console.log("minting", minting);
            console.log(minting.Ok.token_id, "printing di");
            setTokenId(minting.Ok.token_id);
            setIsMinted(true);
            alert("minted");
            var tokenid = minting.Ok.token_id.toString();
            var getdata = await NftCert_backend.getMetadataDip721(BigInt(tokenid));
            console.log(getdata);
            setMintedData(getdata.Ok);

            var MinttransferDet = {
                tokenid: minting.Ok.token_id,
                owner: owner,
                custodian: Creator,
                TimeDate: (new Date().toString()),
                transactionid: minting.Ok.id
            };

            var MintingTrans = await NftCert_backend.addMintingTransDet(MinttransferDet);
            console.log("Minting Transfer details", MintingTrans);
            console.log(MinttransferDet);

            handleShowModal();
        }
        setIsLoading(false); // End loading
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
            const mintingcoins = await NftCert_backend.mint(identity.getPrincipal(), result);
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

    const downloadImage = () => {
        html2canvas(document.querySelector("#Certificate")).then(canvas => {
            const link = document.createElement("a");
            link.download = "Certificate.png";
            link.href = canvas.toDataURL();
            link.click();
        });
    };

    const handleMintButtonClick = () => {
        inputSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    function Assetfunc(){
        try {
            if (identity != null) {
                navigate('/RealAssests', { state: { principal: identity.getPrincipal().toText() } });
            } else {
                alert("connect to internet identity");
            }
        } catch (error) {
            console.log(error)
        }
       
    }

    return (
        <>
            <div id="FirstPageHead">
                <div id="NFTForge"><b><strong>VERIMINT</strong></b></div>
                <div>
                    <button id="ConnectBtn" onClick={handleConnect}>CONNECT</button>
                </div>
                <div id="MainOne">
                    <p id="MainHead"><b>Get Your Safe and Secure <span id="Nfttxt"><strong>NFT Certificates</strong></span></b></p>
                </div>
                <div><button onClick={ProfileFunc} id='ProfileBtn'>Profile</button></div>
                <div><button onClick={Assetfunc} id='assetbtninFirst'>Myassets</button></div>
                <button id="MintBtn" onClick={handleMintButtonClick}>Mint</button>
                <div className="image-container">
                    <ul id="Images">
                        <li><img src="myChannel.gif" id="ImgCerti" /></li>
                    </ul>
                </div>
                <div id="inputs" ref={inputSectionRef}>
                    <center><b>Enter student details and mint the certificate</b></center>
                    <ul id="InputsLists">
                        <li id="Li1">
                            <label>Student Name:</label>
                            <input type="text" id="NameOfStu" required /><br />
                            <label>Roll Number:</label>
                            <input type="text" id="StudentId" required /><br />
                            <label>Department:</label>
                            <input type="text" id="StuBrance" required /><br />
                            <label>Creator Principal:</label>
                            <input type="text" value={identity ? identity.getPrincipal().toText() : 'connect to internet identity'} id="CreatorPrincipal" readOnly /><br />
                        </li>
                        <li id="Li2">
                            <label>Owner's Principal:</label>
                            <input type="text" id="StuPrincipal" required /><br />
                            <label>start date:</label>
                            <input type="date" required id="startdate" /><br />
                            <label>End date:</label>
                            <input type="date" id="EndDate" required /><br />
                        </li>
                    </ul>
                    <center><button id="SubmitNftdetails" onClick={MintingStudentDetails}>Mint Student details</button></center>
                </div>
                <div id="Certificate">
                    {mintedData && (
                        <div id="mintedData">
                            {mintedData.map((data, index) => (
                                <div key={index}>
                                    <img src="WhatsApp Image 2024-07-22 at 22.46.33_826a419d.jpg" id="mintCert" />
                                    <p id="CertPrint">This certificate is issued to <u><b><strong>{data.key_val_data[0].Name}</strong></b></u> from <u><b><strong>{data.key_val_data[0].Branch}</strong></b></u> Branch, Of RollNo <u><b><strong>{data.key_val_data[0].RollNo}</strong></b></u> On the completion of his
                                        Graduation in DVR & HS MIC College From <u><b><strong>{data.key_val_data[0].Starting}</strong></b></u> to <u><b><strong>{data.key_val_data[0].Ending}</strong></b></u> As part of his curriculum.</p>
                                        <p id="SignatureTxt"><b><strong>Signature</strong></b></p>
                                        <p id="TokenIdtxt"><b><strong>TokenId:</strong></b> {tokenId.toString()}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {isMinted && (
                    <button onClick={downloadImage} id="DownloadBtn"><b><strong>Download</strong></b></button>
                )}
                <div id="CompleteSubmittedDetails">
                    {mintedData && (
                        <div id="mintedData">
                            <center><h3>Complete Details</h3></center>
                            {mintedData.map((data, index) => (
                                <div key={index}>
                                    <p><strong>Name:</strong> {data.key_val_data[0].Name}</p>
                                    <p><strong>RollNo:</strong> {data.key_val_data[0].RollNo}</p>
                                    <p><strong>Branch:</strong> {data.key_val_data[0].Branch}</p>
                                    <p><strong>Creator Principal:</strong> {data.key_val_data[0].Creator_Principal.toText()}</p>
                                    <p><strong>Owner:</strong> {data.key_val_data[0].Owner.toText()}</p>
                                    <p><strong>Starting:</strong> {data.key_val_data[0].Starting}</p>
                                    <p><strong>Ending:</strong> {data.key_val_data[0].Ending}</p>
                                </div>
                            ))}
                        </div>
                    )}
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
                                <h2>Congratulations! You have earned {finalResult} VRT's!</h2>
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
