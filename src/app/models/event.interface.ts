export interface Event {
  id?: string;
  created_by?: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  max_guests?: number | null;
  activities?: string[];
  status?: 'active' | 'draft';
  created_at?: string;
  updated_at?: string;
}

export interface EventForm {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  max_guests?: number | null;
  activities?: string[];
} 