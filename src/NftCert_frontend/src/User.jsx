import { NftCert_backend } from 'declarations/NftCert_backend';
import { useState, useEffect } from 'react';
import { AuthClient } from "@dfinity/auth-client";
import html2canvas from 'html2canvas';

export default function User() {
    const [identity, setIdentity] = useState(null);
    const [userToken, setUserToken] = useState(null);
    const [MintNft, SetMintNft] = useState([]); // Initialize as an empty array

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
                await gettokens(identity); // Fetch tokens once identity is set
            }
        }
        init();
    }, []);

    async function gettokens(identity) {
        if (identity) {
            try {
                const usertokens = await NftCert_backend.getTokenIdsForUserDip721(identity.getPrincipal());
                console.log("usertokens", Number(usertokens));
                setUserToken(usertokens); // Update state with fetched tokens
            } catch (error) {
                console.error("Error fetching tokens:", error);
            }
        } else {
            console.log("Identity not set");
        }
    }

    async function GetNfts() {
        const token = document.getElementById("utokenNumber").value;
        try {
            const mynft = await NftCert_backend.getMetadataDip721(BigInt(token));
            console.log(mynft);
            SetMintNft(mynft.Ok); // Access the 'Ok' array directly
        } catch (error) {
            console.error("Error fetching NFT:", error);
        }
    }

    // Function to download the certificate as an image
    const downloadCertificate = () => {
        const element = document.getElementById('Certificate1');
        html2canvas(element).then(canvas => {
            const link = document.createElement('a');
            link.download = 'certificate.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    };

    return (
        <>
            <div>
                <div>
                    <button id="ConnectBtn" onClick={handleConnect}>CONNECT</button>
                    <ul id="menubar">
                        <li> Certificates </li>
                        <li> Real world nft's </li>
                    </ul>
                </div>
                <div>
                    {identity ? identity.getPrincipal().toText() : "Not connected"}
                </div>
                <div>{userToken ? `User Tokens: ${userToken}` : "No tokens available"}</div>
            </div>
            <div>
                <label>Enter token id to get nft:</label>
                <input type='Number' id="utokenNumber" required />
                <button onClick={GetNfts}>Get my nft</button>
            </div>
            <div id="Certificate1">
                {MintNft.length > 0 && (
                    <div id="mintedData">
                        {MintNft.map((data, index) => (
                            <div key={index}>
                                <img src="WhatsApp Image 2024-07-22 at 22.46.33_826a419d.jpg" id="mintCert" />
                                <p id="CertPrint">This certificate is issued to <u><b><strong>{data.key_val_data[0].Name}</strong></b></u> from <u><b><strong>{data.key_val_data[0].Branch}</strong></b></u> Branch, Of RollNo <u><b><strong>{data.key_val_data[0].RollNo}</strong></b></u> On the completion of his
                                    Graduation in DVR & HS MIC College From <u><b><strong>{data.key_val_data[0].Starting}</strong></b></u> to <u><b><strong>{data.key_val_data[0].Ending}</strong></b></u> As part of his curriculum.</p>
                                <p id="SignatureTxt"><b><strong>Signature</strong></b></p>
                                {/* <p id="TokenIdtxt"><b><strong>TokenId:</strong></b> {token}</p> */}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {MintNft.length > 0 && (
                <button onClick={downloadCertificate}>Download Certificate</button>
            )}
        </>
    );
}
