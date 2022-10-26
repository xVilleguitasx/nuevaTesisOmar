import { Component, OnInit } from '@angular/core';
import { AdminsInscrip } from '../models/adminInscrip.model';
import { environment } from "../../environments/environment";
import { AdminInscripService } from '../services/admin-inscrip.service';
import Swal from "sweetalert2";
import { PaperService } from '../services/paper.service';
import { PersonaPaper } from '../models/personaPaper.model';
@Component({
  selector: 'app-certificado',
  templateUrl: './certificado.component.html',
  styleUrls: ['./certificado.component.css']
})
export class CertificadoComponent implements OnInit {
  inscripciones: AdminsInscrip[]=[];
  papers:PersonaPaper[]=[];
  cedula:string="";
  URL: string = environment.api + "/";
  constructor(
    private _adminService: AdminInscripService,
    private _paperService: PaperService
  ) { }
  encontrado=false;
  ngOnInit(): void {
  }
  cambiarEncontrado(){
    this.encontrado=!this.encontrado;
  }
  abrirPDF(URL) {
    if (URL != null && URL != "") {
      window.open(this.URL + URL, "_blank");
    }
  }
  getInsctipcionByCI(){
    this.inscripciones=[];
    this.papers=[];
    this._adminService.getInscripcionByCI(this.cedula).subscribe((result)=>{
      this.inscripciones=result.filter(result => result.certificado_I!=null || result.certificado_P!=null || result.certificado_Autor!=null);
      if(this.inscripciones.length>0){
        this.getCertificadosAutor(this.inscripciones[0].numero);
        this.cambiarEncontrado();
      }else{
        this.Mensaje("Estimado participante su certificado no se encuentra registrado al momento","Dear participant, your certificate is not registered at the moment")
      }
    
    });
   

}
getCertificadosAutor(id:number){
      this._paperService.getPaper(String(id)).subscribe((result)=>{
        this.papers=result;
      })
}
  
Mensaje(titulo: string, texto: string) {
  Swal.fire({
    title: titulo,
    text: texto,
    icon: "error",
    confirmButtonText: "Aceptar",
    confirmButtonColor: "#7A1E19",
    iconColor: "#7A1E19",
    color: "#7A1E19",
  });
}
}
