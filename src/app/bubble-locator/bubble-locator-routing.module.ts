import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BubbleLocatorComponent } from '../components/bubble-locator/bubble-locator.component';
import { AuthGuard } from '../guards/auth-guard.service';


const routes: Routes = [
  { path: '', component: BubbleLocatorComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BubbleLocatorRoutingModule { }
