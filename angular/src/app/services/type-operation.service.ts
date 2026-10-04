import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TradeTypeOperationCotation } from './model/typeOperation';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TypeOperationService {

  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    // Ensure no trailing slash
    this.baseUrl = environment.apiBaseUrl.replace(/\/+$/, '') + '/TradeTypeOperationCotations';
  }


  getAllOperation(): Observable<TradeTypeOperationCotation[]> {
    return this.http.get<TradeTypeOperationCotation[]>(this.baseUrl);
  }
}
