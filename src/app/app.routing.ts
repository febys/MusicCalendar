import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/authentification/login/login.component';
import { HomeComponent } from './components/home/home.component';

import { AuthGuard } from './helpers';

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'auth/login', component: LoginComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const appRoutingModule = RouterModule.forRoot(routes);