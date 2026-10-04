import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { raisonSociale } from './model/raisonSociale';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RaisonSocialeService {

  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    // Ensure no trailing slash
    this.baseUrl = environment.apiBaseUrl.replace(/\/+$/, '') + '/TiersTiers';
  }


  getAllRaisonSociale(): Observable<raisonSociale[]> {
    return this.http.get<raisonSociale[]>(this.baseUrl);
  }
  getAllRaisonSocialeFirst10(): Observable<raisonSociale[]> {
    return this.http.get<raisonSociale[]>(`${this.baseUrl}?take=10`);
  }
  getRaisonSociale(page: number, pageSize: number): Observable<raisonSociale[]> {
    return this.http.get<raisonSociale[]>(`${this.baseUrl}?page=${page}&pageSize=${pageSize}`);
  }
  
  
}
