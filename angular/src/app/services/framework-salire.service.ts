import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FrameworkSalarie } from './model/FrameworkSalaire';
@Injectable({
  providedIn: 'root'
})
export class FrameworkSalireService {


  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    // Ensure no trailing slash
    this.baseUrl = environment.apiBaseUrl.replace(/\/+$/, '') + '/FrameworkSalaries';
  }


  getAllClient(): Observable<FrameworkSalarie[]> {
    return this.http.get<FrameworkSalarie[]>(this.baseUrl);
  }
  

}
