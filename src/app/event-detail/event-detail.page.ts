import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../services/event.service';
import { Event as AppEvent } from '../models/event.interface';
import { SupabaseService } from '../supabase.service';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class EventDetailPage implements OnInit {
  event: AppEvent | null = null;
  isLoading = true;
  isOwner = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private alertController: AlertController,
    private toastController: ToastController,
    private supabase: SupabaseService
  ) { }

  ngOnInit() {
    this.loadEventDetails();
  }

  async loadEventDetails() {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (!eventId) {
      this.isLoading = false;
      this.router.navigateByUrl('/home');
      return;
    }

    try {
      this.event = await this.eventService.getEventById(eventId);
      this.checkOwnership();
    } catch (error) {
      console.error('Error loading event details:', error);
      await this.showToast('Error al cargar el evento', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  async checkOwnership() {
    if (!this.event) {
      this.isOwner = false;
      return;
    }
    const { data: { user } } = await this.supabase.client.auth.getUser();
    this.isOwner = user?.id === this.event.created_by;
  }

  editEvent() {
    if (this.event?.id) {
      this.router.navigate(['/edit-event', this.event.id]);
    }
  }

  async confirmDelete() {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          cssClass: 'alert-button-danger',
          handler: () => this.deleteEvent(),
        },
      ],
    });
    await alert.present();
  }

  async deleteEvent() {
    if (!this.event?.id) return;
    this.isLoading = true;
    try {
      const success = await this.eventService.deleteEvent(this.event.id);
      if (success) {
        await this.showToast('Evento eliminado exitosamente', 'success');
        this.router.navigateByUrl('/home');
      } else {
        await this.showToast('Error al eliminar el evento', 'danger');
      }
    } catch (error) {
      await this.showToast('Error al eliminar el evento', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top',
    });
    await toast.present();
  }
}
