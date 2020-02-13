import { NgModule } from '@angular/core';
import { DialogConfirmationComponent } from '../components/dialog-confirmation/dialog-confirmation.component';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
    imports: [
      CommonModule,
      MatButtonModule,
      FlexLayoutModule
     ],
    declarations: [
        DialogConfirmationComponent
    ],
    exports: [
      DialogConfirmationComponent
    ]
})
export class SharedModule { }
