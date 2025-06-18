// src/app/supabase.service.ts
import { Injectable } from '@angular/core'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wbqcndgfufwenjfaskkg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndicWNuZGdmdWZ3ZW5qZmFza2tnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxMTMwMjMsImV4cCI6MjA2NTY4OTAyM30.r9xItaNXSiaX1bwmBXSMjff03KJO-D-AqYnmHikxHzg'

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient

  constructor() {
    this.supabase = createClient(supabaseUrl, supabaseAnonKey)
  }

  get client() {
    return this.supabase
  }
}
