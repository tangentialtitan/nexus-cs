export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type UserRole = 'student' | 'convener' | 'admin'
export type ResourceCategory = 'PYQ' | 'Lecture Notes' | 'Lab Manual' | 'Tutorial' | 'Reference Book' | 'Other'
export type OpportunityType = 'Research Internship' | 'Corporate Internship' | 'Full-Time Placement' | 'Exchange Program'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          roll_number: string | null
          entry_year: number | null
          role: UserRole
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          roll_number?: string | null
          entry_year?: number | null
          role?: UserRole
          avatar_url?: string | null
        }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      courses: {
        Row: {
          id: string
          code: string
          name: string
          semester: number
          credits: number | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          code: string
          name: string
          semester: number
          credits?: number | null
          is_active?: boolean
        }
        Update: Partial<Database['public']['Tables']['courses']['Insert']>
      }
      feedback: {
        Row: {
          id: string
          course_id: string
          rating: number
          stop_feedback: string | null
          start_feedback: string | null
          continue_feedback: string | null
          week_number: number | null
          academic_year: string | null
          created_at: string
        }
        Insert: {
          course_id: string
          rating: number
          stop_feedback?: string | null
          start_feedback?: string | null
          continue_feedback?: string | null
          week_number?: number | null
          academic_year?: string | null
        }
        Update: never
      }
      resources: {
        Row: {
          id: string
          course_id: string
          uploaded_by: string
          category: ResourceCategory
          title: string
          description: string | null
          storage_path: string
          file_type: string
          file_size_kb: number | null
          download_count: number
          is_approved: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          course_id: string
          uploaded_by: string
          category: ResourceCategory
          title: string
          storage_path: string
          file_type: string
          description?: string | null
          file_size_kb?: number | null
        }
        Update: Partial<Database['public']['Tables']['resources']['Insert']>
      }
      opportunities: {
        Row: {
          id: string
          type: OpportunityType
          company_or_uni: string
          role_title: string
          location: string | null
          stipend: string | null
          duration: string | null
          skills_required: string[]
          description: string | null
          application_link: string | null
          contact_name: string | null
          contact_roll: string | null
          contact_email: string | null
          is_active: boolean
          deadline: string | null
          added_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          type: OpportunityType
          company_or_uni: string
          role_title: string
          skills_required?: string[]
          location?: string | null
          stipend?: string | null
          duration?: string | null
          description?: string | null
          application_link?: string | null
          contact_name?: string | null
          contact_roll?: string | null
          contact_email?: string | null
          deadline?: string | null
          added_by?: string | null
        }
        Update: Partial<Database['public']['Tables']['opportunities']['Insert']>
      }
    }
    Views: {
      feedback_summary: {
        Row: {
          course_code: string
          course_name: string
          semester: number
          total_responses: number
          avg_rating: number
          positive_count: number
          negative_count: number
        }
      }
    }
  }
}

export type Profile     = Database['public']['Tables']['profiles']['Row']
export type Course      = Database['public']['Tables']['courses']['Row']
export type Feedback    = Database['public']['Tables']['feedback']['Row']
export type FeedbackInsert = Database['public']['Tables']['feedback']['Insert']
export type Resource    = Database['public']['Tables']['resources']['Row']
export type Opportunity = Database['public']['Tables']['opportunities']['Row']
export type FeedbackSummary = Database['public']['Views']['feedback_summary']['Row']