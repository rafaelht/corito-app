import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core'
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
export class AuthPage implements AfterViewInit {
  email: string = ''
  password: string = ''
  message: string = ''
  loading: boolean = false
  currentYear: number = new Date().getFullYear()

  @ViewChild('emailInput') emailInput!: ElementRef;
  @ViewChild('passwordInput') passwordInput!: ElementRef;

  constructor(private supabase: SupabaseService, private router: Router) {}

  ngAfterViewInit() {
    // Aplicar estilos a los inputs después de que se rendericen
    setTimeout(() => {
      this.applyInputStyles();
    }, 100);
  }

  private applyInputStyles() {
    // Aplicar estilos a todos los inputs de la página
    const inputs = document.querySelectorAll('ion-input');
    inputs.forEach(input => {
      const element = input as HTMLElement;
      element.style.setProperty('--color', 'white');
      element.style.setProperty('color', 'white');
    });

    // Aplicar estilos específicos para Android
    if (this.isAndroid()) {
      inputs.forEach(input => {
        const element = input as HTMLElement;
        element.style.setProperty('--color', 'white !important');
        element.style.setProperty('color', 'white !important');
      });
    }
  }

  private isAndroid(): boolean {
    return navigator.userAgent.toLowerCase().includes('android');
  }

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
    
    // Aplicar estilos cuando la vista se carga
    setTimeout(() => {
      this.applyInputStyles();
    }, 100);
  }

}
