import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Cotation } from './model/cotation';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class CotationService {

  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    // Ensure no trailing slash
    this.baseUrl = environment.apiBaseUrl.replace(/\/+$/, '') + '/TradeCotations';
  }

  /** Get all Cotations */
  // getAll(): Observable<Cotation[]> {
  //   return this.http.get<Cotation[]>(this.baseUrl).pipe(
  //     catchError(this.handleError)
  //   );
  // }
  getAllCotation(): Observable<Cotation[]> {
    return this.http.get<Cotation[]>(this.baseUrl);
  }
  

  /** Get Cotation by ID */
  // getById(id: number): Observable<Cotation> {
  //   return this.http.get<Cotation>(`${this.baseUrl}/${id}`).pipe(
  //     catchError(this.handleError)
  //   );
  // }


  getById(id: number | undefined): Observable<Cotation> {
    if (id === undefined || id === null) {
      throw new Error('getById called with invalid id');
    }
    return this.http.get<Cotation>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /** Create Cotation */
  // create(cotation: Partial<Cotation>): Observable<Cotation> {
  //   return this.http.post<Cotation>(this.baseUrl, cotation, this.httpOptions).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  create(cotationData: Cotation): Observable<Cotation> {
    return this.http.post<Cotation>(this.baseUrl, cotationData);
  }

  /** Update Cotation */
  update(id: number, cotation: Partial<Cotation>): Observable<Cotation> {
    return this.http.put<Cotation>(`${this.baseUrl}/${id}`, cotation, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  /** Delete Cotation */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /** Common HTTP headers */
  private get httpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${token}` if needed
      }),
    };
  }

  /** Error handling */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      errorMessage = `Server Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
