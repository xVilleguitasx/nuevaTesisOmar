import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { environment } from "../../environments/environment";
import { AdminsInscrip } from '../models/adminInscrip.model';
import { AdminInscripService } from '../services/admin-inscrip.service';
import Swal from "sweetalert2";
@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.css']
})
export class FacturacionComponent implements OnInit {
  constructor(
    private _adminService: AdminInscripService,
    private _modalService: NgbModal
  ) { }
  encontrado=false;
  cedula:string="";
  closeResult = "";
  modalRef: NgbModalRef;
  documento ="";
  URL: string = environment.api + "/";
  inscripciones: AdminsInscrip[]=[];
  ngOnInit(): void {
  }
  cambiarEncontrado(){
    this.encontrado=!this.encontrado;
  }
  getInsctipcionByCI(){
      this._adminService.getInscripcionByCI(this.cedula).subscribe((result)=>{
        this.inscripciones=result.filter(result => result.factura.length!=0);
        if(this.inscripciones.length>0){
          this.cambiarEncontrado();
        }else{
          this.Mensaje("Estimado participante su factura no se encuentra registrada al momento","Dear participant, your invoice is not registered at the moment")
        }
      })
  }
  abrirPDF(URL) {
    if (URL != null && URL != "") {
      window.open(this.URL + URL, "_blank");
    }
  }
  siguiente(){
this.getInsctipcionByCI()
  }
  verFactura( content,PDF) {
    this.documento=URL+PDF;

    this.modalRef = this._modalService.open(content, { size: "xl" });
    this.modalRef.result.then(
      (result) => {
     
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
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
