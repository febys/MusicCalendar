import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
        
        

// used to create fake backend
import { fakeBackendProvider } from './helpers';

import { AppComponent } from './app.component';
import { appRoutingModule } from './app.routing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtInterceptor, ErrorInterceptor } from './helpers';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/authentification/login/login.component';
import { MatButtonModule, MatCardModule, MatDatepickerModule, MatDialog, MatDialogModule, MatFormField, MatFormFieldModule, MatInput, MatInputModule, MatLabel, MatListModule, MatMenuModule, MatNativeDateModule, MatSelectModule, MatToolbarModule } from '@angular/material';;
import { CalendarModule , DateAdapter} from 'angular-calendar';;
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns'
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { SongsService } from './components/home/songs.service';;
import { SongDialogComponent } from './dialog/song-dialog/song-dialog.component'
;
import { AddModSongsComponent } from './dialog/add-mod-songs/add-mod-songs.component'






@NgModule({
    imports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        appRoutingModule,
        //MaterialModule
        MatDatepickerModule,
        MatInputModule,
        MatFormFieldModule, 
        MatButtonModule,
        MatNativeDateModule,
        MatDialogModule,
        MatMenuModule,
        MatSelectModule,
        MatToolbarModule,
        MatCardModule,
        MatListModule,
         //Calendar Module
        CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
        NgbModalModule,
        
       
    
  
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        SongDialogComponent,
        AddModSongsComponent
    ],
    entryComponents:[
        SongDialogComponent,
        AddModSongsComponent,
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        // provider used to create fake backend
        fakeBackendProvider,
        SongsService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }