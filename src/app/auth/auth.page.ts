import { Component } from '@angular/core'
import { SupabaseService } from '../supabase.service'
import { Router } from '@angular/router'
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common'; // para NgIf
import { FormsModule } from '@angular/forms'; // para ngModel



@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ]
})
export class AuthPage {
  email: string = ''
  password: string = ''
  message: string = ''
  loading: boolean = false

  constructor(private supabase: SupabaseService, private router: Router) {}

    async login() {
    this.loading = true;
    this.message = '';

    const { error } = await this.supabase.client.auth.signInWithPassword({
      email: this.email,
      password: this.password,
    });

    if (error) {
      this.message = `Error al iniciar sesión: ${error.message}`;
    } else {
      this.router.navigateByUrl('/home');
;
    }

    this.loading = false;
  }

  goToRegister() {
    this.router.navigateByUrl('/register');
  }

  ionViewWillEnter() {
  this.email = '';
  this.password = '';
  this.message = '';
  this.loading = false;
}


}
