import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TradeNatureCotation } from './model/nature';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NatureCotationService {

  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    // Ensure no trailing slash
    this.baseUrl = environment.apiBaseUrl.replace(/\/+$/, '') + '/TradeNatureCotations';
  }


  getAllNature(): Observable<TradeNatureCotation[]> {
    return this.http.get<TradeNatureCotation[]>(this.baseUrl);
  }
  
}
