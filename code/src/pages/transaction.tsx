import { Recipient, Transaction } from '@meshsdk/core';
import React, { useEffect, useState } from "react";
import { BlockfrostProvider } from '@meshsdk/core';
import { NextPage } from 'next';

const TransactionComponent: NextPage<{wallet: any}> = ({wallet}) => {
    
    const blockfrostProvider = new BlockfrostProvider('previewdpdxvfGYwxZgYPrbdVS9pOF1QXd7tzDO');
    const [toAddress, setToAddress] = useState("");
    const [amount, setAmount] = useState("");
    const [message, setMessage] = React.useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
       require("bootstrap/dist/js/bootstrap.bundle.min.js");
    }, []);

    const handleAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
        setToAddress(event.target.value);
    }

    const handleAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(event.target.value);
    }

    const sendAda = async (toAddress: Recipient, amount: string, wallet: any) => {

        setLoading(true);

        try {
            const adaToLovelace = (amount: string) => {
                return Math.floor(parseFloat(amount) * 1000000).toString();
            }
            const lovelaceAmount = adaToLovelace(amount);
            if (!toAddress) {
                console.error('To address is undefined');
                return;
            }

            if (!lovelaceAmount) {
                console.error('amount is undefined');
                return;
            }
            const tx = new Transaction({ initiator: wallet })
                .sendLovelace(
                    toAddress, 
                    lovelaceAmount
                );
            const unsignedTx = await tx.build();
            const signedTx = await wallet.signTx(unsignedTx);
            const txHash = await wallet.submitTx(signedTx);
            await blockfrostProvider.onTxConfirmed(txHash, () => {
                setMessage("Transaction Confirmed");
                setToAddress("");
                setAmount("");
                setLoading(false);
            });
        } catch (error) {
            console.error("Transaction failed:", error);
            setMessage("Transaction Failed");
            setLoading(false);
        }
            
    }

    return (
        <div>
            <div className="form-group">
                <input type="text" value={toAddress} onChange={handleAddress} id="address" name="address" className="form-control" placeholder='Address' />
            </div>
            <div className="form-group">
                <input type="text" value={amount} onChange={handleAmount} id="amount" name="amount" className="form-control" placeholder='Amount' />
            </div>
            <button className="btn btn-lg text-primary" onClick={() => sendAda(toAddress,amount,wallet)} disabled={loading}>
                {loading ? 'Sending...' : 'Submit'}
            </button>
            {loading && <div>Loading...</div>}
            <p>{message}</p>
      </div>

    )
}

export default TransactionComponent;