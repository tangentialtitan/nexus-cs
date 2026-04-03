export type Json =
    |string|number|boolean|null|{[key: string]: Json | undefined}|Json[]

    export type Database = {
      // Allows to automatically instantiate createClient with right options
      // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
      __InternalSupabase: {PostgrestVersion: '14.5'}
      public: {Tables: {courses: {Row: {code: string
created_at: string
credits: number|null
id: string
is_active: boolean
name: string
          semester: number
        }
        Insert: {
          code: string
          created_at?: string
          credits?: number|null
          id?: string
          is_active?: boolean
          name: string
          semester: number
        }
        Update: {
          code?: string
          created_at?: string
          credits?: number|null
          id?: string
          is_active?: boolean
          name?: string
          semester?: number
        }
        Relationships: []
      }
      feedback: {
        Row: {
          academic_year: string | null
          continue_feedback: string|null
          course_id: string
          created_at: string
          id: string
          rating: number
          start_feedback: string|null
          stop_feedback: string|null
          week_number: number | null
        }
        Insert: {
          academic_year?: string | null
          continue_feedback?: string|null
          course_id: string
          created_at?: string
          id?: string
          rating: number
          start_feedback?: string|null
          stop_feedback?: string|null
          week_number?: number | null
        }
        Update: {
          academic_year?: string | null
          continue_feedback?: string|null
          course_id?: string
          created_at?: string
          id?: string
          rating?: number
          start_feedback?: string|null
          stop_feedback?: string|null
          week_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'feedback_course_id_fkey'
          columns: ['course_id']
          isOneToOne: false
          referencedRelation: 'courses'
            referencedColumns: ['id']
          },
        ]
      }
      opportunities: {
        Row: {
          added_by: string | null
            application_link: string|null
            company_or_uni: string
            contact_email: string|null
            contact_name: string|null
            contact_roll: string|null
            created_at: string
            deadline: string|null
            description: string|null
            duration: string|null
            id: string
            is_active: boolean
            location: string|null
            role_title: string
            skills_required: string[]
            stipend: string|null
            type: Database['public']['Enums']['opportunity_type']
          updated_at: string
        }
        Insert: {
          added_by?: string | null
          application_link?: string|null
          company_or_uni: string
          contact_email?: string|null
          contact_name?: string|null
          contact_roll?: string|null
          created_at?: string
          deadline?: string|null
          description?: string|null
          duration?: string|null
          id?: string
          is_active?: boolean
          location?: string|null
          role_title: string
          skills_required?: string[]
          stipend?: string|null
          type: Database['public']['Enums']['opportunity_type']
          updated_at?: string
        }
        Update: {
          added_by?: string | null
          application_link?: string|null
          company_or_uni?: string
          contact_email?: string|null
          contact_name?: string|null
          contact_roll?: string|null
          created_at?: string
          deadline?: string|null
          description?: string|null
          duration?: string|null
          id?: string
          is_active?: boolean
          location?: string|null
          role_title?: string
          skills_required?: string[]
          stipend?: string|null
          type?: Database['public']['Enums']['opportunity_type']
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'opportunities_added_by_fkey'
          columns: ['added_by']
          isOneToOne: false
          referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
            created_at: string
            entry_year: number|null
            full_name: string
            id: string
            role: Database['public']['Enums']['user_role']
            roll_number: string|null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          entry_year?: number|null
          full_name: string
          id?: string
          role: Database['public']['Enums']['user_role']
          roll_number?: string|null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          entry_year?: number|null
          full_name?: string
          id?: string
          role?: Database['public']['Enums']['user_role']
          roll_number?: string|null
          updated_at?: string
        }
        Relationships: []
      }
      resources: {
        Row: {
          category: Database['public']['Enums']['resource_category']
          course_id: string
          created_at: string
          description: string|null
          download_count: number
          file_size_kb: number|null
          file_type: string
          id: string
          is_approved: boolean
          storage_path: string
          title: string
          updated_at: string
          uploaded_by: string
        }
        Insert: {
          category: Database['public']['Enums']['resource_category']
          course_id: string
          created_at?: string
          description?: string|null
          download_count?: number
          file_size_kb?: number|null
          file_type: string
          id?: string
          is_approved?: boolean
          storage_path: string
          title: string
          updated_at?: string
          uploaded_by: string
        }
        Update: {
          category?: Database['public']['Enums']['resource_category']
          course_id?: string
          created_at?: string
          description?: string|null
          download_count?: number
          file_size_kb?: number|null
          file_type?: string
          id?: string
          is_approved?: boolean
          storage_path?: string
          title?: string
          updated_at?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: 'resources_course_id_fkey'
          columns: ['course_id']
          isOneToOne: false
          referencedRelation: 'courses'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'resources_uploaded_by_fkey'
            columns: ['uploaded_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      feedback_summary: {
        Row: {
          avg_rating: number | null
            course_code: string|null
            course_name: string|null
            negative_count: number|null
            positive_count: number|null
            semester: number|null
          total_responses: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      opportunity_type:
        | 'Research Internship'
        | 'Corporate Internship'
        | 'Full-Time Placement'
        | 'Exchange Program'
          resource_category:|'PYQ'|'Lecture Notes'|'Lab Manual'|'Tutorial'|
              'Reference Book'|'Other'
      user_role: 'student' | 'convener' | 'admin' | 'committee'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

      export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

      export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

      export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

      export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

      export const Constants = {
        public: {
          Enums: {
            opportunity_type: [
              'Research Internship',
              'Corporate Internship',
              'Full-Time Placement',
              'Exchange Program',
            ],
            resource_category: [
              'PYQ',
              'Lecture Notes',
              'Lab Manual',
              'Tutorial',
              'Reference Book',
              'Other',
            ],
            user_role: ['student', 'convener', 'admin', 'committee'],
          },
        },
      } as const
