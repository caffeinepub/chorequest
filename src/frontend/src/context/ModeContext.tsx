import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

type UIMode = 'kids' | 'adults';

interface ModeContextType {
  mode: UIMode;
  setMode: (mode: UIMode) => void;
  isKidsMode: boolean;
  isAdultsMode: boolean;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({ children }: { children: ReactNode }) {
  const { identity } = useInternetIdentity();
  const [mode, setModeState] = useState<UIMode>('kids');

  const storageKey = identity ? `chorequest:mode:${identity.getPrincipal().toString()}` : 'chorequest:mode:default';

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved === 'kids' || saved === 'adults') {
      setModeState(saved);
    }
  }, [storageKey]);

  const setMode = (newMode: UIMode) => {
    setModeState(newMode);
    localStorage.setItem(storageKey, newMode);
  };

  return (
    <ModeContext.Provider
      value={{
        mode,
        setMode,
        isKidsMode: mode === 'kids',
        isAdultsMode: mode === 'adults',
      }}
    >
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error('useMode must be used within ModeProvider');
  }
  return context;
}
