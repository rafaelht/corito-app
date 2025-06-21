import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { IonicModule, AlertController, ToastController, IonModal } from '@ionic/angular';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SupabaseService } from '../supabase.service';
import { EventService } from '../services/event.service';
import { EventForm } from '../models/event.interface';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
  templateUrl: './create-event.page.html',
  styleUrls: ['./create-event.page.scss'],
  providers: [DatePipe]
})
export class CreateEventPage implements OnInit {
  @ViewChild('dateModal') dateModal!: IonModal;
  @ViewChild('timeModal') timeModal!: IonModal;

  eventForm: FormGroup;
  activities: string[] = [];
  isSubmitting = false;
  minDate = new Date().toISOString().split('T')[0];
  userId: string = '';
  isEditMode = false;
  pageTitle = 'Crear Nuevo Evento';
  formattedDate: string = '';
  formattedTime: string = '';
  private eventId: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private eventService: EventService,
    private supabase: SupabaseService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private datePipe: DatePipe
  ) {
    this.eventForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      date: ['', Validators.required],
      time: ['', Validators.required],
      location: ['', [Validators.required, Validators.minLength(3)]],
      max_guests: [null]
    });
  }

  async ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.eventId;
    this.pageTitle = this.isEditMode ? 'Editar Evento' : 'Crear Nuevo Evento';
    
    const { data: { user } } = await this.supabase.client.auth.getUser();
    if (user) {
      this.userId = user.id;
    } else {
      this.router.navigateByUrl('/auth');
      return;
    }

    if (this.isEditMode && this.eventId) {
      this.loadEventForEdit(this.eventId);
    }
  }

  async loadEventForEdit(id: string) {
    const event = await this.eventService.getEventById(id);
    if (event && event.date && event.time) {
      const combinedISO = `${event.date}T${event.time}`;
      this.eventForm.patchValue({
        title: event.title,
        description: event.description,
        date: combinedISO,
        time: combinedISO,
        location: event.location,
        max_guests: event.max_guests,
      });
      this.activities = event.activities || [];
      this.formattedDate = this.datePipe.transform(combinedISO, 'fullDate') || '';
      this.formattedTime = this.datePipe.transform(combinedISO, 'h:mm a') || '';
    }
  }

  addActivity(activity: any) {
    const value = String(activity ?? '').trim();
    if (value) {
      if (!this.activities.includes(value)) {
        this.activities.push(value);
      }
    }
  }

  addActivityAndKeepFocus(inputElement: any, event?: any) {
    // Prevenir el submit del formulario si el evento viene de Enter
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const value = String(inputElement.value ?? '').trim();
    if (value) {
      if (!this.activities.includes(value)) {
        this.activities.push(value);
      }
      // Limpiar el input
      inputElement.value = '';
      // Mantener el foco en el input
      setTimeout(() => {
        inputElement.setFocus();
      }, 100);
    }
  }

  handleActivityKeydown(event: KeyboardEvent, inputElement: any) {
    // Prevenir el submit del formulario cuando se presiona Enter/Return
    if (event.key === 'Enter' || event.keyCode === 13) {
      event.preventDefault();
      event.stopPropagation();
      this.addActivityAndKeepFocus(inputElement, event);
    }
  }

  removeActivity(index: number) {
    this.activities.splice(index, 1);
  }

  async presentDateModal() {
    this.dateModal.present();
    const { data, role } = await this.dateModal.onDidDismiss();

    if (role === 'confirm') {
      const selectedDate = data || new Date().toISOString();
      this.eventForm.get('date')?.setValue(selectedDate);
      this.formattedDate = this.datePipe.transform(selectedDate, 'fullDate') || '';
      this.cdr.detectChanges();
    }
  }

  async presentTimeModal() {
    this.timeModal.present();
    const { data, role } = await this.timeModal.onDidDismiss();

    if (role === 'confirm') {
      const selectedTime = data || new Date().toISOString();
      this.eventForm.get('time')?.setValue(selectedTime);
      this.formattedTime = this.datePipe.transform(selectedTime, 'h:mm a') || '';
      this.cdr.detectChanges();
    }
  }

  async createEvent() {
    await this._submitForm();
  }

  private async _submitForm() {
    if (this.eventForm.invalid) {
      await this.showToast('Por favor, completa todos los campos requeridos.', 'warning');
      return;
    }

    this.isSubmitting = true;

    try {
      const formValues = this.eventForm.value;

      const dateValue = formValues.date ? new Date(formValues.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      const timeValue = formValues.time ? new Date(formValues.time).toLocaleTimeString('en-GB') : '12:00:00';

      const eventData: EventForm = {
        title: formValues.title,
        description: formValues.description || '',
        date: dateValue,
        time: timeValue,
        location: formValues.location,
        activities: this.activities,
        max_guests: formValues.max_guests || null,
      };

      let result;
      if (this.isEditMode && this.eventId) {
        result = await this.eventService.updateEvent(this.eventId, eventData);
      } else {
        result = await this.eventService.createEvent(eventData, this.userId, 'active');
      }

      if (result) {
        const successMessage = this.isEditMode ? 'Evento actualizado!' : 'Evento creado!';
        await this.showToast(successMessage, 'success');
        this.eventForm.reset();
        this.activities = [];
        this.router.navigateByUrl('/home');
      } else {
        const errorMessage = this.isEditMode ? 'Error al actualizar el evento' : 'Error al crear el evento';
        await this.showToast(errorMessage, 'danger');
      }
    } catch (error) {
      console.error('Error saving event:', error);
      const errorMessage = this.isEditMode ? 'Error al actualizar el evento' : 'Error al crear el evento';
      await this.showToast(errorMessage, 'danger');
    } finally {
      this.isSubmitting = false;
    }
  }

  async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: color,
      position: 'top'
    });
    await toast.present();
  }

  async confirmExit() {
    if (this.eventForm.dirty || this.activities.length > 0) {
      const alert = await this.alertController.create({
        header: '¿Salir sin guardar?',
        message: 'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Salir',
            handler: () => {
              this.router.navigateByUrl('/home');
            }
          }
        ]
      });
      await alert.present();
    } else {
      this.router.navigateByUrl('/home');
    }
  }
}
