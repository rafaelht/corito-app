import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../supabase.service';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class RegisterPage implements OnInit {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  confirmEmail: string = '';
  password: string = '';
  loading: boolean = false;
  message: string = '';
  messageClass: string = '';

  constructor(
    private supabase: SupabaseService,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.resetForm();
  }

  resetForm() {
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.confirmEmail = '';
    this.password = '';
    this.loading = false;
  }

  async register() {
    this.message = '';

    if (this.email !== this.confirmEmail) {
      this.message = 'Los correos no coinciden.';
      this.messageClass = 'error-message';
      return;
    }

    this.loading = true;

    const { data, error } = await this.supabase.client.auth.signUp({
      email: this.email,
      password: this.password,
    });

    this.loading = false;

    if (error) {
      this.message = `Error al registrar: ${error.message}`;
      this.messageClass = 'error-message';
    } else {
      this.resetForm();
      await this.showSuccessAlert();
    }
  }

  async showSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Registro exitoso 🥳✅',
      message: 'Usuario creado correctamente.',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.router.navigate(['/auth'], { replaceUrl: true });
          }
        }
      ]
    });

    await alert.present();
  }

  goBack() {
    this.router.navigate(['/auth'], { replaceUrl: true });
  }
}
