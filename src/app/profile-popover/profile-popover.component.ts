import { Component, Input } from '@angular/core';
import { PopoverController, IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-popover',
  templateUrl: './profile-popover.component.html',
  styleUrls: ['./profile-popover.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class ProfilePopoverComponent {
  @Input() userEmail: string = '';

  constructor(private router: Router, private popoverCtrl: PopoverController) {}

  async viewProfile() {
    await this.popoverCtrl.dismiss();
    this.router.navigateByUrl('/profile');
  }

  async logout() {
    localStorage.clear();
    await this.popoverCtrl.dismiss();
    this.router.navigateByUrl('/auth', { replaceUrl: true });
  }
}
