import { Injectable } from '@angular/core';
import { SupabaseService } from '../supabase.service';
import { Event, EventForm } from '../models/event.interface';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(private supabase: SupabaseService) {}

  async createEvent(eventData: EventForm, userId: string, status: 'draft' | 'active'): Promise<Event | null> {
    try {
      const event = {
        ...eventData,
        created_by: userId,
        status: status,
        guests: [],
        votes: {
          location: {},
          date: {},
          activities: {}
        }
      };

      const { data, error } = await this.supabase.client
        .from('events')
        .insert([event])
        .select()
        .single();

      if (error) {
        console.error('Error creating event:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error creating event:', error);
      return null;
    }
  }

  async getEventsByUser(userId: string): Promise<Event[]> {
    try {
      const { data, error } = await this.supabase.client
        .from('events')
        .select('*')
        .eq('created_by', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching events:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  }

  async getEventById(eventId: string): Promise<Event | null> {
    try {
      const { data, error } = await this.supabase.client
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (error) {
        console.error('Error fetching event:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching event:', error);
      return null;
    }
  }

  async updateEvent(eventId: string, updates: Partial<Event>): Promise<Event | null> {
    try {
      const { data, error } = await this.supabase.client
        .from('events')
        .update(updates)
        .eq('id', eventId)
        .select()
        .single();

      if (error) {
        console.error('Error updating event:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error updating event:', error);
      return null;
    }
  }

  async deleteEvent(eventId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase.client
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) {
        console.error('Error deleting event:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      return false;
    }
  }
} 