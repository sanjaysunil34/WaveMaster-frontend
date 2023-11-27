import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, throwError } from 'rxjs';
import { ConnectionService } from './connection-service.service';
import { httpError } from '../helpers/HttpError';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  baseUrl: string = "http://localhost:3000"

  httpHeader={
    headers:new HttpHeaders({
      'Content-Type': 'application/json',      
    })
  }

  private testDataSubject = new Subject<any>();

  constructor(private httpClient:HttpClient, private connectionService: ConnectionService) { }

  testComponent(command: string) : Observable<string>{
    return this.httpClient.post<string>(this.baseUrl + '/test', JSON.stringify(command), this.httpHeader)
    .pipe(
      catchError(err => httpError(err))
    );
  }

  public addTestDataListener = () => {
    this.connectionService.hubConnection.on("test", (data) => {   
      this.testDataSubject.next(data);  
    })
  }  

  public stopTestDataListener = () => {
    this.connectionService.hubConnection.off("test");
  }   

  getTestDataSubject() {
    return this.testDataSubject.asObservable();
  }

  // httpError(error: HttpErrorResponse) {
      
  //   let msg = '';    
  //   if (error.error instanceof ErrorEvent) {
  //     msg = error.message;
  //   } else {
  //     msg = `Error Code : ${error.status}\n${error.error}`;
  //   }
  //   console.log(msg);
  //   return throwError(msg);
  // }
}
