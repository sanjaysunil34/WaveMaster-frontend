import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { PlotData } from '../models/plotData';
import { SignalData } from '../models/signalData';

@Injectable({
  providedIn: 'root'
})
export class CaptureService {
  baseUrl: string = "http://localhost:3000"

  httpHeader={
    headers:new HttpHeaders({
      'Content-Type': 'application/json',      
    })
  }

  constructor(private httpClient:HttpClient) { }

  getGraphData() : Observable<PlotData> {
    return this.httpClient.get<PlotData>(this.baseUrl + "/capture/plotdata")
    .pipe(
      catchError(this.httpError)
    );
  }

  getSignalData() : Observable<SignalData> {
    return this.httpClient.get<SignalData>(this.baseUrl + "/capture/signaldata")
    .pipe(
      catchError(this.httpError)
    )
  }

  plotCapture(command: string) : any {
    console.log(command)
    return this.httpClient.post<any>(this.baseUrl + "/capture/plotcommand",JSON.stringify(command),this.httpHeader)
    .pipe(
      catchError(this.httpError)
    )
  }

  httpError(error: HttpErrorResponse) {
      
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      msg = error.error.message;
    } else {
      msg = `Error Code : ${error.status}\n${error.error}`;
    }
    console.log(msg);
    return throwError(msg);
  }
}
