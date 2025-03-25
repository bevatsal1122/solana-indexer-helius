export type IndexingType =
  | "nft_bids"
  | "nft_prices"
  | "token_prices"
  | "token_borrowing";

export interface AuthResponse {
  success: boolean;
  error?: string;
  data?: any;
}

export interface IndexingJob {
  id: string;
  user_id: string;
  status: "pending" | "running" | "completed" | "failed";
  indexing_type: IndexingType;
  created_at: string;
  updated_at: string;
}

export interface DatabaseCredentials {
  dbHost: string;
  dbPort: string;
  dbName: string;
  dbUser: string;
  dbPassword: string;
}
