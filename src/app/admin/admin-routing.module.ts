import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminMenuComponent } from '../components/admin-menu/admin-menu.component';
import { AssistantMenuComponent } from '../components/assistant-menu/assistant-menu.component';
import { OwnerMenuComponent } from '../components/owner-menu/owner-menu.component';

const routes: Routes = [
  { path: 'admins', component: AdminMenuComponent },
  { path: 'assistants', component: AssistantMenuComponent },
  { path: 'owners', component: OwnerMenuComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
