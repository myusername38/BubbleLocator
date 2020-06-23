import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BubbleLocatorComponent } from '../components/bubble-locator/bubble-locator.component';
import { ReviewRatingComponent } from '../components/review-rating/review-rating.component';
import { TutorialLocatorComponent } from '../components/tutorial-locator/tutorial-locator.component';
import { LocatorComponent } from './locator.component';
import { AuthGuard } from '../guards/auth-guard.service';

const routes: Routes = [
  { path: '', component: LocatorComponent, children: [
    { path: '', component: BubbleLocatorComponent, canActivate: [AuthGuard] },
    { path: 'review-rating', component: ReviewRatingComponent, canActivate: [AuthGuard] },
    { path: 'tutorial', component: TutorialLocatorComponent, canActivate: [AuthGuard] }
  ] },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BubbleLocatorRoutingModule { }
