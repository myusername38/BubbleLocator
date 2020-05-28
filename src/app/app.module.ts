import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './services/interceptor.service';
import { environment } from 'src/environments/environment';
import { LoginComponent } from './components/login/login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RecoverPasswordComponent } from './components/recover-password/recover-password.component';
import { LandingComponent } from './components/landing/landing.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AdminModule } from './admin/admin.module';
import { BubbleLocatorModule } from './bubble-locator/bubble-locator.module';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { GestureConfig } from '@angular/material/core';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { ReviewsPerDayComponent } from './components/home/charts/reviews-per-day/reviews-per-day.component';
import { VideosPieChartComponent } from './components/home/charts/videos-pie-chart/videos-pie-chart.component';
import { TopUserScoreChartComponent } from './components/home/charts/top-user-score-chart/top-user-score-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegisterComponent,
    ResetPasswordComponent,
    LoginComponent,
    RecoverPasswordComponent,
    LandingComponent,
    VerifyEmailComponent,
    ReviewsPerDayComponent,
    VideosPieChartComponent,
    TopUserScoreChartComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NgxChartsModule,
    FormsModule,
    FlexLayoutModule,
    AngularFireModule.initializeApp(environment.firebaseConfig, 'BubbleLocatorAPI'),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSliderModule,
    MatSnackBarModule,
    MatMenuModule,
    MatToolbarModule,
    MatInputModule,
    AdminModule,
    BubbleLocatorModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig },
    AngularFireAuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
