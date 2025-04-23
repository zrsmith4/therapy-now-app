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
      conversations: {
        Row: {
          created_at: string | null
          id: string
          patient_id: string
          therapist_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          patient_id: string
          therapist_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          patient_id?: string
          therapist_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          read_at: string | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          read_at?: string | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          read_at?: string | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      patient_consents: {
        Row: {
          consent_date: string
          created_at: string | null
          financial_policy: boolean
          hipaa_consent: boolean
          id: string
          no_show_policy: boolean
          treatment_consent: boolean
          user_id: string
        }
        Insert: {
          consent_date?: string
          created_at?: string | null
          financial_policy?: boolean
          hipaa_consent?: boolean
          id?: string
          no_show_policy?: boolean
          treatment_consent?: boolean
          user_id: string
        }
        Update: {
          consent_date?: string
          created_at?: string | null
          financial_policy?: boolean
          hipaa_consent?: boolean
          id?: string
          no_show_policy?: boolean
          treatment_consent?: boolean
          user_id?: string
        }
        Relationships: []
      }
      patient_medical_history: {
        Row: {
          created_at: string | null
          current_medications: string | null
          id: string
          injury_location: string
          pain_level: string
          physician_contact: string | null
          physician_name: string | null
          physician_referral: boolean
          previous_treatment: string | null
          primary_concern: string
          surgical_history: string | null
          treatment_goal: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_medications?: string | null
          id?: string
          injury_location: string
          pain_level: string
          physician_contact?: string | null
          physician_name?: string | null
          physician_referral?: boolean
          previous_treatment?: string | null
          primary_concern: string
          surgical_history?: string | null
          treatment_goal: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_medications?: string | null
          id?: string
          injury_location?: string
          pain_level?: string
          physician_contact?: string | null
          physician_name?: string | null
          physician_referral?: boolean
          previous_treatment?: string | null
          primary_concern?: string
          surgical_history?: string | null
          treatment_goal?: string
          user_id?: string
        }
        Relationships: []
      }
      patients: {
        Row: {
          address: string
          city: string
          created_at: string | null
          date_of_birth: string
          first_name: string
          id: string
          last_name: string
          phone: string
          state: string
          travel_distance: number | null
          user_id: string
          zip_code: string
        }
        Insert: {
          address: string
          city: string
          created_at?: string | null
          date_of_birth: string
          first_name: string
          id?: string
          last_name: string
          phone: string
          state: string
          travel_distance?: number | null
          user_id: string
          zip_code: string
        }
        Update: {
          address?: string
          city?: string
          created_at?: string | null
          date_of_birth?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string
          state?: string
          travel_distance?: number | null
          user_id?: string
          zip_code?: string
        }
        Relationships: []
      }
      therapist_payment_info: {
        Row: {
          account_holder_name: string
          account_number: string
          account_type: string
          bank_name: string
          created_at: string | null
          id: string
          routing_number: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_holder_name: string
          account_number: string
          account_type: string
          bank_name: string
          created_at?: string | null
          id?: string
          routing_number: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_holder_name?: string
          account_number?: string
          account_type?: string
          bank_name?: string
          created_at?: string | null
          id?: string
          routing_number?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      therapist_schedules: {
        Row: {
          created_at: string | null
          date: string
          id: string
          time_slots: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          time_slots: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          time_slots?: Json
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      therapists: {
        Row: {
          address: string
          agreement_date: string
          bio: string
          certifications: string | null
          city: string
          created_at: string | null
          education: string
          equipment_verification: boolean
          first_name: string
          has_mobile_equipment: boolean | null
          has_needling_certification: boolean | null
          id: string
          insurance_verification: boolean
          last_name: string
          license_number: string
          license_state: string
          licensing_agreed: boolean
          phone: string
          revenue_sharing_agreed: boolean
          service_options: string[]
          specialties: string[]
          state: string
          travel_distance: number | null
          user_id: string
          years_of_experience: string
          zip_code: string
        }
        Insert: {
          address: string
          agreement_date: string
          bio: string
          certifications?: string | null
          city: string
          created_at?: string | null
          education: string
          equipment_verification: boolean
          first_name: string
          has_mobile_equipment?: boolean | null
          has_needling_certification?: boolean | null
          id?: string
          insurance_verification: boolean
          last_name: string
          license_number: string
          license_state: string
          licensing_agreed: boolean
          phone: string
          revenue_sharing_agreed: boolean
          service_options: string[]
          specialties: string[]
          state: string
          travel_distance?: number | null
          user_id: string
          years_of_experience: string
          zip_code: string
        }
        Update: {
          address?: string
          agreement_date?: string
          bio?: string
          certifications?: string | null
          city?: string
          created_at?: string | null
          education?: string
          equipment_verification?: boolean
          first_name?: string
          has_mobile_equipment?: boolean | null
          has_needling_certification?: boolean | null
          id?: string
          insurance_verification?: boolean
          last_name?: string
          license_number?: string
          license_state?: string
          licensing_agreed?: boolean
          phone?: string
          revenue_sharing_agreed?: boolean
          service_options?: string[]
          specialties?: string[]
          state?: string
          travel_distance?: number | null
          user_id?: string
          years_of_experience?: string
          zip_code?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_message_therapist: {
        Args: { p_patient_id: string; p_therapist_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
