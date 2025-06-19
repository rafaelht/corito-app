import { Component } from '@angular/core';
import { IonicModule, PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  standalone: true,
  styleUrls: ['./profile.page.scss'],
  imports: [IonicModule],
  template: `
    <ion-list>
      <ion-item button (click)="logout()">
        <ion-icon slot="start" name="log-out-outline"></ion-icon>
        <ion-label>Cerrar sesión</ion-label>
      </ion-item>
    </ion-list>
  `,
})
export class ProfilePage {

   constructor(private router: Router, private popoverCtrl: PopoverController) {}

  async logout() {
    localStorage.clear();
    await this.popoverCtrl.dismiss();
    this.router.navigateByUrl('/auth', { replaceUrl: true });
  }

}
