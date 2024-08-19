import {useEffect, useState} from "react";
import {MainContract} from "../contracts/MainContract.ts";
import {Address, OpenedContract, Sender, SenderArguments, toNano} from "@ton/core";
import {useAsyncInitialize} from "./useAsyncInitialize.ts";
import {useTonClient} from "./useAsyncInitialize.ts";

import {useTonConnectUI} from '@tonconnect/ui-react';

/** 获取合约数据 */
export function useMainContract() {
    const client = useTonClient();
    const {sender} = useTonConnect();

    const [contractData, setContractData] = useState<null | {
        counter_value: number;
        recent_sender: Address;
        owner_address: Address;
    }>();
    const [balance, setBalance] = useState<null | number>(0)

    const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

    const mainContract = useAsyncInitialize(async () => {
        if (!client) return;
        const contract = new MainContract(
            Address.parse('EQDp1s6q7bna44LnSU9HKmkk0NOmCmeKEDDRA4IowFypzyfo') // replace with your address from tutorial 2 step 8
        );
        return client.open(contract) as OpenedContract<MainContract>;
    }, [client]);

    useEffect(() => {
        async function getValue() {
            if (!mainContract) return;

            setContractData(null);
            setBalance(0);

            const {number, recent_sender, owner_sender} = await mainContract.getData();
            const {balance} = await mainContract.getBalance();

            setContractData({
                counter_value: number,
                recent_sender,
                owner_address: owner_sender
            });
            setBalance(balance);

            await sleep(5000) // 每 5 秒刷新一次
            getValue()
        }

        getValue();
    }, [mainContract]);

    return {
        contract_address: mainContract?.address.toString(),
        contract_balance: balance,
        ...contractData,
        sendIncr: async () => {
            return mainContract?.sendInternalMessage(sender, toNano('0.06'), 5)
        },
        sendSave: async () => {
            return mainContract?.sendDeposit(sender, toNano('0.08'))
        },
        sendTake: async () => {
            return mainContract?.sendWithdrawalRequest(sender, toNano('0.06'), toNano('0.2'))
        },
    };
}

export function useTonConnect(): { sender: Sender; connected: boolean } {
    const [tonConnectUI] = useTonConnectUI();

    return {
        sender: {
            send: async (args: SenderArguments) => {
                tonConnectUI.sendTransaction({
                    messages: [
                        {
                            address: args.to.toString(),
                            amount: args.value.toString(),
                            payload: args.body?.toBoc().toString('base64'),
                        },
                    ],
                    validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
                });
            },
        },
        connected: tonConnectUI.connected,
    };
}
