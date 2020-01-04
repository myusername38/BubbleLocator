import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminMenuComponent } from '../components/admin-menu/admin-menu.component';
import { AssistantMenuComponent } from '../components/assistant-menu/assistant-menu.component';
import { OwnerMenuComponent } from '../components/owner-menu/owner-menu.component';
import { VideoMenuComponent } from '../components/video-menu/video-menu.component';
import { AuthGuard } from '../guards/auth-guard.service';

const routes: Routes = [
  { path: 'admins', component: AdminMenuComponent, canActivate: [AuthGuard] },
  { path: 'assistants', component: AssistantMenuComponent, canActivate: [AuthGuard] },
  { path: 'owners', component: OwnerMenuComponent, canActivate: [AuthGuard] },
  { path: 'videos', component: VideoMenuComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
