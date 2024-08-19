import {useEffect, useState} from 'react';

import {getHttpEndpoint} from '@orbs-network/ton-access';
import {TonClient} from "@ton/ton";

import {MainContract} from '../contracts/MainContract';
import {Address, OpenedContract} from '@ton/core';

export function useAsyncInitialize<T>(func: () => Promise<T>, deps: any[] = []) {
    const [state, setState] = useState<T | undefined>();
    useEffect(() => {
        (async () => {
            setState(await func());
        })();
    }, deps);

    return state;
}

export function useTonClient() {
    return useAsyncInitialize(
        async () =>
            new TonClient({
                endpoint: await getHttpEndpoint({network: 'testnet'}),
            })
    );
}

export function useCounterContract() {
    const client = useTonClient();
    const [val, setVal] = useState<null | number>();

    const mainContract = useAsyncInitialize(async () => {
        if (!client) return;
        const contract = new MainContract(
            Address.parse('0QBo8ZRkUu7YtkTPxA2zxAeQnbTLb-ap_OrKgPOtu7A7hVYw') // replace with your address from tutorial 2 step 8
        );
        return client.open(contract) as OpenedContract<MainContract>;
    }, [client]);

    useEffect(() => {
        async function getValue() {
            if (!mainContract) return;
            setVal(null);
            const val = await mainContract.getData();
            setVal(Number(val));
        }

        getValue();
    }, [mainContract]);

    return {
        value: val,
        address: mainContract?.address.toString(),
    };
}


