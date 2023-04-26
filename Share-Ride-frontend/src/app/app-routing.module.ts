import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { VerificationComponent } from './auth/verification/verification.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';

const routes: Routes = [
  {path: '', redirectTo:'/home',pathMatch:'full'},
  {path: 'auth', component:AuthComponent},
  {path: 'home', component:HomeComponent, canActivate:[AuthGuard]},
  {path: 'profile', component:ProfileComponent, canActivate:[AuthGuard]},
  {path: 'profile/new', component:ProfileComponent, canActivate:[AuthGuard]},
  {path: 'vehicles', component:VehiclesComponent, canActivate:[AuthGuard]},
  {path: 'verify/:token', component:VerificationComponent},
  {path: 'resetPassword/:token', component:ResetPasswordComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
