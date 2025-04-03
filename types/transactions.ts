export interface MyResponse<T> {
  success: boolean;
  data: T;
  pagination: Pagination;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalResults: number;
}

export interface TransactionNode {
  id: string;
  transactionCount: number;
}

export interface TransactionLink {
  source: string;
  target: string;
  value: number;
  type: "transfer" | "interaction" | "contract_call";
  timestamp: string;
  amount?: number;
}

export interface TransactionGroupBy {
  FromAddress: string;
  ToAddress: string;
  TransactionCount: number;
}
