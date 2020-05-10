import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatVideoModule } from 'mat-video';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BubbleLocatorRoutingModule } from './bubble-locator-routing.module';
import { BubbleLocatorComponent } from '../components/bubble-locator/bubble-locator.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DialogConfirmationComponent } from '../components/dialog-confirmation/dialog-confirmation.component';
import { ReviewQualityDialogComponent } from '../components/review-quality-dialog/review-quality-dialog.component';
import { ResolutionDialogComponent } from '../components/resolution-dialog/resolution-dialog.component';
import { ReviewRatingComponent } from '../components/review-rating/review-rating.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared-modules/shared-module';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { GestureConfig } from '@angular/material/core';


@NgModule({
  declarations: [
    BubbleLocatorComponent,
    ReviewQualityDialogComponent,
    ReviewRatingComponent,
    ResolutionDialogComponent,
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
    MatSliderModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  entryComponents: [
    DialogConfirmationComponent,
    ResolutionDialogComponent,
  ],
  providers: [
    { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig }
  ]
})
export class BubbleLocatorModule { }
