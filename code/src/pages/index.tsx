import { useState } from "react";
import type { NextPage } from "next";
import { useWallet } from '@meshsdk/react';
import styles from "../styles/Home.module.css"
import Link from "next/link";
import CustomWallet from "./customWallet";
import Head from 'next/head'

const Home: NextPage = () => {
  const { connected, wallet } = useWallet();
  const [assets, setAssets] = useState<null | any>(null);
  const [loading, setLoading] = useState<boolean>(false);


  return (
    <div>
      <Head>
        <title>Welcome</title>
      </Head>
      <div className={`container ${styles.lpContainer}`}>
        <img src="logo-no-background.png" className={`mx-auto p-2`}/>
        <div className={`container-fluid ${styles.lpContainerFluid}`}>
          { !connected ? (
            <CustomWallet />
          ) : (
            <>
              <button type="button" className={`btn btn-lg ${styles.lpBtn}`}>
                <Link href="/profilePage" className="link">Profile</Link>
              </button>
              <h2 className={`${styles.lpWelcome}`}>WELCOME</h2>
            </>
          )}
        </div>
      </div>
      <button type="button" className={`btn btn-lg ${styles.btnDoc}`}>
          <a href="https://github.com/Shivam-1M/lps-doc" target="_blank" className="link">Documentation</a>
      </button>
    </div>
  );
};

export default Home;