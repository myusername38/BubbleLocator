import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatVideoModule } from 'mat-video';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BubbleLocatorRoutingModule } from './bubble-locator-routing.module';
import { BubbleLocatorComponent } from '../components/bubble-locator/bubble-locator.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DialogConfirmationComponent } from '../dialogs/dialog-confirmation/dialog-confirmation.component';
import { ReviewQualityDialogComponent } from '../dialogs/review-quality-dialog/review-quality-dialog.component';
import { ResolutionDialogComponent } from '../dialogs/resolution-dialog/resolution-dialog.component';
import { ReviewRatingComponent } from '../components/review-rating/review-rating.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared-modules/shared-module';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { GestureConfig } from '@angular/material/core';
import { LocatorComponent } from './locator.component';
import { TutorialLocatorComponent } from '../components/tutorial-locator/tutorial-locator.component';
import { ViewVideoComponent } from '../components/view-video/view-video.component';
import { TutorialResultsDialogComponent } from '../dialogs/tutorial-results-dialog/tutorial-results-dialog.component';
import { CompletedRatingDialogComponent } from '../dialogs/completed-rating-dialog/completed-rating-dialog.component';

@NgModule({
  declarations: [
    BubbleLocatorComponent,
    ReviewQualityDialogComponent,
    ReviewRatingComponent,
    ResolutionDialogComponent,
    LocatorComponent,
    TutorialLocatorComponent,
    ViewVideoComponent,
    TutorialResultsDialogComponent,
    CompletedRatingDialogComponent,
  ],
  imports: [
    CommonModule,
    BubbleLocatorRoutingModule,
    FlexLayoutModule,
    MatVideoModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatSliderModule,
    MatRadioModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatSliderModule,
    MatProgressBarModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  entryComponents: [
    DialogConfirmationComponent,
    ResolutionDialogComponent,
    ReviewQualityDialogComponent,
    TutorialResultsDialogComponent,
    CompletedRatingDialogComponent
  ],
  providers: [
    { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig }
  ]
})
export class BubbleLocatorModule { }
