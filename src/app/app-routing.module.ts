import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { RecoverPasswordComponent } from './components/recover-password/recover-password.component';
import { LandingComponent } from './components/landing/landing.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { AuthGuard } from './guards/auth-guard.service';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'recover-password', component: RecoverPasswordComponent },
  { path: 'bubbleLocator', loadChildren: () => import ('./bubble-locator/bubble-locator.module').then(mod => mod.BubbleLocatorModule) },
  { path: 'admin', loadChildren: () => import ('./admin/admin.module').then(mod => mod.AdminModule) },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
