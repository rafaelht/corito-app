import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthPage } from './auth.page' // 👈 Importación

const routes: Routes = [
  {
    path: '', // 👈 Muy importante: esto es para que /auth cargue AuthPage
    component: AuthPage,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthPageRoutingModule {}
