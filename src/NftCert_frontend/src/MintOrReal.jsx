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
                    <p id="MintingCert">Click here to Mint Student Academic Credentials Or for RealWorldAsset Minting <button onClick={FirstRedi} id="RwCusbtn">custodian</button></p>
                    <p id="RealWorldLink">Check Your minted Nft's here as a User <button onClick={UserRedirect} id="RWUserbtn">User</button></p>
                </div>
                <br /><br />
                
            </div>
        </>
    );
}