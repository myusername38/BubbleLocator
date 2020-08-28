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
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatBadgeModule } from '@angular/material/badge';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AssistantMenuComponent } from '../components/assistant-menu/assistant-menu.component';
import { AddPermissionDialogComponent } from '../dialogs/add-permission-dialog/add-permission-dialog.component';
import { OwnerMenuComponent } from '../components/owner-menu/owner-menu.component';
import { DeleteUserDialogComponent } from '../dialogs/delete-user-dialog/delete-user-dialog.component';
import { DialogConfirmationComponent } from '../dialogs/dialog-confirmation/dialog-confirmation.component';
import { VideoMenuComponent } from '../components/video-menu/video-menu.component';
import { AddVideoDialogComponent } from '../dialogs/add-video-dialog/add-video-dialog.component';
import { ExpandVideoDialogComponent } from '../dialogs/expand-video-dialog/expand-video-dialog.component';
import { UserMenuComponent } from '../components/user-menu/user-menu.component';
import { ExpandUserDialogComponent } from '../dialogs/expand-user-dialog/expand-user-dialog.component';
import { SearchDialogComponent } from '../dialogs/search-dialog/search-dialog.component';
import { SearchVideoDialogComponent } from '../dialogs/search-video-dialog/search-video-dialog.component';
import { AnnouncementFormDialogComponent } from '../dialogs/announcement-form-dialog/announcement-form-dialog.component';
import { AnnouncementMenuComponent } from '../components/announcement-menu/announcement-menu.component';
import { AdminSideMenuComponent } from '../components/admin-side-menu/admin-side-menu.component';
import { SharedModule } from '../shared-modules/shared-module';
import { AdminComponent } from './admin.component';

@NgModule({
  declarations: [
    AdminMenuComponent,
    AddPermissionDialogComponent,
    DeleteUserDialogComponent,
    AnnouncementFormDialogComponent,
    AddVideoDialogComponent,
    AssistantMenuComponent,
    OwnerMenuComponent,
    VideoMenuComponent,
    ExpandVideoDialogComponent,
    UserMenuComponent,
    ExpandUserDialogComponent,
    SearchDialogComponent,
    SearchVideoDialogComponent,
    AnnouncementMenuComponent,
    AdminSideMenuComponent,
    AdminComponent,
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
    MatSelectModule,
    MatMenuModule,
    MatBadgeModule,
    MatSidenavModule,
    MatSortModule,
    MatRadioModule,
    MatToolbarModule,
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
    AnnouncementFormDialogComponent,
  ],
})
export class AdminModule { }
