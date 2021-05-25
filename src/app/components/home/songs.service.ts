import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FakeBackendInterceptor } from '@app/helpers';
import { AuthenticationService } from '@app/services';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SongsService {

  constructor(
    private http :HttpClient,
    
  ) { }

  getSongs():Observable<any>{
   return  this.http.get('assets/data.json')
  }
 
}
