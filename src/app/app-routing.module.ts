// src/app/app-routing.module.ts (o el módulo de rutas principal)

import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth.page').then(m => m.AuthPage)
  },
  // otras rutas aquí
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.page').then( m => m.ProfilePage)
  },
  {
    path: 'create-event',
    loadComponent: () => import('./create-event/create-event.page').then(m => m.CreateEventPage)
  },
  {
    path: 'edit-event/:id',
    loadComponent: () => import('./create-event/create-event.page').then(m => m.CreateEventPage)
  },
  {
    path: 'event-detail/:id',
    loadComponent: () => import('./event-detail/event-detail.page').then( m => m.EventDetailPage)
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
