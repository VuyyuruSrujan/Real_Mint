import PlugConnect from '@psychedelic/plug-connect';

export default function First1(){

    async function conn(){
        const connected = await window.ic.plug.isConnected();
        console.log(connected)
    if (!connected) window.ic.plug.requestConnect({ whitelist:[process.env.CANISTER_ID_WALL_BACKEND,process.env.CANISTER_ID_WALL_FRONTEND] });
    console.log("jhgv");
    const requestBalanceResponse = await window.ic.plug.requestBalance();
    console.log("requestBalanceResponse",requestBalanceResponse)
    if (connected && !window.ic.plug.agent) {
    window.ic.plug.createAgent({ whitelist:[process.env.CANISTER_ID_WALL_BACKEND,process.env.CANISTER_ID_WALL_FRONTEND] })
    }
}


    return(
        <>
            <div>
                <div>
                    <ul id="menubar">
                        <li> Certificates </li>
                        <li> Real world nft's </li>
                        <li>
                            <PlugConnect Onclick={conn}
                                whitelist={[process.env.CANISTER_ID_WALL_BACKEND,process.env.CANISTER_ID_WALL_FRONTEND]}
                                onConnectCallback={
                                async () => console.log(await window.ic.plug.agent.getPrincipal())
                            } />
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}