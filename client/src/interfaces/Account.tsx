export interface Account {
  name: string;
  balances: {
    available: number;
    current: number;
  };
  subtype: string;
  type: string;
}
