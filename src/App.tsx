import {TonConnectButton} from '@tonconnect/ui-react';
import {useMainContract, useTonConnect} from './hooks/useTonMainContract.ts';
import {Address, fromNano} from "@ton/core";

function App() {
    const {
        sendIncr,
        sendSave,
        sendTake,
        contract_address,
        counter_value,
        recent_sender,
        owner_address,
        contract_balance
    } = useMainContract();
    const balance = fromNano(contract_balance ?? 0)

    const {connected} = useTonConnect()

    return (
        <div className='App'>
            <div className='Container'>
                <TonConnectButton/>

                <div className='Card'>
                    <b>Counter Address</b>
                    <div className='Hint'>{contract_address?.slice(0, 30) + '...'}</div>
                </div>

                <div className='Card'>
                    <b>Balance</b>
                    <div>{fromNano(contract_balance ?? 0)} TON</div>
                </div>

                <div className='Card'>
                    <b>Counter Value</b>
                    <div>{counter_value ?? 'Loading...'}</div>
                </div>

                {connected && (
                    <>
                        <a onClick={() => sendIncr()}>Incr 5</a>
                        <a onClick={() => sendSave()}>存入</a>
                        <a onClick={() => sendTake()}>取出</a>
                    </>
                )}

        </div>
</div>
)
}

export default App
