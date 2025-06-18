import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../supabase.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule]
})
export class RegisterPage {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  confirmEmail: string = '';
  password: string = '';
  message: string = '';
  loading = false;

  constructor(private supabase: SupabaseService, private router: Router) {}

  async register() {
    this.loading = true;
    this.message = '';

    if (this.email.trim() !== this.confirmEmail.trim()) {
      this.message = 'Los correos no coinciden.';
      this.loading = false;
      return;
    }

    if (!this.firstName || !this.lastName || !this.email || !this.password) {
      this.message = 'Todos los campos son obligatorios.';
      this.loading = false;
      return;
    }

    const { error } = await this.supabase.client.auth.signUp({
      email: this.email.trim(),
      password: this.password,
      options: {
        data: {
          first_name: this.firstName,
          last_name: this.lastName
        }
      }
    });

    if (error) {
      this.message = `Error al registrar: ${error.message}`;
    } else {
      this.message = 'Registro exitoso. Revisa tu correo.';
      // this.router.navigateByUrl('/auth'); // si deseas redirigir después
    }

    this.loading = false;
  }
  goBack() {
  this.router.navigateByUrl('/auth');
  }
}
