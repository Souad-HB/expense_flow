export interface ITransaction {
  account_id: string;
  amount: number;
  category?: string[] | null; // array of strings
  category_id: string | null;
  date: string;
  name: string;
  merchant_name?: string | null;
  transaction_id: string;
  website?: string | null;
  personal_finance_category_icon_url?: string;
  authorized_datetime?: string | null;
}
