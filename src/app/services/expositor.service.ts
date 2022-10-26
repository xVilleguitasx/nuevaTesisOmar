import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Expositor } from "../models/expositor.model";
@Injectable({
  providedIn: 'root'
})
export class ExpositorService {


  api: string = environment.api;
  constructor(private http: HttpClient) {}
  
  getAutores() {
    return this.http.get<Expositor[]>(`${this.api}/expositor`);
  }
  getExpositor(id:string) {
    return this.http.get<Expositor>(`${this.api}/expositor/${id}`);
  }
  generarCertificado(expositor:any): any{
    return this.http.post<Expositor>(`${this.api}/expositor`,expositor);
  }
  
}
