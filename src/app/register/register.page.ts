import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../supabase.service';
import { 
  AlertController, 
  NavController, 
  IonicModule
} from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ]
})
export class RegisterPage implements OnInit {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  confirmEmail: string = '';
  password: string = '';
  confirmPassword: string = '';
  loading: boolean = false;
  message: string = '';
  currentYear: number = new Date().getFullYear();

  constructor(
    private supabase: SupabaseService,
    private alertController: AlertController,
    private router: Router,
    private navCtrl: NavController
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
    this.confirmPassword = '';
    this.loading = false;
  }

  async register() {
    this.message = '';

    if (this.email !== this.confirmEmail) {
      this.message = 'Los correos no coinciden.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.message = 'Las contraseñas no coinciden.';
      return;
    }

    this.loading = true;

    try {
      const { data, error } = await this.supabase.client.auth.signUp({
        email: this.email,
        password: this.password,
        options: {
          data: {
            first_name: this.firstName,
            last_name: this.lastName,
          },
        },
      });
  
      if (error) {
        throw error;
      }
      
      this.loading = false;
      await this.showSuccessAlert();
      // El 'data' contendrá la sesión del usuario si el correo requiere confirmación.
      // O la sesión del usuario si el auto-confirm está habilitado.
    } catch (error: any) {
      this.loading = false;
      this.message = `Error al registrar: ${error.message}`;
    }
  }

  async showSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Registro exitoso 🥳✅',
      message: 'Usuario creado correctamente. Por favor, revisa tu correo para verificar tu cuenta.',
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
    this.navCtrl.back();
  }

  goToLogin() {
    this.router.navigate(['/auth'], { replaceUrl: true });
  }
}
