import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
@Injectable({
  providedIn: 'root'
})
export class CertificadosAsistenciaService {
  api: string = environment.api;
  constructor(private http: HttpClient) {}

 
  crearCertificado(certificado:any): any{
    return this.http.post<any>(`${this.api}/certificadosAsistencia`,certificado);
  }
  eliminarCertificado(id: string) {
    return this.http.delete(`${environment.api}/certificadosAsistencia/${id}`);
  }
}
