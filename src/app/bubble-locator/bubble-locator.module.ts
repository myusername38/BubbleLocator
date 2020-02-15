import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatVideoModule } from 'mat-video';
import {
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatRadioModule,
} from '@angular/material';

import {MatSliderModule} from '@angular/material/slider';
import { BubbleLocatorRoutingModule } from './bubble-locator-routing.module';
import { BubbleLocatorComponent } from '../components/bubble-locator/bubble-locator.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DialogConfirmationComponent } from '../components/dialog-confirmation/dialog-confirmation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared-modules/shared-module';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { GestureConfig } from '@angular/material';


@NgModule({
  declarations: [
    BubbleLocatorComponent,
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
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  entryComponents: [
    DialogConfirmationComponent,
  ],
  providers: [
    {provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig}
  ]
})
export class BubbleLocatorModule { }
