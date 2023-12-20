import { NextPage } from "next";
import React from 'react';
import { usePointsConversion } from "@/hooks/userPointsConversion";
import { useUserPoints } from '../components/userPointsContext';

const PointsConversion : NextPage<{wallet: any}> = ({wallet}) => {

    const { unlockTokens, status, loading, message } = usePointsConversion(wallet);
    const { userPoints } = useUserPoints();


    return (
        <div>
          <p>Points: {userPoints}</p>
          <button className="btn btn-lg text-primary" onClick={unlockTokens} disabled={loading || userPoints <= 100}>
            {loading ? 'Unlocking...' : 'Unlock Tokens'}
          </button>
          {status && <p>{status}</p>}
          {loading && <div>Loading...</div>}
          <p>{message}</p>
        </div>
      );
};

export default PointsConversion;