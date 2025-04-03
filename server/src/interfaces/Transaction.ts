interface PersonalFinanceCategory {
  confidence_level?: string | null | undefined;
  detailed?: string;
  primary: string;
}

export interface ITransaction {
  account_id: string;
  amount: number;
  personal_finance_category?: PersonalFinanceCategory | null | undefined;
  category_id: string | null;
  date: string;
  name: string;
  merchant_name?: string | null;
  transaction_id: string;
  website?: string | null;
  personal_finance_category_icon_url?: string;
  authorized_datetime?: string | null;
}
