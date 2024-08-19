import {TonConnectButton} from '@tonconnect/ui-react';
import {useMainContract, useTonConnect} from './hooks/useTonMainContract.ts';
import {Address, fromNano} from "@ton/core";

import {Card, Flex, Button} from "antd";

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
                <Card title="Contract" bordered={false}  style={{width: 350, marginLeft: 150}}>
                    <TonConnectButton/>

                    <div className='Card'>
                        <b>合约地址</b>
                        <div className='Hint'>{contract_address?.slice(0, 30) + '...'}</div>
                    </div>

                    <div className='Card'>
                        <b>余额</b>
                        <div>{fromNano(contract_balance ?? 0)} TON</div>
                    </div>

                    <div className='Card'>
                        <b>计数器</b>
                        <div>{counter_value ?? 'Loading...'}</div>
                    </div>

                    {connected && (
                        <>
                            <Flex gap="small" align="flex-start" vertical>
                                <Flex gap="small" wrap>
                                    <Button type="primary" onClick={() => sendIncr()}>Incr 5</Button>
                                    <Button type="primary" onClick={() => sendSave()}>存入</Button>
                                    <Button type="primary" onClick={() => sendTake()}>取出</Button>
                                </Flex>
                            </Flex>
                        </>
                    )}
                </Card>
            </div>
        </div>
    )
}

export default App
