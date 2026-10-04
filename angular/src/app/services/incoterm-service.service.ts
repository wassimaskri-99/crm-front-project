import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FrameworkIncoterm } from './model/incoterm';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IncotermServiceService {

  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    // Ensure no trailing slash
    this.baseUrl = environment.apiBaseUrl.replace(/\/+$/, '') + '/FrameworkIncoterms';
  }


  getAllIncoterms(): Observable<FrameworkIncoterm[]> {
    return this.http.get<FrameworkIncoterm[]>(this.baseUrl);
  }
}
