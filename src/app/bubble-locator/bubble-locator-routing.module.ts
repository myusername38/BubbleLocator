import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BubbleLocatorComponent } from '../components/bubble-locator/bubble-locator.component';
import { ReviewRatingComponent } from '../components/review-rating/review-rating.component';
import { AuthGuard } from '../guards/auth-guard.service';

const routes: Routes = [
  { path: '', component: BubbleLocatorComponent, canActivate: [AuthGuard] },
  { path: 'review-rating', component: ReviewRatingComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BubbleLocatorRoutingModule { }
