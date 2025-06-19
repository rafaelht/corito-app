import { Component, Input } from '@angular/core';
import { PopoverController, IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-popover',
  standalone: true,
  imports: [IonicModule, CommonModule],
  template: `
    <ion-list>
      <ion-item lines="none">
        <ion-icon slot="start" name="person-circle-outline"></ion-icon>
        <ion-label>{{ userEmail }}</ion-label>
      </ion-item>
      <ion-item button (click)="logout()">
        <ion-icon slot="start" name="log-out-outline"></ion-icon>
        <ion-label>Cerrar sesión</ion-label>
      </ion-item>
    </ion-list>
  `,
})
export class ProfilePopoverComponent {
  @Input() userEmail: string = '';

  constructor(private router: Router, private popoverCtrl: PopoverController) {}

  async logout() {
    localStorage.clear();
    await this.popoverCtrl.dismiss();
    this.router.navigateByUrl('/auth', { replaceUrl: true });
  }
}
