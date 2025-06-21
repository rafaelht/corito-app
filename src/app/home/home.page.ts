import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController, PopoverController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../supabase.service';
import { EventService } from '../services/event.service';
import { Event as AppEvent } from '../models/event.interface';
import { ProfilePopoverComponent } from '../profile-popover/profile-popover.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink, ProfilePopoverComponent],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  userEmail: string = '';
  userId: string = '';
  events: AppEvent[] = [];
  isLoading: boolean = true;

  constructor(
    private supabase: SupabaseService,
    private router: Router,
    private alertController: AlertController,
    private popoverController: PopoverController,
    private eventService: EventService
  ) {}

  ngOnInit() {
    // No uses async en ngOnInit directamente
  }

  async ionViewWillEnter() {
    this.isLoading = true;
    const { data: { user } } = await this.supabase.client.auth.getUser();

    if (user) {
      this.userEmail = user.email || '';
      this.userId = user.id;
      this.loadUserEvents();
    } else {
      this.isLoading = false;
      this.router.navigateByUrl('/auth');
    }
  }

  async loadUserEvents() {
    try {
      this.events = await this.eventService.getEventsByUser(this.userId);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      this.isLoading = false;
    }
  }

  createNewEvent() {
    this.router.navigateByUrl('/create-event');
  }

  async openPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: ProfilePopoverComponent,
      event: ev,
      translucent: true,
      componentProps: {
        userEmail: this.userEmail,
      },
    });
    return await popover.present();
  }

  // Este método queda por si llegas a usar logout desde Home directamente
  async logout() {
    const alert = await this.alertController.create({
      header: '🔒 Cerrar sesión',
      message: '¿Estás seguro de que deseas cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Cerrar sesión',
          role: 'confirm',
          handler: async () => {
            await this.supabase.client.auth.signOut();
            this.router.navigateByUrl('/auth');
          },
        },
      ],
    });

    await alert.present();
  }
}

