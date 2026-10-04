import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TiersContact } from './model/tiersContact';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TiersContactService {

  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    // Ensure no trailing slash
    this.baseUrl = environment.apiBaseUrl.replace(/\/+$/, '') + '/TiersContacts';
  }


  getAllContact(): Observable<TiersContact[]> {
    return this.http.get<TiersContact[]>(this.baseUrl);
}
}
