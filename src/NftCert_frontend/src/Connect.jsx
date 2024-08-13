import { AuthClient } from "@dfinity/auth-client";
import { useNavigate } from 'react-router-dom';
import { NftCert_backend } from 'declarations/NftCert_backend';
import { Principal } from '@dfinity/principal';
import { useState, useEffect } from 'react';
import { conditionalDelay } from "@dfinity/agent/lib/cjs/polling/strategy";

export default function Connect() {
    const navigate = useNavigate();
    const [identity, setIdentity] = useState(null);

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
                const p = identity.getPrincipal().toText();
                navigate('/MintOrReal', { state: { principal: identity.getPrincipal().toText() } })
            }
        }
        init();
    }, []);
    return (
        <>
            <div>
                <button id="ConnectBtn" onClick={handleConnect}>CONNECT</button>
            </div>
        </>
    );
}