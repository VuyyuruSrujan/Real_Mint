import { Principal } from '@dfinity/principal';
import { useLocation } from "react-router-dom";
import { NftCert_backend } from 'declarations/NftCert_backend';
import { useState, useEffect } from 'react';

export default function Profile() {
    const location = useLocation();
    const { principal } = location.state || {};
    const [transferdata, settransferdata] = useState([]);
    var [Balance,setBalance] = useState("");

    useEffect(() => {
        async function getMintedNfts() {
            if (principal) {
                const tokenids = await NftCert_backend.getMintTransDetById(Principal.fromText(principal));
                settransferdata(tokenids);
            }
        }
        getMintedNfts();
    }, [principal]);

    useEffect(() =>{
        async function getBalance(){
            if(principal) {
                var balance = await NftCert_backend.balanceOf(Principal.fromText(principal));
                console.log("balance",balance);
                setBalance(balance);
            }
        }
        getBalance();
    }  )

    return (
        <>
            <div id="ProfHead">
                <div id="Proftxt"><center><b><strong>Profile</strong></b></center></div>
                <div>
                    <p id="PrincProf"><b><strong>Principal:</strong></b> {principal}</p>
                    <p id="Balancetxt"><b><strong>Balance: {Balance.toString()}</strong></b></p>
                </div>
                <div>
                    <p id="MintedNftsTxt"><b><strong><u>Transaction Details</u></strong></b></p>
                    <div>
                        {transferdata.length === 0 ? (
                            <p id="AddAnyNotes">No transactions found</p>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Token ID</th>
                                        <th>Custodian(Creator)</th>
                                        <th>Owner(Student)</th>
                                        <th>Time and Date</th>
                                        <th>Transaction ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transferdata.map((transaction, index) => (
                                        <tr key={index}>
                                            <td>{transaction.tokenid.toString()}</td>
                                            <td>{transaction.custodian.toString()}</td>
                                            <td>{transaction.owner.toString()}</td>
                                            <td>{transaction.TimeDate}</td>
                                            <td>{transaction.transactionid.toString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
