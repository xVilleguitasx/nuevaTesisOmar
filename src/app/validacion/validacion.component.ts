import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { InformacionCongreso } from "../models/informacionCongreso.model";
import { ConfiguracionService } from "../services/configuracion.service";
import { InformacionCongresoService } from "../services/informacion-congreso.service";
import { InscripcionService } from "../services/inscripcion.service";
import { MailerService } from "../services/mailer.service";
import { PersonasService } from "../services/personas.service";
@Component({
  selector: "app-validacion",
  templateUrl: "./validacion.component.html",
  styleUrls: ["./validacion.component.css"],
})
export class ValidacionComponent implements OnInit {
  nombre: string = "";
  file: File = null;
  textoImg: string = "Seleccionar archivo... / Selected File";
  comprobanteDeposito: string = "";
  idPersona: string = null;
  idioma="";
  mostrarMensaje: boolean = false;
  email = "";
  observacion="";
  infoCongreso: InformacionCongreso = {
    id: 1,
    nombre: "",
    titulo: "",
    fecha: "",
    logo: "",
  };
  constructor(
    private inscripcionService: InscripcionService,
    private personaService: PersonasService,
    private router: Router,
    private configService: ConfiguracionService,
    private _mailerService: MailerService,
    private _informacionCongresoService: InformacionCongresoService
  ) {}
  documentoIdentidad: string = "";
  encontrado: boolean = false;
  ngOnInit(): void {
    this.getInformacionCongreso();
  }
  cambiarEncontrado() {
    this.encontrado = !this.encontrado;
  }
  habiliar() {
    this.configService.getConf().subscribe((result) => {
      result.forEach((element) => {
        if (element.nombre === "Validación") {
          if (!element.estado) {
            this.router.navigate(["/acerca-de"]);
          }
        }
      });
    });
  }
  getInformacionCongreso() {
    this._informacionCongresoService.getInfoAll().subscribe((result) => {
      this.infoCongreso = result[0];
    });
  }
  async buscarInscripcion() {
    if (this.documentoIdentidad.length != 0) {
      await this.personaService
        .getPersona(this.documentoIdentidad)
        .subscribe((result) => {
          this.nombre = result.nom_paterno + " " + result.ape_paterno;
          this.email = result.email;
          this.inscripcionService
            .getInscripcion(result.id)
            .subscribe((result) => {
              this.idPersona = result.id_per_pert;
              this.idioma=result.idioma;
              if (result.num_deposito != null && result.foto_deposito != null) {
                this.incripcionExistente();
                this.comprobanteDeposito = result.num_deposito;
              } else {
                this.cambiarEncontrado();
              }
            });
        });
      setTimeout(() => {
        if (this.idPersona === null) {
          this.mensaje("Error!", "Usted no se encuentra registado / You are not registered", "error");
        }
      }, 2000);
    }
  }
  mensaje(titulo: string, texto: string, icono: any) {
    Swal.fire({
      title: titulo,
      text: texto,
      icon: icono,
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#7A1E19",
      iconColor: "#7A1E19",
      color: "#7A1E19",
    });
  }
  renameFile(originalFile, newName) {
    return new File([originalFile], newName, {
      type: originalFile.type,
      lastModified: originalFile.lastModified,
    });
  }
  onFileSelected(event) {
    this.file = this.renameFile(
      event.target.files[0],
      this.documentoIdentidad + ".jpg"
    );
    if (this.file.name !== null && this.file.name != "") {
      if (this.file.size <= 2000000) {
        this.textoImg = this.file.name;
      } else {
        /* Mensaje archivo */
        this.Mensaje("Nota / Note:", "La imagen no puede superar los 2MB de tamaño. / The image cannot exceed 2MB in size.");

        this.file = null;
      }
    } else {
      this.textoImg = "Seleccionar archivo... / Select File...";
      this.file = null;
    }
  }
  enviarDatos() {
    if (this.file != null && this.comprobanteDeposito != "") {
      const fecha = new Date();
      const fechaValidacion =
        fecha.getFullYear() + "-" + fecha.getMonth() + "-" + fecha.getDay();

      var data = new FormData();
      data.append("num_deposito", this.comprobanteDeposito);
      data.append("foto_deposito", this.file);
      const HoraValidacion =
        fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
      data.append("Hora_Registro_Deposito", HoraValidacion);
      data.append("fecha_Registro_de_validacion", fechaValidacion);
      data.append("observacion", this.observacion);
      this.inscripcionService.updateComprobante(this.idPersona, data).subscribe(
        this.mensaje("Validación / Validation ", "Registro Validado / Validated Registration", "success"),
        this._mailerService
          .mailSubidaTiket(this.email, this.infoCongreso.nombre,this.idioma)
          .subscribe((result) => {}),
        this.router.navigate(["/acerca-de"])
      );
    } else {
      this.mostrarMensaje = true;
      setTimeout(() => {
        this.mostrarMensaje = false;
      }, 5000);
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
  incripcionExistente() {
    Swal.fire({
      title: "Usted ya subio su comprobante, desea continuar? / You already uploaded your receipt, do you want to continue?",
      text: "¿Deceas editar los datos? / Do you want to edit the data?",
      icon: "info",
      iconColor: "#7A1E19",
      color: "#7A1E19",
      showCancelButton: true,
      confirmButtonColor: "#7A1E19",
      cancelButtonColor: "#85929E",
      confirmButtonText: "SI",
      cancelButtonText: "NO",
    }).then((result) => {
      if (result.value) {
        console.log(result.value);
        this.cambiarEncontrado();
      } else {
        console.log(result.value);
        this.comprobanteDeposito = "";
      }
    });
  }
}
