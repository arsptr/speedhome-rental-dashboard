export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type SearchType = 'url' | 'area';

export type SearchStatus = 'pending' | 'scraping' | 'completed' | 'failed';

export type Database = {
  public: {
    Tables: {
      search_sessions: {
        Row: {
          id: string;
          search_type: SearchType;
          search_query: string;
          status: SearchStatus;
          error_message: string | null;
          listing_count: number;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          search_type: SearchType;
          search_query: string;
          status?: SearchStatus;
          error_message?: string | null;
          listing_count?: number;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          search_type?: SearchType;
          search_query?: string;
          status?: SearchStatus;
          error_message?: string | null;
          listing_count?: number;
          created_at?: string;
          completed_at?: string | null;
        };
        Relationships: [];
      };
      property_listings: {
        Row: {
          id: string;
          session_id: string;
          listing_url: string;
          title: string;
          property_name: string;
          area: string;
          monthly_price: number | null;
          annual_price: number | null;
          bedrooms: string;
          furniture_status: string;
          property_size_sqft: number | null;
          property_type: string;
          scraped_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          listing_url: string;
          title?: string;
          property_name?: string;
          area?: string;
          monthly_price?: number | null;
          annual_price?: number | null;
          bedrooms?: string;
          furniture_status?: string;
          property_size_sqft?: number | null;
          property_type?: string;
          scraped_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          listing_url?: string;
          title?: string;
          property_name?: string;
          area?: string;
          monthly_price?: number | null;
          annual_price?: number | null;
          bedrooms?: string;
          furniture_status?: string;
          property_size_sqft?: number | null;
          property_type?: string;
          scraped_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'property_listings_session_id_fkey';
            columns: ['session_id'];
            isOneToOne: false;
            referencedRelation: 'search_sessions';
            referencedColumns: ['id'];
          },
        ];
      };
      search_statistics: {
        Row: {
          id: string;
          session_id: string;
          property_type: string;
          listing_count: number;
          average_price: number | null;
          median_price: number | null;
          mode_price: number | null;
          fair_price: number | null;
          average_size_sqft: number | null;
          calculated_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          property_type?: string;
          listing_count?: number;
          average_price?: number | null;
          median_price?: number | null;
          mode_price?: number | null;
          fair_price?: number | null;
          average_size_sqft?: number | null;
          calculated_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          property_type?: string;
          listing_count?: number;
          average_price?: number | null;
          median_price?: number | null;
          mode_price?: number | null;
          fair_price?: number | null;
          average_size_sqft?: number | null;
          calculated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'search_statistics_session_id_fkey';
            columns: ['session_id'];
            isOneToOne: false;
            referencedRelation: 'search_sessions';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
