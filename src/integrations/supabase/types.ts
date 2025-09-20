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
      doctors: {
        Row: {
          created_at: string
          doctor_id: string
          email: string | null
          id: string
          license_number: string | null
          name: string
          phone: string | null
          specialization: string | null
        }
        Insert: {
          created_at?: string
          doctor_id: string
          email?: string | null
          id?: string
          license_number?: string | null
          name: string
          phone?: string | null
          specialization?: string | null
        }
        Update: {
          created_at?: string
          doctor_id?: string
          email?: string | null
          id?: string
          license_number?: string | null
          name?: string
          phone?: string | null
          specialization?: string | null
        }
        Relationships: []
      }
      medical_cases: {
        Row: {
          ai_recommendation: string | null
          assessment_status: Database["public"]["Enums"]["case_status"]
          blood_pressure_diastolic: number | null
          blood_pressure_systolic: number | null
          blood_sugar: number | null
          created_at: string
          doctor_id: string | null
          doctor_notes: string | null
          id: string
          operator_id: string
          oxygen_saturation: number | null
          patient_id: string
          prescribed_medicines: string[] | null
          prescription: string | null
          severity_score: number | null
          sms_sent: boolean | null
          status: Database["public"]["Enums"]["case_status"]
          symptoms: string[] | null
          temperature: number | null
          updated_at: string
          video_transcript: string | null
          video_url: string | null
        }
        Insert: {
          ai_recommendation?: string | null
          assessment_status?: Database["public"]["Enums"]["case_status"]
          blood_pressure_diastolic?: number | null
          blood_pressure_systolic?: number | null
          blood_sugar?: number | null
          created_at?: string
          doctor_id?: string | null
          doctor_notes?: string | null
          id?: string
          operator_id: string
          oxygen_saturation?: number | null
          patient_id: string
          prescribed_medicines?: string[] | null
          prescription?: string | null
          severity_score?: number | null
          sms_sent?: boolean | null
          status?: Database["public"]["Enums"]["case_status"]
          symptoms?: string[] | null
          temperature?: number | null
          updated_at?: string
          video_transcript?: string | null
          video_url?: string | null
        }
        Update: {
          ai_recommendation?: string | null
          assessment_status?: Database["public"]["Enums"]["case_status"]
          blood_pressure_diastolic?: number | null
          blood_pressure_systolic?: number | null
          blood_sugar?: number | null
          created_at?: string
          doctor_id?: string | null
          doctor_notes?: string | null
          id?: string
          operator_id?: string
          oxygen_saturation?: number | null
          patient_id?: string
          prescribed_medicines?: string[] | null
          prescription?: string | null
          severity_score?: number | null
          sms_sent?: boolean | null
          status?: Database["public"]["Enums"]["case_status"]
          symptoms?: string[] | null
          temperature?: number | null
          updated_at?: string
          video_transcript?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_cases_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_cases_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "operators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_cases_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      operators: {
        Row: {
          created_at: string
          id: string
          location: string | null
          name: string
          operator_id: string
          phone: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          location?: string | null
          name: string
          operator_id: string
          phone?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          location?: string | null
          name?: string
          operator_id?: string
          phone?: string | null
        }
        Relationships: []
      }
      patients: {
        Row: {
          address: string
          age: number
          created_at: string
          gender: string
          id: string
          name: string
          operator_id: string
          phone: string
          updated_at: string
        }
        Insert: {
          address: string
          age: number
          created_at?: string
          gender: string
          id?: string
          name: string
          operator_id: string
          phone: string
          updated_at?: string
        }
        Update: {
          address?: string
          age?: number
          created_at?: string
          gender?: string
          id?: string
          name?: string
          operator_id?: string
          phone?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patients_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "operators"
            referencedColumns: ["id"]
          },
        ]
      }
      user_auth: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          last_login: string | null
          password_hash: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          password_hash: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          password_hash?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
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
      case_status:
        | "pending"
        | "simple"
        | "moderate"
        | "high"
        | "prescribed"
        | "completed"
      user_role: "operator" | "doctor" | "admin"
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
      case_status: [
        "pending",
        "simple",
        "moderate",
        "high",
        "prescribed",
        "completed",
      ],
      user_role: ["operator", "doctor", "admin"],
    },
  },
} as const
