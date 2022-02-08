import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from "../../environments/environment"

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  
  constructor(
    protected readonly httpClient: HttpClient,
  ) { }

  getFilesList(): Observable<any> {
    return this.httpClient.get(`${ environment.API_URL }/files`);
  }

  upload(formData: any): Observable<any> {
    return this.httpClient.post(`${ environment.API_URL }/upload`, formData)
  }

  downloadFile(id: string): Observable<any>{
    const httpOptions: Object = {
      responseType: 'blob',
    };
    return this.httpClient.get(`${ environment.API_URL }/download/${id}`, httpOptions);
  }
}
