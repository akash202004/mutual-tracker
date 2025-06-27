export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
}

export interface MutualFund {
  schemeCode: string;
  schemeName: string;
  nav: string;
  date: string;
  fund_house?: string;
  scheme_type?: string;
  scheme_category?: string;
  scheme_start_date?: string;
}

export interface MutualFundDetail extends MutualFund {
  data: Array<{
    date: string;
    nav: string;
  }>;
  meta: {
    scheme_type: string;
    scheme_category: string;
    scheme_code: string;
    scheme_name: string;
    fund_house: string;
    scheme_start_date: {
      date: string;
    };
  };
}

export interface SavedFund {
  schemeCode: string;
  schemeName: string;
  savedAt: string;
  currentNav?: string;
}

export interface AUthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}