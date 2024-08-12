import { useNavigate } from 'react-router-dom';

export default function MintOrReal(){
    const navigate = useNavigate();

    function FirstRedi(){
        navigate('/First');
    }
    function UserRedirect(){
        navigate('/User');
    }

    return(
        <>
            <div id="ZeroHead">
                <div id="MRHeading">
                    <center><b><strong>RealWorldMint</strong></b></center>
                </div>
                <div>
                    <h3 id="GetRew">Get rewarded for your every minting </h3>
                    <p id="MintingCert">Click here to Mint Academic Student Certificates </p>
                    <p id="RealWorldLink">Click here to get Real world assests Onchain</p>
                </div>
                <button onClick={FirstRedi}>custodian</button><br /><br />
                <button onClick={UserRedirect}>User</button>
            </div>
        </>
    );
}