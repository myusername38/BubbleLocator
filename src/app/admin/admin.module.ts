import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminMenuComponent } from '../components/admin-menu/admin-menu.component';
import { AdminRoutingModule } from './admin-routing.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AssistantMenuComponent } from '../components/assistant-menu/assistant-menu.component';
import { AddPermissionDialogComponent } from '../components/add-permission-dialog/add-permission-dialog.component';
import { OwnerMenuComponent } from '../components/owner-menu/owner-menu.component';
import { DeleteUserDialogComponent } from '../components/delete-user-dialog/delete-user-dialog.component';
import { DialogConfirmationComponent } from '../components/dialog-confirmation/dialog-confirmation.component';
import { VideoMenuComponent } from '../components/video-menu/video-menu.component';
import { AddVideoDialogComponent } from '../components/add-video-dialog/add-video-dialog.component';
import { ExpandVideoDialogComponent } from '../components/expand-video-dialog/expand-video-dialog.component';
import { UserMenuComponent } from '../components/user-menu/user-menu.component';
import { ExpandUserDialogComponent } from '../components/expand-user-dialog/expand-user-dialog.component';
import { SearchDialogComponent } from '../components/search-dialog/search-dialog.component';
import { SearchVideoDialogComponent } from '../components/search-video-dialog/search-video-dialog.component';
import { SharedModule } from '../shared-modules/shared-module';

@NgModule({
  declarations: [
    AdminMenuComponent,
    AddPermissionDialogComponent,
    DeleteUserDialogComponent,
    AddVideoDialogComponent,
    AssistantMenuComponent,
    OwnerMenuComponent,
    VideoMenuComponent,
    ExpandVideoDialogComponent,
    UserMenuComponent,
    ExpandUserDialogComponent,
    SearchDialogComponent,
    SearchVideoDialogComponent,
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
    MatPaginatorModule,
    MatInputModule,
    MatMenuModule,
    MatSortModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    SharedModule
  ],
  entryComponents: [
    AddPermissionDialogComponent,
    DeleteUserDialogComponent,
    DialogConfirmationComponent,
    AddVideoDialogComponent,
    ExpandVideoDialogComponent,
    SearchVideoDialogComponent,
  ],
})
export class AdminModule { }
