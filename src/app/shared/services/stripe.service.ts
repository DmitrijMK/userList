import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {timer, Subject, Observable} from 'rxjs';
import {catchError, mergeMap} from 'rxjs/operators';
import {ICustomerList} from '../models/stripe.interface';

export const MILLISECONDS_TO_REFRESH = 30000;

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private baseUrl = 'https://api.stripe.com';
  private customerListUrl = `${this.baseUrl}/v1/customers?limit=15`;
  private createCustomerUrl = `${this.baseUrl}/v1/customers`;
  private readonly secretKey = '';

  customerList$ = new Subject<ICustomerList[]>();

  constructor(private httpClient: HttpClient) {
  }

  createCustomer(email, balance, description) {
    let params = new HttpParams();
    params = params.append('account_balance', balance);
    params = params.append('description', description);
    params = params.append('email', email);

    return this.httpClient.post(this.createCustomerUrl, params, {headers: this.getHeaders()});
  }

  chekIfCustomerExist(): Observable<any> {
    return this.httpClient.get(this.customerListUrl, {headers: this.getHeaders()})
      .pipe(catchError(this.handleError));
  }

  getCustomerList(): Observable<any> {
    return timer(0, MILLISECONDS_TO_REFRESH)
      .pipe(
        mergeMap(() => this.httpClient.get(this.customerListUrl, {headers: this.getHeaders()})),
        catchError(this.handleError)
      );
  }

  private getHeaders() {
    return new HttpHeaders({
      'Authorization': 'Bearer ' + this.secretKey
    });
  }

  private handleError(error: any) {
    const errorMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';

    return Observable.throw(errorMsg);
  }
}
