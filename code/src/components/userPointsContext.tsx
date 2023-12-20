import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserPointsContextProps {
  userPoints: number;
  addUserPoints: (points: number) => void;
  resetUserPoints: () => void;
}

const UserPointsContext = createContext<UserPointsContextProps | undefined>(undefined);

interface UserPointsProviderProps {
  children: ReactNode;
}

export const UserPointsProvider: React.FC<UserPointsProviderProps> = ({ children }) => {
  const [userPoints, setUserPoints] = useState<number>(0);

  const resetUserPoints = () => {
    setUserPoints(0);
  };

  const addUserPoints = (points: number) => {
    setUserPoints(prevPoints => prevPoints + points);
  };

  return (
    <UserPointsContext.Provider value={{ userPoints, addUserPoints, resetUserPoints }}>
      {children}
    </UserPointsContext.Provider>
  );
};

export const useUserPoints = (): UserPointsContextProps => {
  const context = useContext(UserPointsContext);
  if (context === undefined) {
    throw new Error('useUserPoints must be used within a UserPointsProvider');
  }
  return context;
};
