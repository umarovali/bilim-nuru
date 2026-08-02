import { createContext, useContext, useState, ReactNode } from 'react';

export interface Branch {
  _id: string;
  name: string;
  address: string;
  phone: string;
  workHours?: string;
  iframeSrc: string;
  order?: number;
  isActive?: boolean;
}

interface BranchContextValue {
  branches: Branch[];
  setBranches: (branches: Branch[]) => void;
  activeBranchId: string | null;
  setActiveBranchId: (id: string) => void;
  activeBranch: Branch | null;
}

const BranchContext = createContext<BranchContextValue | undefined>(undefined);

export function BranchProvider({ children }: { children: ReactNode }) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [activeBranchId, setActiveBranchId] = useState<string | null>(null);

  const activeBranch = branches.find((b) => b._id === activeBranchId) || branches[0] || null;

  return (
    <BranchContext.Provider
      value={{ branches, setBranches, activeBranchId, setActiveBranchId, activeBranch }}
    >
      {children}
    </BranchContext.Provider>
  );
}

export function useBranches() {
  const context = useContext(BranchContext);
  if (!context) throw new Error('useBranches must be used within BranchProvider');
  return context;
}
