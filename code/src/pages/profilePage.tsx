import { useState } from "react";
import { NextPage } from "next";
import Link from "next/link";
import { useEffect } from "react";
import { useWallet } from '@meshsdk/react';
import styles from "../styles/Profile.module.css";
import TransactionComponent from "./transaction";
import PointsConversion from "./pointsConversion";
import { usePointsConversion } from "../hooks/userPointsConversion";
import { useUserPoints } from '../components/userPointsContext';
import Head from 'next/head'


const ProfilePage: NextPage = () => {
  
    const { connected, wallet, connect, disconnect } = useWallet();
    const [selectedWallet, setSelectedWallet] = useState<null | any>(null);
    const [lovelace, setLovelace] = useState<null | any>(null);
    const [changeAddress, setChangeAddress] = useState<null | any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [walletConnected, setWalletConnected] = useState(false);
    const { userPoints, addUserPoints, resetUserPoints } = useUserPoints();
    const { unlockTokens } = usePointsConversion(wallet);


    async function getLovelace() {
      if (wallet) {
        setLoading(true);
        const _assets = await wallet.getLovelace();
        setLovelace(_assets);
        setLoading(false);

        return _assets;
      }
    }

    async function getChangeAddress() {
      if (wallet) {
        setLoading(true);
        const _changeAddress = await wallet.getChangeAddress();
        setChangeAddress(_changeAddress);
        setLoading(false);

        return _changeAddress;
      }
    }

    async function onDisconnect() {
      if (wallet) {

        await unlockTokens();

        localStorage.removeItem('selectedWallet');
        disconnect();
        setSelectedWallet(null);
        resetUserPoints();
      }
    }

    const handleLinkClick = () => {
      setStartTime(new Date());
    };

    const handleFocus = () => {
      if (startTime) {
        const endTime = new Date();
        const timeSpentMilliseconds = endTime.getTime() - startTime.getTime();
        const timeSpentSeconds = Math.round(timeSpentMilliseconds / 1000);
        
        assignPoints(timeSpentSeconds);

        setStartTime(null); 
      }
    };

    const assignPoints = (timeSpentSeconds: number) => {
      const points = Math.floor(timeSpentSeconds * 10);

      addUserPoints(points);

  };

    useEffect(() => {
      const storedWallet = localStorage.getItem('selectedWallet');
      
      if (storedWallet) {
        setSelectedWallet(JSON.parse(storedWallet));

        connect(JSON.parse(storedWallet).name).then(() => {
            setWalletConnected(true); 
        });
      }
    }, [connect]);

    useEffect(() => {
      const intervalId = setInterval(async () => {
        const latestLovelace = await getLovelace();
        if (latestLovelace && parseInt(latestLovelace) !== lovelace) {
          setLovelace(parseInt(latestLovelace));
        }
      }, 3000);
    
      return () => clearInterval(intervalId);
    }, [lovelace]);

    useEffect(() => {
      if (walletConnected) {
        getChangeAddress();
        getLovelace();
      }
    }, [walletConnected]);


    useEffect(() => {
      window.addEventListener('focus', handleFocus);

      return () => {
        window.removeEventListener('focus', handleFocus);
      };
    }, [startTime]);

    useEffect(() => {
      require("bootstrap/dist/js/bootstrap.bundle.min.js");
    }, []);

    return (
      <div className={`${styles.main}`}>
        <Head>
          <title>Profile</title>
        </Head>
        <div className={`container ${styles.ppContainer}`}>
          <nav className={`navbar navbar-inverse ${styles.ppNavbar}`}>
            <div className={`container-fluid ${styles.ppContainerFluid}`}>
              <div className={`navbar-header ${styles.ppNavbarHeader}`}>
                <Link className={`navbar-brand ${styles.ppNavbarBrand}`} href="/"> <img src="logo-white.png" /> </Link>
              </div>
              <ul className={`nav navbar-nav navbar-right ${styles.ppNav}`}>
                <li className={`active`}><Link href="/profilePage">PROFILE</Link></li>
                <li><Link href="/" onClick={onDisconnect}>DISCONNECT</Link></li>
              </ul>
            </div>
          </nav>
        </div>
        <div className={`container mt-10 ${styles.ppContent}`}>
          <div className={`row ${styles.ppContainerRow}`}>
            <div className={`col-md-6 ${styles.ppContainerCol1}`}>
              <div className={`mb-4 ${styles.ppUserInfo}`}>
                {connected && (
                  <h4>{changeAddress}</h4>
                )}
                <h2 className={`${styles.ppLabelPoints}`}>POINTS : </h2><h3 id="header-points">{userPoints}</h3>
                <h2 className={`${styles.ppLabelTokens}`}>TOKENS: </h2>
                <h3 id="header-tokens">
                  {connected && (
                    <p>{lovelace / 1000000}</p>
                  )}
                </h3>
              </div>
              <div className={`mb-4`}>
                <h2 className={`${styles.ppLabelTransaction}`}>Send ADA</h2>
                <TransactionComponent wallet={wallet} />
              </div>
              <div className={`mb-4`}>
                <h2 className={`${styles.ppLabelConversion}`}>Points Conversion</h2>
                <PointsConversion wallet={wallet} />
              </div>
            </div>
            <div className={`col-md-6 ${styles.ppContainerCol2}`}>
              <div>
                <h4>Links</h4>
                <table className="table table-hover">
                  <tbody>
                    <tr>
                      <td>Amazon</td>
                      <td>
                        <button type="button" className={`btn btn-lg text-primary`} onClick={handleLinkClick}>
                          <Link href="https://www.amazon.ca/" target="_blank">Open</Link>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>Walmart</td>
                      <td>
                        <button type="button" className={`btn btn-lg text-primary`} onClick={handleLinkClick}>
                          <Link href="https://www.walmart.ca/en" target="_blank">Open</Link>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>Best Buy</td>
                      <td>
                        <button type="button" className={`btn btn-lg text-primary`} onClick={handleLinkClick}>
                          <Link href="https://www.bestbuy.ca/en-ca" target="_blank">Open</Link>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>Costco</td>
                      <td>
                        <button type="button" className={`btn btn-lg text-primary`} onClick={handleLinkClick}>
                          <Link href="https://www.costco.ca/" target="_blank">Open</Link>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default ProfilePage;