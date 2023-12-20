import { useState } from 'react';
import { BlockfrostProvider, Transaction, resolveDataHash } from '@meshsdk/core';
import { useUserPoints } from '../components/userPointsContext';

export const usePointsConversion = (wallet: any) => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { userPoints, resetUserPoints } = useUserPoints();
  
  const blockfrostProvider = new BlockfrostProvider('previewdpdxvfGYwxZgYPrbdVS9pOF1QXd7tzDO');

    const _getAssetUtxo = async ({ scriptAddress, datum }: any) => {
        const _dataHash = resolveDataHash(datum);
        const utxos = await blockfrostProvider.fetchAddressUTxOs(
            scriptAddress,
            'lovelace'
        );

        const utxoWithMaxLovelace = utxos.reduce((maxUtxo: any, currentUtxo: any) => {
            const currentUtxoQuantity = parseInt(currentUtxo.output.amount[0].quantity, 10);
            const maxUtxoQuantity = maxUtxo ? parseInt(maxUtxo.output.amount[0].quantity, 10) : 0;
    
            if (currentUtxo.output.dataHash === _dataHash && currentUtxoQuantity > maxUtxoQuantity) {
                return currentUtxo;
            }
            return maxUtxo;
        }, null);
    
        return utxoWithMaxLovelace;
    };

    const unlockTokens = async () => {
        if (userPoints <= 100) {
            setStatus('You need more than 20 userPoints to unlock tokens');
        return;
        }

        setLoading(true);
        setStatus('');

        try {

            const scriptAddress = 'addr_test1wzcx2hv0cqjgccqkhpy7z79wzzrpl4xuktvsqd7znqtjxasamfx5j';
            const datum = 123943746;
            const _datumHash = resolveDataHash(datum);

            const recipientAddress = await wallet.getChangeAddress(); 

            const assetUtxo = await _getAssetUtxo({ scriptAddress, datum });

            if (!assetUtxo) {
                setStatus('No UTXO found with the specified script address, and datum');
                setLoading(false);
                return;
            }

            const adaToUnlock = (userPoints * 1000000) / 10;

            const utxoQty = parseInt(assetUtxo.output.amount[0].quantity, 10);

            const remainingAmount = utxoQty - adaToUnlock; 

            if (utxoQty < adaToUnlock) {
                setStatus('Not enough ADA available to unlock');
                setLoading(false);
                return;
            }

            const contractOutput = {
                address: scriptAddress,
                datum: {
                    value: datum
                },
            }

            const tx = new Transaction({ initiator: wallet })
                .redeemValue({
                    value: assetUtxo,
                    script: {
                        version: 'V2',
                        code: '583b5839010000322225335333573466ebc00cdd424109db32ec2440042440022008264c649319ab9c49010b77726f6e6720646174756d000041200101',
                    },
                    datum,
                })
                .sendLovelace(contractOutput, remainingAmount.toString())
                .setRequiredSigners([recipientAddress]);
            
            const unsignedTx = await tx.build();

            const signedTx = await wallet.signTx(unsignedTx, true);

            const txHash = await wallet.submitTx(signedTx);

            resetUserPoints();

            await blockfrostProvider.onTxConfirmed(txHash, () => {
                setStatus('Tokens successfully unlocked!');
                setMessage("Transaction Confirmed");
                setLoading(false);
            });

    
        } catch (error) {
            setStatus('Error unlocking tokens. Please try again later.');
            setLoading(false);
        } 
    };

  return {
    unlockTokens,
    status,
    loading,
    message
  };
};
