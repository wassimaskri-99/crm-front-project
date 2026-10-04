import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FrameworkPay } from './model/pays';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaysService {

  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    // Ensure no trailing slash
    this.baseUrl = environment.apiBaseUrl.replace(/\/+$/, '') + '/FrameworkPays';
  }


  getAllPays(): Observable<FrameworkPay[]> {
    return this.http.get<FrameworkPay[]>(this.baseUrl);
  }
}
