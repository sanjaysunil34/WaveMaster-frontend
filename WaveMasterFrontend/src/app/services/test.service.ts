import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, throwError } from 'rxjs';
import { ConnectionService } from './connection.service';
import { httpError } from '../helpers/http-error';
import { BaseUrl, httpHeader } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  private testDataSubject = new Subject<any>();

  constructor(private httpClient:HttpClient, private connectionService: ConnectionService) { }

  testComponent(command: string) : Observable<string>{
    return this.httpClient.post<string>(BaseUrl + '/test', JSON.stringify(command), httpHeader())
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

}
