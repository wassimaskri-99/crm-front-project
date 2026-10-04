import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FrameworkPort } from './model/port';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PortService {

  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    // Ensure no trailing slash
    this.baseUrl = environment.apiBaseUrl.replace(/\/+$/, '') + '/FrameworkPorts';
  }


  getAllPort(): Observable<FrameworkPort[]> {
    return this.http.get<FrameworkPort[]>(this.baseUrl);
  }
}
