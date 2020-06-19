import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminMenuComponent } from '../components/admin-menu/admin-menu.component';
import { AssistantMenuComponent } from '../components/assistant-menu/assistant-menu.component';
import { OwnerMenuComponent } from '../components/owner-menu/owner-menu.component';
import { AdminComponent } from './admin.component';
import { VideoMenuComponent } from '../components/video-menu/video-menu.component';
import { UserMenuComponent } from '../components/user-menu/user-menu.component';
import { AuthGuard } from '../guards/auth-guard.service';

const routes: Routes = [
  { path: '', component: AdminComponent, children: [
    { path: '', pathMatch: 'full', redirectTo: 'videos' },
    { path: 'admins', component: AdminMenuComponent },
    { path: 'assistants', component: AssistantMenuComponent, canActivate: [AuthGuard] },
    { path: 'owners', component: OwnerMenuComponent, canActivate: [AuthGuard] },
    { path: 'videos', component: VideoMenuComponent, canActivate: [AuthGuard] },
    { path: 'users', component: UserMenuComponent, canActivate: [AuthGuard] },
  ] },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
