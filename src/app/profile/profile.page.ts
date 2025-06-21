import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { SupabaseService } from '../supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class ProfilePage implements OnInit {
  profileForm: FormGroup;
  userEmail: string | undefined = '';
  isLoading = true;
  private userId: string = '';

  constructor(
    private supabase: SupabaseService,
    private fb: FormBuilder,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      first_name: [''],
      last_name: [''],
      website: [''],
    });
  }

  ngOnInit() {
    this.loadProfile();
  }

  async loadProfile() {
    this.isLoading = true;
    try {
      const { data: { user } } = await this.supabase.client.auth.getUser();
      if (user) {
        this.userId = user.id;
        this.userEmail = user.email;

        const { data, error } = await this.supabase.client
          .from('profiles')
          .select('*')
          .eq('id', this.userId)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          this.profileForm.patchValue({
            username: data.username,
            first_name: data.first_name,
            last_name: data.last_name,
            website: data.website,
          });
        }
      }
    } catch (error) {
      this.showToast('Error al cargar el perfil.', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  async updateProfile() {
    const loading = await this.loadingController.create();
    await loading.present();

    try {
      const updates = {
        id: this.userId,
        ...this.profileForm.value,
        updated_at: new Date(),
      };

      const { error } = await this.supabase.client
        .from('profiles')
        .upsert(updates);
      
      if (error) throw error;
      this.showToast('Perfil actualizado con éxito.', 'success');
    } catch (error) {
      this.showToast('Error al actualizar el perfil.', 'danger');
    } finally {
      loading.dismiss();
    }
  }

  async signOut() {
    await this.supabase.client.auth.signOut();
    this.router.navigateByUrl('/auth', { replaceUrl: true });
  }

  async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
    });
    await toast.present();
  }
}
