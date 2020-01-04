import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminMenuComponent } from '../components/admin-menu/admin-menu.component';
import { AdminRoutingModule } from './admin-routing.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatTableModule,
  MatProgressSpinnerModule,
  MatMenuModule,
  MatInputModule,
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AssistantMenuComponent } from '../components/assistant-menu/assistant-menu.component';
import { AddPermissionDialogComponent } from '../components/add-permission-dialog/add-permission-dialog.component';
import { OwnerMenuComponent } from '../components/owner-menu/owner-menu.component';
import { DeleteUserDialogComponent } from '../components/delete-user-dialog/delete-user-dialog.component';
import { DialogConfirmationComponent } from '../components/dialog-confirmation/dialog-confirmation.component';

@NgModule({
  declarations: [
    AdminMenuComponent,
    AddPermissionDialogComponent,
    DeleteUserDialogComponent,
    DialogConfirmationComponent,
    AssistantMenuComponent,
    OwnerMenuComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FlexLayoutModule,
    ScrollingModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatTableModule,
    MatInputModule,
    MatMenuModule,
    MatProgressSpinnerModule,
  ],
  entryComponents: [
    AddPermissionDialogComponent,
    DeleteUserDialogComponent,
    DialogConfirmationComponent,
  ],
})
export class AdminModule { }
