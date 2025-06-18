import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService } from '../supabase.service';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  userEmail: string = '';

  constructor(
    private supabase: SupabaseService, 
    private router: Router,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    const {
      data: { user },
    } = await this.supabase.client.auth.getUser();

    if (user) {
      this.userEmail = user.email || '';
    }
  }

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
