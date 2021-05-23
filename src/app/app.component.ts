import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './models/user';

import { AuthenticationService } from './services';

@Component({ selector: 'app',
 templateUrl: 'app.component.html',
 styleUrls: ['app.component.scss'], })
export class AppComponent {
    currentUser: User;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
       // console.log(this.currentUser,'curent')
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/auth/login']);
    }
}