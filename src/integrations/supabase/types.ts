export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          entity_id: string | null
          id: string
          resource_id: string | null
          resource_type: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          id?: string
          resource_id?: string | null
          resource_type: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          id?: string
          resource_id?: string | null
          resource_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_payment_methods: {
        Row: {
          campaign_id: string
          created_at: string | null
          display_order: number | null
          enabled: boolean | null
          fee_amount: number | null
          fee_type: Database["public"]["Enums"]["fee_type"] | null
          id: string
          type: Database["public"]["Enums"]["payment_method_type"]
        }
        Insert: {
          campaign_id: string
          created_at?: string | null
          display_order?: number | null
          enabled?: boolean | null
          fee_amount?: number | null
          fee_type?: Database["public"]["Enums"]["fee_type"] | null
          id?: string
          type: Database["public"]["Enums"]["payment_method_type"]
        }
        Update: {
          campaign_id?: string
          created_at?: string | null
          display_order?: number | null
          enabled?: boolean | null
          fee_amount?: number | null
          fee_type?: Database["public"]["Enums"]["fee_type"] | null
          id?: string
          type?: Database["public"]["Enums"]["payment_method_type"]
        }
        Relationships: [
          {
            foreignKeyName: "campaign_payment_methods_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_stats: {
        Row: {
          campaign_id: string
          completion_rate: number | null
          email_open_rate: number | null
          emails_opened: number | null
          emails_sent: number | null
          funds_originated: number | null
          funds_selected: number | null
          funds_settled: number | null
          link_click_rate: number | null
          links_clicked: number | null
          originated_amount: number | null
          settled_amount: number | null
          total_amount: number | null
          total_consumers: number | null
          updated_at: string | null
        }
        Insert: {
          campaign_id: string
          completion_rate?: number | null
          email_open_rate?: number | null
          emails_opened?: number | null
          emails_sent?: number | null
          funds_originated?: number | null
          funds_selected?: number | null
          funds_settled?: number | null
          link_click_rate?: number | null
          links_clicked?: number | null
          originated_amount?: number | null
          settled_amount?: number | null
          total_amount?: number | null
          total_consumers?: number | null
          updated_at?: string | null
        }
        Update: {
          campaign_id?: string
          completion_rate?: number | null
          email_open_rate?: number | null
          emails_opened?: number | null
          emails_sent?: number | null
          funds_originated?: number | null
          funds_selected?: number | null
          funds_settled?: number | null
          link_click_rate?: number | null
          links_clicked?: number | null
          originated_amount?: number | null
          settled_amount?: number | null
          total_amount?: number | null
          total_consumers?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_stats_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: true
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          advertisement_enabled: boolean | null
          advertisement_image: string | null
          advertisement_url: string | null
          bank_logo: string
          created_at: string | null
          description: string | null
          entity_id: string
          id: string
          name: string
          sent_at: string | null
          status: Database["public"]["Enums"]["campaign_status"] | null
          total_emails_opened: number | null
          total_emails_sent: number | null
          total_funds_originated: number | null
          total_funds_selected: number | null
          total_funds_settled: number | null
          total_links_clicked: number | null
          updated_at: string | null
        }
        Insert: {
          advertisement_enabled?: boolean | null
          advertisement_image?: string | null
          advertisement_url?: string | null
          bank_logo: string
          created_at?: string | null
          description?: string | null
          entity_id: string
          id?: string
          name: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["campaign_status"] | null
          total_emails_opened?: number | null
          total_emails_sent?: number | null
          total_funds_originated?: number | null
          total_funds_selected?: number | null
          total_funds_settled?: number | null
          total_links_clicked?: number | null
          updated_at?: string | null
        }
        Update: {
          advertisement_enabled?: boolean | null
          advertisement_image?: string | null
          advertisement_url?: string | null
          bank_logo?: string
          created_at?: string | null
          description?: string | null
          entity_id?: string
          id?: string
          name?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["campaign_status"] | null
          total_emails_opened?: number | null
          total_emails_sent?: number | null
          total_funds_originated?: number | null
          total_funds_selected?: number | null
          total_funds_settled?: number | null
          total_links_clicked?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      consumer_tokens: {
        Row: {
          campaign_id: string
          consumer_id: string
          created_at: string | null
          expires_at: string | null
          id: string
          token: string
          used: boolean | null
          used_at: string | null
        }
        Insert: {
          campaign_id: string
          consumer_id: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          token: string
          used?: boolean | null
          used_at?: string | null
        }
        Update: {
          campaign_id?: string
          consumer_id?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          token?: string
          used?: boolean | null
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consumer_tokens_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consumer_tokens_consumer_id_fkey"
            columns: ["consumer_id"]
            isOneToOne: false
            referencedRelation: "consumers"
            referencedColumns: ["id"]
          },
        ]
      }
      consumer_tracking: {
        Row: {
          campaign_id: string
          consumer_id: string
          created_at: string | null
          email_opened: boolean | null
          email_opened_at: string | null
          email_sent: boolean | null
          email_sent_at: string | null
          funds_originated: boolean | null
          funds_originated_at: string | null
          funds_settled: boolean | null
          funds_settled_at: string | null
          id: string
          last_activity: string | null
          link_clicked: boolean | null
          link_clicked_at: string | null
          payment_method_selected:
            | Database["public"]["Enums"]["payment_method_type"]
            | null
          payment_method_selected_at: string | null
          status: Database["public"]["Enums"]["tracking_status"] | null
        }
        Insert: {
          campaign_id: string
          consumer_id: string
          created_at?: string | null
          email_opened?: boolean | null
          email_opened_at?: string | null
          email_sent?: boolean | null
          email_sent_at?: string | null
          funds_originated?: boolean | null
          funds_originated_at?: string | null
          funds_settled?: boolean | null
          funds_settled_at?: string | null
          id?: string
          last_activity?: string | null
          link_clicked?: boolean | null
          link_clicked_at?: string | null
          payment_method_selected?:
            | Database["public"]["Enums"]["payment_method_type"]
            | null
          payment_method_selected_at?: string | null
          status?: Database["public"]["Enums"]["tracking_status"] | null
        }
        Update: {
          campaign_id?: string
          consumer_id?: string
          created_at?: string | null
          email_opened?: boolean | null
          email_opened_at?: string | null
          email_sent?: boolean | null
          email_sent_at?: string | null
          funds_originated?: boolean | null
          funds_originated_at?: string | null
          funds_settled?: boolean | null
          funds_settled_at?: string | null
          id?: string
          last_activity?: string | null
          link_clicked?: boolean | null
          link_clicked_at?: string | null
          payment_method_selected?:
            | Database["public"]["Enums"]["payment_method_type"]
            | null
          payment_method_selected_at?: string | null
          status?: Database["public"]["Enums"]["tracking_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "consumer_tracking_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consumer_tracking_consumer_id_fkey"
            columns: ["consumer_id"]
            isOneToOne: false
            referencedRelation: "consumers"
            referencedColumns: ["id"]
          },
        ]
      }
      consumers: {
        Row: {
          amount: number
          campaign_id: string
          created_at: string | null
          email: string
          id: string
          name: string
        }
        Insert: {
          amount: number
          campaign_id: string
          created_at?: string | null
          email: string
          id?: string
          name: string
        }
        Update: {
          amount?: number
          campaign_id?: string
          created_at?: string | null
          email?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "consumers_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      entities: {
        Row: {
          brand_color: string | null
          created_at: string | null
          id: string
          logo: string
          name: string
          parent_entity_id: string | null
          type: Database["public"]["Enums"]["entity_type"]
          updated_at: string | null
        }
        Insert: {
          brand_color?: string | null
          created_at?: string | null
          id?: string
          logo: string
          name: string
          parent_entity_id?: string | null
          type: Database["public"]["Enums"]["entity_type"]
          updated_at?: string | null
        }
        Update: {
          brand_color?: string | null
          created_at?: string | null
          id?: string
          logo?: string
          name?: string
          parent_entity_id?: string | null
          type?: Database["public"]["Enums"]["entity_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "entities_parent_entity_id_fkey"
            columns: ["parent_entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          category: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          category: string
          description?: string | null
          id: string
          name: string
        }
        Update: {
          category?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          entity_id: string
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          entity_id: string
          id: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          entity_id?: string
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string | null
          id: string
          permission_id: string
          role_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          permission_id: string
          role_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          entity_id: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          entity_id: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          entity_id?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "roles_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_consumer_token: {
        Args: { _campaign_id: string; _consumer_id: string }
        Returns: string
      }
      generate_mock_tracking_data: {
        Args: { _campaign_id: string }
        Returns: undefined
      }
      get_user_entity_and_descendants: {
        Args: { _user_id: string }
        Returns: {
          entity_id: string
        }[]
      }
      has_permission: {
        Args: { _permission: string; _user_id: string }
        Returns: boolean
      }
      update_campaign_stats: {
        Args: { _campaign_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "distributor_admin" | "customer_admin" | "customer_user"
      campaign_status: "draft" | "sent" | "active" | "completed" | "cancelled"
      entity_type: "root" | "distributor" | "customer"
      fee_type: "dollar" | "percentage"
      payment_method_type:
        | "ach"
        | "check"
        | "prepaid"
        | "realtime"
        | "paypal"
        | "venmo"
        | "zelle"
        | "crypto"
        | "international"
      tracking_status:
        | "pending"
        | "email_sent"
        | "email_opened"
        | "link_clicked"
        | "payment_selected"
        | "funds_originated"
        | "funds_settled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["distributor_admin", "customer_admin", "customer_user"],
      campaign_status: ["draft", "sent", "active", "completed", "cancelled"],
      entity_type: ["root", "distributor", "customer"],
      fee_type: ["dollar", "percentage"],
      payment_method_type: [
        "ach",
        "check",
        "prepaid",
        "realtime",
        "paypal",
        "venmo",
        "zelle",
        "crypto",
        "international",
      ],
      tracking_status: [
        "pending",
        "email_sent",
        "email_opened",
        "link_clicked",
        "payment_selected",
        "funds_originated",
        "funds_settled",
      ],
    },
  },
} as const
