import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { TravelRecord, User } from '../types/travel';
import { generateMockRecords } from '../utils/analytics';

interface AppContextType {
  user: User | null;
  setUser: (u: User | null) => void;
  records: TravelRecord[];
  setRecords: (r: TravelRecord[]) => void;
  isDemo: boolean;
  setIsDemo: (v: boolean) => void;
  fileName: string;
  setFileName: (n: string) => void;
  welcomePopupDismissed: boolean;
  dismissWelcomePopup: () => void;
  tmcClientId: string | null;
  setTmcClientId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const DEMO_USER: User = {
  id: 'demo-1',
  name: 'Sarah Chen',
  email: 'sarah@acmecorp.com',
  role: 'Travel Manager',
  org: 'Acme Corporation',
  type: 'company',
  lastLogin: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [records, setRecords] = useState<TravelRecord[]>(generateMockRecords());
  const [isDemo, setIsDemo] = useState(false);
  const [fileName, setFileName] = useState('Sample Data (150 trips)');
  const [welcomePopupDismissed, setWelcomePopupDismissed] = useState(false);
  const [tmcClientId, setTmcClientId] = useState<string | null>(null);

  const dismissWelcomePopup = useCallback(() => setWelcomePopupDismissed(true), []);

  return (
    <AppContext.Provider value={{
      user, setUser, records, setRecords,
      isDemo, setIsDemo, fileName, setFileName,
      welcomePopupDismissed, dismissWelcomePopup,
      tmcClientId, setTmcClientId,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}

export { DEMO_USER };