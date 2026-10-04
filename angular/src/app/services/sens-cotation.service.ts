import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TradeSensCotation } from './model/sens';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SensCotationService {

  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    // Ensure no trailing slash
    this.baseUrl = environment.apiBaseUrl.replace(/\/+$/, '') + '/TradeSensCotations';
  }


  getAllSens(): Observable<TradeSensCotation[]> {
    return this.http.get<TradeSensCotation[]>(this.baseUrl);
  }
}
