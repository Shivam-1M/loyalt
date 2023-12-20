import { useWallet, useWalletList } from "@meshsdk/react";
import { NextPage } from "next";
import style from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import Image from 'next/image'

const CustomWallet: NextPage = () => {
    const [selectedWallet, setSelectedWallet] = useState<null | any>(null);

    const { connected, wallet, connect, connecting } = useWallet();
    const walletList = useWalletList();

    const onSelectWallet = (wallet: any) => {
        localStorage.setItem('selectedWallet', JSON.stringify(wallet));
        setSelectedWallet(wallet);
        connect(wallet.name);
    }

    useEffect(() => {
        require("bootstrap/dist/js/bootstrap.bundle.min.js");
    
        const storedWallet = localStorage.getItem('selectedWallet');
        if (storedWallet) {
            setSelectedWallet(JSON.parse(storedWallet));
            connect(JSON.parse(storedWallet).name);
        }
    }, [connect]);

    return (
        <div className="dropdown">
            {selectedWallet && connected ? (
                <>
                    <div className="caret">
                        <h2>Connected!</h2>
                    </div>
                </>

            ) : (
                <>
                    {!selectedWallet && !connecting && (
                        <>
                            <button type="button" className={`btn btn-dark btn-outline-primary btn-lg dropdown-toggle ${style.cwBtn}`} data-bs-toggle="dropdown" aria-expanded="false">Connect Wallet</button>
                            <ul className={`dropdown-menu ${style.cwBtnDropdown}`}>
                                {walletList.map((wallet) => (
                                    <li key={wallet.name} onClick={() => onSelectWallet(wallet)}>
                                    <a className="dropdown-item" href="#">
                                        <Image src={wallet.icon} alt={wallet.name} width={24} height={24} />
                                        {wallet.name}
                                    </a>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </>
            )}
        </div>
    );
}

export default CustomWallet;
