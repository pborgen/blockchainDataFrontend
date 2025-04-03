interface TransactionNode {
  id: string;
  group: number;
  value: number;
  balance: number;
  transactionCount: number;
}

interface TransactionLink {
  source: string;
  target: string;
  value: number;
  type: "transfer" | "interaction" | "contract_call";
  timestamp: string;
  amount?: number;
}

interface TransactionGroupBy {
  FromAddress: string;
  ToAddress: string;
  TransactionCount: number;
}
