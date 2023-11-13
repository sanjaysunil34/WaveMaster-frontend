import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CaptureService {

  httpHeader={
    headers:new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private httpClient:HttpClient) { }

  getGraphData(xValue : any, yValue : any, newDataCount: any) : Observable<[]> {
    return this.httpClient.get<[]>("https://canvasjs.com/services/data/datapoints.php?xstart="+xValue+"&ystart="+yValue+"&length="+newDataCount+"type=json")
    .pipe(
      catchError(this.httpError)
    );
  }

  fetchData() : any {
    return 'Hi'
  }

  httpError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      msg = error.error.message;
    } else {
      msg = 'Error Code:${error.status}\nMessage:${error.message}';
    }
    console.log(msg);
    return throwError(msg);
  }
}
