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
      authorized_officers: {
        Row: { created_at: string; email: string; role: string }
        Insert: { created_at?: string; email: string; role: string }
        Update: { created_at?: string; email?: string; role?: string }
        Relationships: []
      }
      recruits: {
        Row: {
          accessory: string | null
          battle_cry: string
          body: string
          color: string
          commander_title: string | null
          created_at: string
          creator_name: string
          division: string
          effect: string | null
          eyes: string
          favorite_by_kenzie: boolean
          hat: string | null
          id: string
          is_visible: boolean
          medal: string | null
          message: string
          mouth: string
          pickle_name: string
          updated_at: string
          viewed_by_kenzie: boolean
        }
        Insert: {
          accessory?: string | null
          battle_cry: string
          body: string
          color: string
          commander_title?: string | null
          created_at?: string
          creator_name: string
          division: string
          effect?: string | null
          eyes: string
          favorite_by_kenzie?: boolean
          hat?: string | null
          id?: string
          is_visible?: boolean
          medal?: string | null
          message: string
          mouth: string
          pickle_name: string
          updated_at?: string
          viewed_by_kenzie?: boolean
        }
        Update: {
          accessory?: string | null
          battle_cry?: string
          body?: string
          color?: string
          commander_title?: string | null
          created_at?: string
          creator_name?: string
          division?: string
          effect?: string | null
          eyes?: string
          favorite_by_kenzie?: boolean
          hat?: string | null
          id?: string
          is_visible?: boolean
          medal?: string | null
          message?: string
          mouth?: string
          pickle_name?: string
          updated_at?: string
          viewed_by_kenzie?: boolean
        }
        Relationships: []
      }
      site_state: {
        Row: {
          birthday_mode: boolean
          commander_has_arrived: boolean
          id: number
          parade_triggered: boolean
          updated_at: string
        }
        Insert: {
          birthday_mode?: boolean
          commander_has_arrived?: boolean
          id?: number
          parade_triggered?: boolean
          updated_at?: string
        }
        Update: {
          birthday_mode?: boolean
          commander_has_arrived?: boolean
          id?: number
          parade_triggered?: boolean
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: {
      my_officer_role: {
        Args: Record<PropertyKey, never>
        Returns: string | null
      }
    }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
