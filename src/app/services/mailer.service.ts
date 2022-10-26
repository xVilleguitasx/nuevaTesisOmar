import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
@Injectable({
  providedIn: 'root'
})
export class MailerService {

  api: string = environment.api;
  constructor(private http: HttpClient) {}

  
  mailInscritos(mailInscritos:any): any{
    return this.http.post(`${this.api}/mailer/mailInscritos`,mailInscritos);
  }
  mailRegistro(mailRegistro:any): any{
    return this.http.post(`${this.api}/mailer/mailRegistro`,mailRegistro);
  }
  mailSubidaTiket(mail:string,nombre:string,idioma:string): any{
   const  email = {
      destinatario:mail,
      edicion:nombre,
      idioma:idioma
    }
    return this.http.post(`${this.api}/mailer/mailSubidaTiket`,email);
  }
  mailVerificacion(verifiacion:any): any{
    console.log(verifiacion);
     return this.http.post(`${this.api}/mailer/mailVerificacion`,verifiacion);
   }
}
