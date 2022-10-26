
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { TipoUsuario } from "../models/tipoUsuario.model";
@Injectable({
  providedIn: 'root'
})
export class TipoUsuarioService {

  api: string = environment.api;
  constructor(private http: HttpClient) {}


  getTipoUsuarios() {
    return this.http.get<TipoUsuario[]>(`${this.api}/tipoUsuario`);
  }
}
