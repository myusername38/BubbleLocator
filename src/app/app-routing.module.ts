import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { RecoverPasswordComponent } from './components/recover-password/recover-password.component';
import { LandingComponent } from './components/landing/landing.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TutorialComponent } from './components/tutorial/tutorial.component';
import { GdprComponent } from './components/gdpr/gdpr.component';
import { AuthGuard } from './guards/auth-guard.service';

const routes: Routes = [
  { path: '', component: LandingComponent, children: [
    { path: '', component: HomeComponent },
    { path: 'privacy-policy', component: GdprComponent },
    { path: 'login', component: LoginComponent },
    { path: 'verify-email', component: VerifyEmailComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'recover-password', component: RecoverPasswordComponent },
  ] },
  { path: 'tutorial', component: TutorialComponent, canActivate: [AuthGuard] },
  { path: 'home', component: DashboardComponent, canActivate: [AuthGuard] }, //fix this later to dashbaord
  { path: 'bubbleLocator', loadChildren: () => import ('./bubble-locator/bubble-locator.module').then(mod => mod.BubbleLocatorModule) },
  { path: 'admin', loadChildren: () => import ('./admin/admin.module').then(mod => mod.AdminModule) },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
