import React, { createContext, useContext, useState } from 'react';

// Types flexibles
type User = Record<string, any>;
type Prestation = Record<string, any>;
type PlannedPrestation = Record<string, any>;

// Interfaces de contextes
interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
}

interface CurrentWorkerPrestationContextType {
  currentWorkerPrestation: Prestation | null;
  setCurrentWorkerPrestation: (prestation: Prestation) => void;
}

interface AllWorkerPrestationContextType {
  allWorkerPrestation: Prestation | null;
  setAllWorkerPrestation: (prestation: Prestation) => void;
}

interface PlannedPrestationContextType {
  newPlannedPrestation: PlannedPrestation | null;
  setNewPlannedPrestation: (prestation: PlannedPrestation) => void;
}

// Contexts
const UserContext = createContext<UserContextType | undefined>(undefined);
const CurrentWorkerPrestationContext = createContext<CurrentWorkerPrestationContextType | undefined>(undefined);
const AllWorkerPrestationContext = createContext<AllWorkerPrestationContextType | undefined>(undefined);
const PlannedPrestationContext = createContext<PlannedPrestationContextType | undefined>(undefined);

// Providers
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export const CurrentWorkerPrestationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentWorkerPrestation, setCurrentWorkerPrestation] = useState<Prestation | null>(null);
  return (
    <CurrentWorkerPrestationContext.Provider value={{ currentWorkerPrestation, setCurrentWorkerPrestation }}>
      {children}
    </CurrentWorkerPrestationContext.Provider>
  );
};

export const AllWorkerPrestationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allWorkerPrestation, setAllWorkerPrestation] = useState<Prestation | null>(null);
  return (
    <AllWorkerPrestationContext.Provider value={{ allWorkerPrestation, setAllWorkerPrestation }}>
      {children}
    </AllWorkerPrestationContext.Provider>
  );
};

export const PlannedPrestationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [newPlannedPrestation, setNewPlannedPrestation] = useState<PlannedPrestation | null>(null);
  return (
    <PlannedPrestationContext.Provider value={{ newPlannedPrestation, setNewPlannedPrestation }}>
      {children}
    </PlannedPrestationContext.Provider>
  );
};

// Hooks pour utiliser les contextes
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser doit être utilisé à l’intérieur de UserProvider');
  }
  return context;
};

export const useCurrentWorkerPrestation = () => {
  const context = useContext(CurrentWorkerPrestationContext);
  if (!context) {
    throw new Error('useWorkerPrestation doit être utilisé à l’intérieur de WorkerPrestationProvider');
  }
  return context;
};

export const useAllWorkerPrestation = () => {
  const context = useContext(AllWorkerPrestationContext);
  if (!context) {
    throw new Error('useAllWorkerPrestation doit être utilisé à l’intérieur de AllWorkerPrestationProvider');
  }
  return context;
};

export const usePlannedPrestation = () => {
  const context = useContext(PlannedPrestationContext);
  if (!context) {
    throw new Error('usePlannedPrestation doit être utilisé à l’intérieur de PlannedPrestationProvider');
  }
  return context;
};
