import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Autores } from "../models/autores.model";
@Injectable({
  providedIn: 'root'
})
export class AutoresService {

  api: string = environment.api;
  constructor(private http: HttpClient) {}
  
  getAutores() {
    return this.http.get<Autores[]>(`${this.api}/autores`);
  }
  insertAutor(autor:any): any{
    return this.http.post<Autores>(`${this.api}/autores`,autor);
  }
  getAutoresPaper(idPaper:string): any{
    const enviar={
      idPaper:idPaper
    }
    return this.http.post<Autores[]>(`${this.api}/autores/autoresPaper`,enviar);
  }
  editAutor(autor: any) {
    return this.http.put(`${environment.api}/autores/${autor.id}`, autor);
  }
  actulizarAutor(autor: any):any{
    return this.http.put(`${environment.api}/autores/actualizar/${autor.id}`, autor);
  }
  deleteAutor(id: string) {
    return this.http.delete(`${environment.api}/autores/${id}`);
  }
}
