export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      indexer_jobs: {
        Row: {
          created_at: string
          db_host: string
          db_name: string
          db_password: string
          db_port: string
          db_user: string
          description: string | null
          id: number
          last_updated: string | null
          name: string
          status: string
          type: string | null
        }
        Insert: {
          created_at?: string
          db_host: string
          db_name: string
          db_password: string
          db_port: string
          db_user: string
          description?: string | null
          id?: number
          last_updated?: string | null
          name: string
          status?: string
          type?: string | null
        }
        Update: {
          created_at?: string
          db_host?: string
          db_name?: string
          db_password?: string
          db_port?: string
          db_user?: string
          description?: string | null
          id?: number
          last_updated?: string | null
          name?: string
          status?: string
          type?: string | null
        }
        Relationships: []
      }
      indexing_jobs: {
        Row: {
          created_at: string | null
          id: string
          indexing_type: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          indexing_type: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          indexing_type?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      nft_bids: {
        Row: {
          bid_amount: number
          bidder: string
          created_at: string | null
          id: string
          job_id: string
          mint_address: string
        }
        Insert: {
          bid_amount: number
          bidder: string
          created_at?: string | null
          id?: string
          job_id: string
          mint_address: string
        }
        Update: {
          bid_amount?: number
          bidder?: string
          created_at?: string | null
          id?: string
          job_id?: string
          mint_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "nft_bids_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "indexing_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      nft_prices: {
        Row: {
          created_at: string | null
          id: string
          job_id: string
          marketplace: string
          mint_address: string
          price: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          job_id: string
          marketplace: string
          mint_address: string
          price: number
        }
        Update: {
          created_at?: string | null
          id?: string
          job_id?: string
          marketplace?: string
          mint_address?: string
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "nft_prices_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "indexing_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      token_borrowing: {
        Row: {
          amount_available: number
          created_at: string | null
          id: string
          interest_rate: number
          job_id: string
          platform: string
          token_address: string
        }
        Insert: {
          amount_available: number
          created_at?: string | null
          id?: string
          interest_rate: number
          job_id: string
          platform: string
          token_address: string
        }
        Update: {
          amount_available?: number
          created_at?: string | null
          id?: string
          interest_rate?: number
          job_id?: string
          platform?: string
          token_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "token_borrowing_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "indexing_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      token_prices: {
        Row: {
          created_at: string | null
          id: string
          job_id: string
          platform: string
          price_usd: number
          token_address: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          job_id: string
          platform: string
          price_usd: number
          token_address: string
        }
        Update: {
          created_at?: string | null
          id?: string
          job_id?: string
          platform?: string
          price_usd?: number
          token_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "token_prices_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "indexing_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          auth_id: string
          created_at: string
          id: number
          updated_at: string
        }
        Insert: {
          auth_id: string
          created_at?: string
          id?: number
          updated_at?: string
        }
        Update: {
          auth_id?: string
          created_at?: string
          id?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
